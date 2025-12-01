'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDocumentShare } from '@/hooks/useDocumentShare';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useHashNavigation } from '@/hooks/useHashNavigation';
import { useTheme } from '@/hooks/useTheme';
import { Document } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createMarkdownComponents } from '@/components/MarkdownComponents';

// Default translations for non-locale shared route (Korean)
const markdownComponents = createMarkdownComponents({
  goToSection: '{section} 섹션으로 이동',
  copyLink: '링크 복사',
  copyCode: '코드 복사',
  codeCopied: '복사됨!',
  copyCodeAriaLabel: '코드를 클립보드에 복사',
  codeCopiedAriaLabel: '코드가 클립보드에 복사됨',
});
import { validateShareToken } from '@/utils/validation';
import { extractSummaryFromMarkdown, extractTitleFromMarkdown } from '@/utils/markdown';
import Image from 'next/image';

interface SharedDocumentClientProps {
  initialToken?: string;
}

export default function SharedDocumentClient({ initialToken }: SharedDocumentClientProps = {}) {
  const params = useParams();
  const router = useRouter();
  const token = initialToken || (params.token as string);
  const [document, setDocument] = useState<Document | null>(null);
  const { loadSharedDocument, isLoading, error } = useDocumentShare();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const { theme, toggleTheme } = useTheme();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // 해시 네비게이션 훅 사용
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

  // 문서가 로드되면 페이지 제목과 메타데이터 설정 (개선된 버전)
  useEffect(() => {
    if (document) {
      // 콘텐츠에서 깔끔한 제목 추출 (마크다운 문법 제거)
      const cleanTitle = extractTitleFromMarkdown(document.content);
      const summary = extractSummaryFromMarkdown(document.content);
      const description = summary ? `${summary}` : `${cleanTitle} - FREE 마크다운 에디터로 작성된 문서`;

      // 페이지 제목 동적 변경
      const originalTitle = window.document.title;
      window.document.title = `${cleanTitle} | FREE 마크다운 에디터`;

      // 메타태그 동적 설정/업데이트 (더 자세한 정보 포함)
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

      // 기본 메타데이터
      updateMetaTag('description', description);

      // Open Graph (Facebook, KakaoTalk 등)
      updateMetaTag('og:title', cleanTitle);
      updateMetaTag('og:description', description);
      updateMetaTag('og:type', 'article');
      updateMetaTag('og:url', window.location.href);
      updateMetaTag('og:site_name', 'FREE 마크다운 에디터');
      updateMetaTag('og:locale', 'ko_KR');

      // Twitter Cards
      updateMetaTag('twitter:card', 'summary');
      updateMetaTag('twitter:title', cleanTitle);
      updateMetaTag('twitter:description', description);
      
      // 추가 메타데이터 (카카오톡 최적화)
      updateMetaTag('og:article:author', 'FREE 마크다운 에디터');
      updateMetaTag('og:article:published_time', document.created_at);

      // 컴포넌트 언마운트 시 원래 제목으로 복원
      return () => {
        window.document.title = originalTitle;
      };
    }
  }, [document]);

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
          <p className="text-gray-600 dark:text-gray-300">문서를 불러오는 중...</p>
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
            문서를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            홈으로 돌아가기
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
                {extractTitleFromMarkdown(document.content)}
              </h1>
            </div>
            
            {/* 날짜와 다크모드 토글 */}
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                공유된 문서 · {new Date(document.created_at).toLocaleDateString('ko-KR')}
              </p>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
                title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
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
          
          {/* 액션 버튼들 - 모바일 친화적 레이아웃 */}
          <div className="flex items-center justify-between gap-2">
            {/* 주요 액션 버튼들 - 항상 표시 */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* 편집하기 - 가장 중요한 액션 */}
              <button
                onClick={handleEditDocument}
                disabled={!document}
                className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm disabled:bg-green-400 flex-shrink-0"
                title="이 문서를 편집하기"
                aria-label="이 문서를 마크다운 에디터에서 편집합니다"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">이 문서 편집하기</span>
                <span className="sm:hidden">편집</span>
              </button>

              {/* 내용 복사하기 */}
              <button
                onClick={handleCopyContent}
                disabled={!document}
                className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 flex-shrink-0"
                title="마크다운 내용 복사"
                aria-label="마크다운 원본 내용을 클립보드에 복사합니다"
              >
                {isCopied ? (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden sm:inline">복사됨</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">내용 복사</span>
                    <span className="sm:hidden">복사</span>
                  </>
                )}
              </button>
            </div>

            {/* 더보기 메뉴 및 새 문서 버튼 */}
            <div className="flex items-center gap-2">
              {/* 데스크톱: 새 문서 버튼 직접 표시 */}
              <button
                onClick={handleNewDocument}
                className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                title="새로운 문서 만들기"
                aria-label="새로운 마크다운 문서를 작성합니다"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>새 문서</span>
              </button>

              {/* 모바일: 더보기 메뉴 */}
              <div className="relative sm:hidden" data-more-menu>
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                  title="더보기 메뉴"
                  aria-label="추가 옵션 메뉴 열기"
                  aria-expanded={showMoreMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {/* 드롭다운 메뉴 */}
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
                      <span>새 문서 만들기</span>
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
          aria-label="공유된 마크다운 문서 미리보기"
        >
          {renderedMarkdown}
        </article>
      </main>
    </div>
  );
} 