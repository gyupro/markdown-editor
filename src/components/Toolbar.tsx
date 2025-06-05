import React from 'react';
import { ToolbarButtonProps } from '@/types/markdown';

interface ToolbarProps {
  onHeading: (level: number) => void;
  onBold: () => void;
  onItalic: () => void;
  onStrikethrough: () => void;
  onInlineCode: () => void;
  onLink: () => void;
  onImage: () => void;
  onBulletList: () => void;
  onNumberedList: () => void;
  onQuote: () => void;
  onTable: () => void;
  onCodeBlock: () => void;
  onCopy: () => void;
  onExportPDF: () => void;
  onSelectAll: () => void;
  onAI: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, title, children, disabled = false }) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center justify-center min-w-[32px] h-8 disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={title}
    type="button"
  >
    {children}
  </button>
);

const Divider: React.FC = () => (
  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" aria-hidden="true"></div>
);

export const Toolbar: React.FC<ToolbarProps> = ({
  onHeading,
  onBold,
  onItalic,
  onStrikethrough,
  onInlineCode,
  onLink,
  onImage,
  onBulletList,
  onNumberedList,
  onQuote,
  onTable,
  onCodeBlock,
  onCopy,
  onExportPDF,
  onSelectAll,
  onAI,
}) => {
  return (
    <nav 
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center gap-1 flex-wrap" 
      aria-label="편집 도구"
    >
      <ToolbarButton onClick={() => onHeading(1)} title="헤딩 1">
        <span className="font-bold text-lg">H1</span>
      </ToolbarButton>
      <ToolbarButton onClick={() => onHeading(2)} title="헤딩 2">
        <span className="font-bold">H2</span>
      </ToolbarButton>
      <ToolbarButton onClick={() => onHeading(3)} title="헤딩 3">
        <span className="font-bold text-sm">H3</span>
      </ToolbarButton>
      
      <Divider />
      
      <ToolbarButton onClick={onBold} title="굵게 (Ctrl+B)">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.5 15.5H10V12.5h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zM10 6.5h3c.55 0 1 .45 1 1s-.45 1-1 1h-3v-2zm1-4h4c1.93 0 3.5 1.57 3.5 3.5 0 .97-.39 1.85-1.02 2.5 1.26.65 2.02 1.93 2.02 3.5 0 2.21-1.79 4-4 4H6c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5z"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onItalic} title="기울임 (Ctrl+I)">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 5v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V5h-8z"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onStrikethrough} title="취소선">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.85 7.08C6.85 4.37 9.45 3 12.24 3c1.64 0 3 .49 3.9 1.28.77.65 1.46 1.73 1.46 3.24h-3.01c0-.31-.05-.59-.15-.85-.29-.86-1.2-1.28-2.25-1.28-1.86 0-2.34 1.02-2.34 1.7 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.21-.34-.54-.89-.54-1.92zM21 12v2H3v-2h18zM12.56 17c1.9 0 2.7-.8 2.7-1.7 0-.78-.79-1.3-2.55-1.3H9.03c1.5.09 3.53.4 3.53 3z"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onInlineCode} title="인라인 코드">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
        </svg>
      </ToolbarButton>
      
      <Divider />
      
      <ToolbarButton onClick={onLink} title="링크 (Ctrl+K)">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onImage} title="이미지">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onBulletList} title="불릿 리스트">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onNumberedList} title="번호 리스트">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
        </svg>
      </ToolbarButton>
      
      <ToolbarButton onClick={onQuote} title="인용구">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onTable} title="테이블">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1z"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onCodeBlock} title="코드 블록">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </ToolbarButton>
      
      <Divider />
      
      <ToolbarButton onClick={onAI} title="AI 콘텐츠 생성">
        <span className="font-bold text-sm">AI</span>
      </ToolbarButton>
      
      <Divider />
      
      <ToolbarButton onClick={onSelectAll} title="전체 선택 (Ctrl+A)">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onCopy} title="마크다운 복사">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onExportPDF} title="PDF 출력 (Ctrl+P)">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </ToolbarButton>
    </nav>
  );
}; 