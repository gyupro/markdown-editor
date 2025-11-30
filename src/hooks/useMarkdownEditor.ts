import { useState, useEffect, useRef, useCallback } from 'react';
import { KEYBOARD_SHORTCUTS, TABLE_TEMPLATE } from '@/constants/markdown';
import { exportToPDF } from '@/utils/pdf';
import { useUndoRedo } from './useUndoRedo';
import { useScrollSync } from './useScrollSync';

const STORAGE_KEY = 'markdown-editor-draft';

// Helper to safely access localStorage
const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const useMarkdownEditor = (initialMarkdown: string) => {
  const [markdown, setMarkdownState] = useState(initialMarkdown);
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Undo/Redo functionality
  const {
    pushValue: pushToHistory,
    undo: undoAction,
    redo: redoAction,
    canUndo,
    canRedo,
    resetHistory,
  } = useUndoRedo(initialMarkdown);

  // Scroll sync
  const { handleEditorScroll, handlePreviewScroll } = useScrollSync(textareaRef, previewRef);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    setIsClient(true);
    const saved = getStorageItem(STORAGE_KEY);
    if (saved !== null && saved !== initialMarkdown) {
      setMarkdownState(saved);
      resetHistory(saved);
    }
  }, [initialMarkdown, resetHistory]);

  // Debounced save to localStorage
  useEffect(() => {
    if (!isClient) return;

    setIsSaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (setStorageItem(STORAGE_KEY, markdown)) {
        setLastSaved(new Date());
      }
      setIsSaving(false);
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [markdown, isClient]);

  // Combined setMarkdown that updates both state and history
  const setMarkdown = useCallback((newValue: string) => {
    setMarkdownState(newValue);
    pushToHistory(newValue);
  }, [pushToHistory]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (setStorageItem(STORAGE_KEY, markdown)) {
      setLastSaved(new Date());
    }
  }, [markdown]);

  // Clear saved data
  const clearSaved = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        setLastSaved(null);
      } catch {
        // Ignore errors
      }
    }
  }, []);

  // Check if there's saved data
  const hasSavedData = useCallback(() => {
    return getStorageItem(STORAGE_KEY) !== null;
  }, []);

  // Undo function
  const undo = useCallback(() => {
    const previousValue = undoAction();
    if (previousValue !== null) {
      setMarkdownState(previousValue);
    }
  }, [undoAction]);

  // Redo function
  const redo = useCallback(() => {
    const nextValue = redoAction();
    if (nextValue !== null) {
      setMarkdownState(nextValue);
    }
  }, [redoAction]);

  // PDF 출력 함수
  const handleExportToPDF = useCallback(async () => {
    if (!isClient || !previewRef.current) return;
    
    setIsExporting(true);
    
    try {
      await exportToPDF(previewRef);
    } catch (error) {
      console.error('PDF 출력 중 오류가 발생했습니다:', error);
      alert('PDF 출력 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsExporting(false);
    }
  }, [isClient]);

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
  }, [markdown, setMarkdown]);

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
  }, [markdown, setMarkdown]);

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
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              redo();
            } else {
              e.preventDefault();
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            saveNow();
            break;
        }
      }
      if (e.key === KEYBOARD_SHORTCUTS.ESCAPE && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, insertFormatting, handleExportToPDF, undo, redo, saveNow]);

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
    // Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo,
    // Local storage
    lastSaved,
    isSaving,
    saveNow,
    clearSaved,
    hasSavedData,
    // Scroll sync
    handleEditorScroll,
    handlePreviewScroll,
  };
}; 