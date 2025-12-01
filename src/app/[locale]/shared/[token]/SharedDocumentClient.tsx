'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDocumentShare } from '@/hooks/useDocumentShare';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useHashNavigation } from '@/hooks/useHashNavigation';
import { useTheme } from '@/hooks/useTheme';
import { Document } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createMarkdownComponents } from '@/components/MarkdownComponents';
import { validateShareToken } from '@/utils/validation';
import { extractSummaryFromMarkdown, extractTitleFromMarkdown } from '@/utils/markdown';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface SharedDocumentClientProps {
  initialToken?: string;
}

export default function SharedDocumentClient({ initialToken }: SharedDocumentClientProps = {}) {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('sharedPage');
  const tPreview = useTranslations('preview');
  const tHeader = useTranslations('header');
  const locale = params.locale as string || 'en';
  const token = initialToken || (params.token as string);
  const [document, setDocument] = useState<Document | null>(null);
  const { loadSharedDocument, isLoading, error } = useDocumentShare();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const { theme, toggleTheme } = useTheme();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Create markdown components with translations
  // Note: goToSection uses {section} as a placeholder that gets replaced in the component
  const markdownComponents = useMemo(() => createMarkdownComponents({
    goToSection: tPreview.raw('goToSection'),
    copyLink: tPreview('copyLink'),
    copyCode: tPreview('copyCode'),
    codeCopied: tPreview('codeCopied'),
    copyCodeAriaLabel: tPreview('copyCodeAriaLabel'),
    codeCopiedAriaLabel: tPreview('codeCopiedAriaLabel'),
  }), [tPreview]);

  // Hash navigation hook
  useHashNavigation();

  const loadDocument = useCallback(async () => {
    try {
      console.log('토큰 로딩 시작:', token);
      
      // URL 해시가 포함된 경우 토큰만 추출
      const cleanToken = token?.split('#')[0];
      console.log('정리된 토큰:', cleanToken);
      
      // 클라이언트 사이드 토큰 검증
      if (!cleanToken || !validateShareToken(cleanToken)) {
        console.error('유효하지 않은 공유 링크입니다. 토큰:', cleanToken);
        return;
      }

      console.log('문서 로드 시작...');
      const loadedDocument = await loadSharedDocument(cleanToken);
      console.log('로드된 문서:', loadedDocument);
      
      if (loadedDocument) {
        setDocument(loadedDocument);
      }
    } catch (error) {
      console.error('문서 로드 중 에러:', error);
    }
  }, [token, loadSharedDocument]);

  useEffect(() => {
    console.log('useEffect 실행됨. 토큰:', token);
    if (token) {
      loadDocument();
    } else {
      console.warn('토큰이 없습니다.');
    }
  }, [token, loadDocument]);

  // Get og:locale based on current locale
  const getOgLocale = (loc: string): string => {
    const localeMap: Record<string, string> = {
      'en': 'en_US',
      'ko': 'ko_KR',
      'ja': 'ja_JP',
      'zh': 'zh_CN'
    };
    return localeMap[loc] || 'en_US';
  };

  // Set page title and metadata when document loads
  useEffect(() => {
    if (document) {
      const summary = extractSummaryFromMarkdown(document.content);
      const siteName = t('freeMarkdownEditor');
      const description = summary ? `${summary}` : `${document.title} - ${siteName}`;

      // Dynamic page title
      const originalTitle = window.document.title;
      window.document.title = `${document.title} | ${siteName}`;

      // Dynamic meta tag update helper
      const updateMetaTag = (property: string, content: string) => {
        const selector = property.startsWith('og:') || property.startsWith('twitter:')
          ? `meta[property="${property}"]`
          : `meta[name="${property}"]`;

        let meta = window.document.querySelector(selector);
        if (!meta) {
          meta = window.document.createElement('meta');
          if (property.startsWith('og:') || property.startsWith('twitter:')) {
            meta.setAttribute('property', property);
          } else {
            meta.setAttribute('name', property);
          }
          window.document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Basic metadata
      updateMetaTag('description', description);

      // Open Graph (Facebook, KakaoTalk, etc.)
      updateMetaTag('og:title', document.title);
      updateMetaTag('og:description', description);
      updateMetaTag('og:type', 'article');
      updateMetaTag('og:url', window.location.href);
      updateMetaTag('og:site_name', siteName);
      updateMetaTag('og:locale', getOgLocale(locale));

      // Twitter Cards
      updateMetaTag('twitter:card', 'summary');
      updateMetaTag('twitter:title', document.title);
      updateMetaTag('twitter:description', description);

      // Additional metadata
      updateMetaTag('og:article:author', siteName);
      updateMetaTag('og:article:published_time', document.created_at);

      // Restore original title on unmount
      return () => {
        window.document.title = originalTitle;
      };
    }
  }, [document, locale, t]);

  // 외부 클릭 시 더보기 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-more-menu]')) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      window.document.addEventListener('mousedown', handleClickOutside);
      return () => window.document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMoreMenu]);

  // 편집하기 - 메인 페이지로 이동하면서 내용 전달
  const handleEditDocument = () => {
    if (!document) return;
    
    // 로컬 스토리지에 임시 저장
    window.localStorage.setItem('temp_shared_document', JSON.stringify({
      title: document.title,
      content: document.content,
      fromShared: true
    }));
    
    router.push('/');
  };

  // 내용 복사하기
  const handleCopyContent = async () => {
    if (!document) return;
    await copyToClipboard(document.content);
  };

  // 새 문서 만들기
  const handleNewDocument = () => {
    router.push('/');
  };

  // 마크다운 렌더링 결과를 메모이제이션하여 성능 최적화
  const renderedMarkdown = useMemo(() => (
    document ? (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {document.content}
      </ReactMarkdown>
    ) : null
  ), [document]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('error')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('expiredOrNotFound')}
          </p>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {t('backToEditor')}
          </button>
        </div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4" role="banner">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 영역 - 모바일 최적화 */}
          <div className="space-y-3">
            {/* 제목과 로고 */}
            <div className="flex items-start gap-2">
              <Image 
                src="/logo.png" 
                alt="Markdown Editor Logo" 
                width={32}
                height={32}
                className="w-6 h-6 md:w-8 md:h-8 object-contain flex-shrink-0 mt-0.5"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white break-words flex-1">
                {document.title}
              </h1>
            </div>
            
            {/* Date and controls */}
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {t('sharedDocument')} · {new Date(document.created_at).toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US')}
              </p>
              <div className="flex items-center gap-1">
                <LanguageSwitcher />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label={theme === 'light' ? tHeader('darkMode') : tHeader('lightMode')}
                  title={theme === 'light' ? tHeader('darkMode') : tHeader('lightMode')}
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* 액션 버튼들 - 모바일 친화적 레이아웃 */}
          <div className="flex items-center justify-between gap-2">
            {/* 주요 액션 버튼들 - 항상 표시 */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Edit - most important action */}
              <button
                onClick={handleEditDocument}
                disabled={!document}
                className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm disabled:bg-green-400 flex-shrink-0"
                title={t('openInEditor')}
                aria-label={t('openInEditor')}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">{t('openInEditor')}</span>
                <span className="sm:hidden">{t('openInEditor').split(' ')[0]}</span>
              </button>

              {/* Copy content */}
              <button
                onClick={handleCopyContent}
                disabled={!document}
                className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 flex-shrink-0"
                title={t('copyToClipboard')}
                aria-label={t('copyToClipboard')}
              >
                {isCopied ? (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden sm:inline">{t('copied')}</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">{t('copyToClipboard')}</span>
                    <span className="sm:hidden">{t('copyToClipboard').split(' ')[0]}</span>
                  </>
                )}
              </button>
            </div>

            {/* More menu and new document button */}
            <div className="flex items-center gap-2">
              {/* Desktop: New document button */}
              <button
                onClick={handleNewDocument}
                className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                title={t('backToEditor')}
                aria-label={t('backToEditor')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>{t('backToEditor')}</span>
              </button>

              {/* Mobile: More menu */}
              <div className="relative sm:hidden" data-more-menu>
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                  title={t('backToEditor')}
                  aria-label={t('backToEditor')}
                  aria-expanded={showMoreMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={() => {
                        handleNewDocument();
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>{t('backToEditor')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <article
          className="prose prose-slate dark:prose-invert prose-lg max-w-4xl mx-auto p-4 md:p-8 prose-headings:scroll-mt-24 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-blockquote:border-l-blue-500 prose-img:rounded-lg prose-img:shadow-lg prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-table:overflow-hidden prose-td:p-2 prose-th:p-2 prose-th:bg-gray-100 dark:prose-th:bg-gray-800"
          aria-label={t('preview')}
        >
          {renderedMarkdown}
        </article>
      </main>
    </div>
  );
} 