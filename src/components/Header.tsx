import React from 'react';

interface HeaderProps {
  isExporting: boolean;
  onExportPDF: () => void;
  onFullscreen: () => void;
  onShare: () => void;
}

const GitHubIcon = () => (
  <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ isExporting, onExportPDF, onFullscreen, onShare }) => (
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
          <GitHubIcon />
          <span className="hidden md:inline">Open Source</span>
        </a>
      </div>
      <nav className="flex gap-2 md:gap-3" aria-label="메인 작업">
        <button
          onClick={onShare}
          className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 text-sm"
          aria-label="현재 문서를 공유 가능한 링크로 만듭니다"
        >
          <span className="text-xs md:text-base" aria-hidden="true">🌐</span> 
          <span className="hidden sm:inline">문서 공유</span>
          <span className="sm:hidden">공유</span>
        </button>
        <button
          onClick={onExportPDF}
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
          onClick={onFullscreen}
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