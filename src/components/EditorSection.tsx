import React, { useRef, useState, useCallback } from 'react';
import { Toolbar } from './Toolbar';
import { ToolbarHandlers } from '@/types/markdown';
import { useImageUpload, ImageUploadError } from '@/hooks/useImageUpload';

interface EditorSectionProps {
  isVisible: boolean;
  markdown: string;
  onMarkdownChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  toolbarHandlers: ToolbarHandlers;
  onScroll?: () => void;
}

const EditorSectionComponent: React.FC<EditorSectionProps> = ({
  isVisible,
  markdown,
  onMarkdownChange,
  textareaRef,
  toolbarHandlers,
  onScroll,
}) => {
  // 첫 번째 포커스 여부를 추적하는 ref
  const hasBeenFocused = useRef(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Image upload hook
  const {
    uploadFromClipboard,
    uploadFromDrop,
    isUploading,
    uploadProgress,
    error: uploadError,
    clearError
  } = useImageUpload();

  // 첫 포커스 시 전체 텍스트 선택 핸들러
  const handleFocus = () => {
    if (!hasBeenFocused.current && textareaRef.current) {
      // 처음 포커스할 때만 전체 선택
      textareaRef.current.select();
      hasBeenFocused.current = true;
    }
  };

  // Insert text at cursor position
  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = markdown.substring(0, start) + text + markdown.substring(end);
    onMarkdownChange(newText);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  }, [markdown, onMarkdownChange, textareaRef]);

  // Handle paste event for images
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;

    // Check if there's an image in clipboard
    const hasImage = Array.from(clipboardData.items).some(item => item.type.startsWith('image/'));

    if (hasImage) {
      e.preventDefault();

      const result = await uploadFromClipboard(clipboardData);
      if (result) {
        insertAtCursor(result.markdown + '\n');
      }
    }
    // If no image, let the default paste behavior handle text
  }, [uploadFromClipboard, insertAtCursor]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if dragging files
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  // Handle drop event for images
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const results = await uploadFromDrop(e.dataTransfer);
    if (results.length > 0) {
      const markdowns = results.map(r => r.markdown).join('\n');
      insertAtCursor(markdowns + '\n');
    }
  }, [uploadFromDrop, insertAtCursor]);

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

      {/* Upload error message */}
      {uploadError && (
        <div className="mx-4 mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{uploadError.message}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Upload progress indicator */}
      {isUploading && (
        <div className="mx-4 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-blue-700 dark:text-blue-300">이미지 업로드 중...</span>
            <span className="text-sm text-blue-500 dark:text-blue-400 ml-auto">{uploadProgress}%</span>
          </div>
          <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Textarea with drag-drop zone */}
      <div
        className="flex-1 relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 z-10 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center pointer-events-none">
            <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-lg text-center">
              <svg className="w-10 h-10 mx-auto text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-blue-700 dark:text-blue-300 font-medium">이미지를 여기에 놓으세요</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">최대 10MB</p>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="w-full h-full p-4 text-sm font-mono leading-6 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 resize-none focus:outline-none border-none"
          value={markdown}
          onChange={(e) => onMarkdownChange(e.target.value)}
          onFocus={handleFocus}
          onScroll={onScroll}
          onPaste={handlePaste}
          placeholder="여기에 마크다운을 입력하세요... (이미지를 붙여넣거나 드래그하여 업로드)"
          spellCheck={false}
          aria-label="마크다운 텍스트 입력 영역"
          aria-describedby="editor-help"
        />
      </div>
      <div id="editor-help" className="sr-only">
        마크다운 문법을 사용하여 텍스트를 작성할 수 있습니다.
        키보드 단축키: Ctrl+B (굵게), Ctrl+I (기울임), Ctrl+K (링크), Ctrl+P (PDF 출력).
        이미지를 복사하여 붙여넣거나 드래그하여 업로드할 수 있습니다.
      </div>
    </section>
  );
};

// React.memo로 컴포넌트 메모이제이션하여 불필요한 리렌더링 방지
export const EditorSection = React.memo(EditorSectionComponent); 