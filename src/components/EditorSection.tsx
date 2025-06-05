import React, { useRef } from 'react';
import { Toolbar } from './Toolbar';
import { ToolbarHandlers } from '@/types/markdown';

interface EditorSectionProps {
  isVisible: boolean;
  markdown: string;
  onMarkdownChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  toolbarHandlers: ToolbarHandlers;
}

const EditorSectionComponent: React.FC<EditorSectionProps> = ({
  isVisible,
  markdown,
  onMarkdownChange,
  textareaRef,
  toolbarHandlers,
}) => {
  // 첫 번째 포커스 여부를 추적하는 ref
  const hasBeenFocused = useRef(false);

  // 첫 포커스 시 전체 텍스트 선택 핸들러
  const handleFocus = () => {
    if (!hasBeenFocused.current && textareaRef.current) {
      // 처음 포커스할 때만 전체 선택
      textareaRef.current.select();
      hasBeenFocused.current = true;
    }
  };

  return (
    <section 
      className={`${isVisible ? 'flex' : 'hidden'} md:flex md:w-1/2 flex-col border-r border-gray-200 dark:border-gray-700`} 
      aria-label="마크다운 편집기"
    >
      <header className="hidden md:block bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          EDITOR
        </h2>
      </header>
      
      <Toolbar {...toolbarHandlers} />

      <textarea
        ref={textareaRef}
        className="flex-1 w-full p-4 text-sm font-mono leading-6 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 resize-none focus:outline-none border-none"
        value={markdown}
        onChange={(e) => onMarkdownChange(e.target.value)}
        onFocus={handleFocus}
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
};

// React.memo로 컴포넌트 메모이제이션하여 불필요한 리렌더링 방지
export const EditorSection = React.memo(EditorSectionComponent); 