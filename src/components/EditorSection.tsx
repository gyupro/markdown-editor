import React from 'react';
import { Toolbar } from './Toolbar';
import { ToolbarHandlers } from '@/types/markdown';

interface EditorSectionProps {
  isVisible: boolean;
  markdown: string;
  onMarkdownChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  toolbarHandlers: ToolbarHandlers;
}

export const EditorSection: React.FC<EditorSectionProps> = ({
  isVisible,
  markdown,
  onMarkdownChange,
  textareaRef,
  toolbarHandlers,
}) => (
  <section 
    className={`${isVisible ? 'flex' : 'hidden'} md:flex md:w-1/2 flex-col border-r border-gray-200 dark:border-gray-700`} 
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
      onChange={(e) => onMarkdownChange(e.target.value)}
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