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
  onExportPDF: () => void;
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
  onExportPDF,
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
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton onClick={onItalic} title="기울임 (Ctrl+I)">
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton onClick={onStrikethrough} title="취소선">
        <span className="line-through">S</span>
      </ToolbarButton>
      <ToolbarButton onClick={onInlineCode} title="인라인 코드">
        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">code</span>
      </ToolbarButton>
      
      <Divider />
      
      <ToolbarButton onClick={onLink} title="링크 (Ctrl+K)">
        🔗
      </ToolbarButton>
      <ToolbarButton onClick={onImage} title="이미지">
        🖼️
      </ToolbarButton>
      <ToolbarButton onClick={onBulletList} title="불릿 리스트">
        • 
      </ToolbarButton>
      <ToolbarButton onClick={onNumberedList} title="번호 리스트">
        1.
      </ToolbarButton>
      <ToolbarButton onClick={onQuote} title="인용구">
        💬
      </ToolbarButton>
      <ToolbarButton onClick={onTable} title="테이블">
        📊
      </ToolbarButton>
      <ToolbarButton onClick={onCodeBlock} title="코드 블록">
        📝
      </ToolbarButton>
      
      <Divider />
      
      <ToolbarButton onClick={onExportPDF} title="PDF 출력 (Ctrl+P)">
        📄
      </ToolbarButton>
    </nav>
  );
}; 