'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDocumentShare } from '@/hooks/useDocumentShare';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Document } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from '@/components/MarkdownComponents';
import { validateShareToken } from '@/utils/validation';
import { extractSummaryFromMarkdown } from '@/utils/markdown';

export default function SharedDocumentClient() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [document, setDocument] = useState<Document | null>(null);
  const { loadSharedDocument, isLoading, error } = useDocumentShare();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const loadDocument = useCallback(async () => {
    // 클라이언트 사이드 토큰 검증
    if (!validateShareToken(token)) {
      console.error('유효하지 않은 공유 링크입니다.');
      return;
    }

    const loadedDocument = await loadSharedDocument(token);
    if (loadedDocument) {
      setDocument(loadedDocument);
    }
  }, [token, loadSharedDocument]);

  useEffect(() => {
    if (token) {
      loadDocument();
    }
  }, [token, loadDocument]);

  // 문서가 로드되면 페이지 제목과 메타데이터 설정 (개선된 버전)
  useEffect(() => {
    if (document) {
      const summary = extractSummaryFromMarkdown(document.content);
      const description = summary ? `${summary}` : `${document.title} - FREE 마크다운 에디터로 작성된 문서`;
      
      // 페이지 제목 동적 변경
      const originalTitle = window.document.title;
      window.document.title = `${document.title} | FREE 마크다운 에디터`;
      
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
      updateMetaTag('og:title', document.title);
      updateMetaTag('og:description', description);
      updateMetaTag('og:type', 'article');
      updateMetaTag('og:url', window.location.href);
      updateMetaTag('og:site_name', 'FREE 마크다운 에디터');
      updateMetaTag('og:locale', 'ko_KR');
      
      // Twitter Cards
      updateMetaTag('twitter:card', 'summary');
      updateMetaTag('twitter:title', document.title);
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
    localStorage.setItem('temp_shared_document', JSON.stringify({
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">문서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          {/* 제목 영역 */}
          <div className="mb-3">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
              {document.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              공유된 문서 • {new Date(document.created_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
          
          {/* 액션 버튼들 - 모바일 친화적 레이아웃 */}
          <div className="flex items-center justify-between gap-2">
            {/* 주요 액션 버튼들 - 항상 표시 */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* 편집하기 - 가장 중요한 액션 */}
              <button
                onClick={handleEditDocument}
                disabled={!document}
                className="flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md transition-colors text-sm disabled:opacity-50 flex-shrink-0"
                title="이 문서를 편집하기"
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
                className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md transition-colors text-sm disabled:opacity-50 flex-shrink-0"
                title="마크다운 내용 복사"
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
                className="hidden sm:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors text-sm"
                title="새로운 문서 만들기"
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
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                  title="더보기 메뉴"
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

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <article 
          className="py-4 md:p-6 max-w-full prose prose-slate dark:prose-invert prose-lg md:prose-xl prose-headings:scroll-mt-4 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-blockquote:border-l-blue-500 prose-img:rounded-lg prose-img:shadow-lg" 
          aria-label="공유된 마크다운 문서"
          style={{
            fontSize: 'clamp(14px, 4vw, 18px)',
            lineHeight: '1.7',
            maxWidth: '100%',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {document.content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
} 