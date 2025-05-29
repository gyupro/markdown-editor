'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import { markdownComponents } from '@/components/MarkdownComponents';
import { Toolbar } from '@/components/Toolbar';
import { DEFAULT_MARKDOWN } from '@/constants/markdown';

type MobileTab = 'editor' | 'preview';

export default function HomePage() {
  const {
    markdown,
    setMarkdown,
    isClient,
    isFullscreen,
    setIsFullscreen,
    isExporting,
    textareaRef,
    previewRef,
    handleExportToPDF,
    insertFormatting,
    insertAtCursor,
    insertHeading,
    insertTable,
  } = useMarkdownEditor(DEFAULT_MARKDOWN);

  // 모바일 탭 상태 추가
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTab>('editor');

  // 툴바 액션 핸들러들
  const toolbarHandlers = {
    onHeading: insertHeading,
    onBold: () => insertFormatting('**', '**'),
    onItalic: () => insertFormatting('*', '*'),
    onStrikethrough: () => insertFormatting('~~', '~~'),
    onInlineCode: () => insertFormatting('`', '`'),
    onLink: () => insertFormatting('[', '](url)'),
    onImage: () => insertFormatting('![alt](', ')'),
    onBulletList: () => insertAtCursor('- '),
    onNumberedList: () => insertAtCursor('1. '),
    onQuote: () => insertFormatting('> ', ''),
    onTable: insertTable,
    onCodeBlock: () => insertAtCursor('```\n\n```'),
    onExportPDF: handleExportToPDF,
  };

  // 모바일 탭 컴포넌트
  const renderMobileTabs = () => (
    <div className="md:hidden flex bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setMobileActiveTab('editor')}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
          mobileActiveTab === 'editor'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
        aria-pressed={mobileActiveTab === 'editor'}
      >
        📝 편집기
      </button>
      <button
        onClick={() => setMobileActiveTab('preview')}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
          mobileActiveTab === 'preview'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
        aria-pressed={mobileActiveTab === 'preview'}
      >
        ✨ 미리보기
      </button>
    </div>
  );

  const renderHeader = () => (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4" role="banner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">Markdown Editor</h1>
          <a 
            href="https://github.com/gyupro/markdown-editor" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm items-center gap-1"
            title="GitHub Repository"
            aria-label="GitHub에서 오픈소스 코드 보기"
          >
            <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span className="hidden md:inline">Open Source</span>
          </a>
        </div>
        <nav className="flex gap-2 md:gap-3" aria-label="메인 작업">
          <button
            onClick={handleExportToPDF}
            disabled={isExporting}
            className="px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 text-sm"
            aria-label={isExporting ? "PDF 생성 중입니다. 잠시만 기다려주세요." : "현재 문서를 PDF로 출력합니다"}
          >
            {isExporting ? (
              <>
                <span className="animate-spin text-xs md:text-base" aria-hidden="true">⏳</span>
                <span className="hidden sm:inline">PDF 생성 중...</span>
                <span className="sm:hidden">생성중...</span>
              </>
            ) : (
              <>
                <span className="text-xs md:text-base" aria-hidden="true">📄</span> 
                <span className="hidden sm:inline">PDF 출력</span>
                <span className="sm:hidden">PDF</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            aria-label="전체화면으로 미리보기를 확인합니다"
          >
            <span className="text-xs md:text-base" aria-hidden="true">🖥️</span> 
            <span className="hidden sm:inline">전체화면 미리보기</span>
            <span className="sm:hidden">전체화면</span>
          </button>
        </nav>
      </div>
    </header>
  );

  const renderEditor = () => (
    <section 
      className={`${mobileActiveTab === 'editor' ? 'flex' : 'hidden'} md:flex md:w-1/2 flex-col border-r border-gray-200 dark:border-gray-700`} 
      aria-label="마크다운 편집기"
    >
      <header className="hidden md:block bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">📝 EDITOR</h2>
      </header>
      
      <Toolbar {...toolbarHandlers} />

      <textarea
        ref={textareaRef}
        className="flex-1 w-full p-4 text-sm font-mono leading-6 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 resize-none focus:outline-none border-none"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="여기에 마크다운을 입력하세요..."
        spellCheck={false}
        aria-label="마크다운 텍스트 입력 영역"
        aria-describedby="editor-help"
      />
      <div id="editor-help" className="sr-only">
        마크다운 문법을 사용하여 텍스트를 작성할 수 있습니다. 
        키보드 단축키: Ctrl+B (굵게), Ctrl+I (기울임), Ctrl+K (링크), Ctrl+P (PDF 출력)
      </div>
    </section>
  );

  const renderPreview = () => (
    <section 
      className={`${mobileActiveTab === 'preview' ? 'flex' : 'hidden'} md:flex md:w-1/2 flex-col`} 
      aria-label="미리보기"
    >
      <header className="hidden md:block bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">✨ PREVIEW</h2>
      </header>
      <div className="flex-1 overflow-auto overflow-x-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 px-4 md:px-0">
        {isClient ? (
          <article 
            ref={previewRef} 
            className="py-4 md:p-6 max-w-full prose prose-slate dark:prose-invert prose-lg md:prose-xl prose-headings:scroll-mt-4 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-blockquote:border-l-blue-500 prose-img:rounded-lg prose-img:shadow-lg" 
            aria-label="렌더링된 마크다운 미리보기"
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
              {markdown}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="p-4 text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
            미리보기를 로드하는 중...
          </div>
        )}
      </div>
    </section>
  );

  const renderFullscreenModal = () => (
    <div 
      className="fixed inset-0 z-50 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-title"
    >
      <div className="flex flex-col h-full">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4" role="banner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <h1 id="fullscreen-title" className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">🖥️ 전체화면 미리보기</h1>
              <a 
                href="https://github.com/gyupro/markdown-editor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm items-center gap-1"
                title="GitHub Repository"
                aria-label="GitHub에서 오픈소스 코드 보기"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                <span className="hidden md:inline">Open Source</span>
              </a>
            </div>
            <nav className="flex gap-2 md:gap-3" aria-label="전체화면 작업">
              <button
                onClick={handleExportToPDF}
                disabled={isExporting}
                className="px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors shadow-md hover:shadow-lg text-sm"
                aria-label={isExporting ? "PDF 생성 중입니다" : "현재 문서를 PDF로 출력합니다"}
              >
                {isExporting ? (
                  <>
                    <span className="text-xs md:text-base">📄</span>
                    <span className="hidden sm:inline"> PDF 생성 중...</span>
                    <span className="sm:hidden"> 생성중...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs md:text-base">📄</span>
                    <span className="hidden sm:inline"> PDF 출력</span>
                    <span className="sm:hidden"> PDF</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-3 md:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg text-sm"
                aria-label="전체화면 미리보기를 닫고 편집 화면으로 돌아갑니다"
              >
                <span className="text-xs md:text-base">✕</span>
                <span className="hidden sm:inline"> 닫기 (ESC)</span>
                <span className="sm:hidden"> 닫기</span>
              </button>
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {isClient ? (
            <article className="max-w-4xl mx-auto p-4 md:p-8" aria-label="전체화면 마크다운 미리보기">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {markdown}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
              미리보기를 로드하는 중...
            </div>
          )}
        </main>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {renderHeader()}
      {renderMobileTabs()}
      
      <main className="flex-1 flex overflow-hidden" role="main">
        {renderEditor()}
        {renderPreview()}
      </main>

      {isFullscreen && renderFullscreenModal()}
    </div>
  );
}
