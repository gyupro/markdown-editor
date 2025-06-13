import { useState, useEffect, useRef, useCallback } from 'react';
import { KEYBOARD_SHORTCUTS, TABLE_TEMPLATE } from '@/constants/markdown';
import { exportToPDF } from '@/utils/pdf';

export const useMarkdownEditor = (initialMarkdown: string, theme: 'light' | 'dark' = 'light') => {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // PDF 출력 함수
  const handleExportToPDF = useCallback(async () => {
    if (!isClient || !previewRef.current) return;
    
    setIsExporting(true);
    
    try {
      await exportToPDF(previewRef, undefined, theme);
    } catch (error) {
      console.error('PDF 출력 중 오류가 발생했습니다:', error);
      alert('PDF 출력 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsExporting(false);
    }
  }, [isClient, theme]);

  // 텍스트 포맷팅 함수
  const insertFormatting = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
    setMarkdown(newText);

    // 커서 위치 설정
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, end + before.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
    }, 0);
  }, [markdown]);

  // 커서 위치에 텍스트 삽입
  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = markdown.substring(0, start) + text + markdown.substring(start);
    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  }, [markdown]);

  // 툴바 액션들
  const insertHeading = useCallback((level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertAtCursor(prefix);
  }, [insertAtCursor]);

  const insertTable = useCallback(() => {
    insertAtCursor(TABLE_TEMPLATE);
  }, [insertAtCursor]);

  // 전체 선택 함수
  const selectAll = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    textarea.select();
  }, []);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case KEYBOARD_SHORTCUTS.BOLD:
            e.preventDefault();
            insertFormatting('**', '**');
            break;
          case KEYBOARD_SHORTCUTS.ITALIC:
            e.preventDefault();
            insertFormatting('*', '*');
            break;
          case KEYBOARD_SHORTCUTS.LINK:
            e.preventDefault();
            insertFormatting('[', '](url)');
            break;
          case KEYBOARD_SHORTCUTS.PDF:
            e.preventDefault();
            handleExportToPDF();
            break;
        }
      }
      if (e.key === KEYBOARD_SHORTCUTS.ESCAPE && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, insertFormatting, handleExportToPDF]);

  return {
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
    selectAll,
  };
}; 