'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDocumentShare } from '@/hooks/useDocumentShare';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Document } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from '@/components/MarkdownComponents';

export default function SharedDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [document, setDocument] = useState<Document | null>(null);
  const { loadSharedDocument, isLoading, error } = useDocumentShare();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const loadDocument = useCallback(async () => {
    if (!token) return;
    
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">문서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            문서를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">문서를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          {/* 제목 영역 */}
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {document.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              공유된 문서 • {new Date(document.created_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* 내용 복사하기 */}
            <button
              onClick={handleCopyContent}
              disabled={!document}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md transition-colors text-sm disabled:opacity-50"
              title="마크다운 내용 복사"
            >
              {isCopied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  복사됨
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  내용 복사
                </>
              )}
            </button>

            {/* 편집하기 */}
            <button
              onClick={handleEditDocument}
              disabled={!document}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm disabled:opacity-50"
              title="이 문서를 편집하기"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              이 문서 편집하기
            </button>

            {/* 새 문서 만들기 */}
            <button
              onClick={handleNewDocument}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
              title="새로운 문서 만들기"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              새 문서 만들기
            </button>
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