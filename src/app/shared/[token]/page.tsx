'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDocumentShare } from '@/hooks/useDocumentShare';
import { Document } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from '@/components/MarkdownComponents';

export default function SharedDocumentPage() {
  const params = useParams();
  const token = params.token as string;
  const [document, setDocument] = useState<Document | null>(null);
  const { loadSharedDocument, isLoading, error } = useDocumentShare();

  useEffect(() => {
    if (token) {
      loadDocument();
    }
  }, [token]);

  const loadDocument = async () => {
    const loadedDocument = await loadSharedDocument(token);
    if (loadedDocument) {
      setDocument(loadedDocument);
    }
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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {document.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              공유된 문서 • {new Date(document.created_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
          >
            새 문서 만들기
          </button>
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