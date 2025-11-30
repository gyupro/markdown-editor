import { useState, useEffect, useRef, useCallback } from 'react';
import { KEYBOARD_SHORTCUTS, TABLE_TEMPLATE } from '@/constants/markdown';
import { exportToPDF } from '@/utils/pdf';

const STORAGE_KEY = 'markdown-editor-draft';
const MAX_HISTORY_SIZE = 100;

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

  // History for undo/redo
  const [history, setHistory] = useState<string[]>([initialMarkdown]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoRef = useRef(false);

  // Scroll sync state
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize client-side
  useEffect(() => {
    setIsClient(true);

    // Load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved !== null && saved !== initialMarkdown) {
          setMarkdownState(saved);
          setHistory([saved]);
          setHistoryIndex(0);
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [initialMarkdown]);

  // Debounced save to localStorage
  useEffect(() => {
    if (!isClient) return;

    setIsSaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, markdown);
          setLastSaved(new Date());
        } catch {
          // Ignore localStorage errors
        }
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

    // Push to history if not from undo/redo
    if (!isUndoRedoRef.current) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        if (newHistory[newHistory.length - 1] !== newValue) {
          newHistory.push(newValue);
          if (newHistory.length > MAX_HISTORY_SIZE) {
            return newHistory.slice(-MAX_HISTORY_SIZE);
          }
        }
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
    }
    isUndoRedoRef.current = false;
  }, [historyIndex]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, markdown);
        setLastSaved(new Date());
      } catch {
        // Ignore
      }
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
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }, []);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMarkdownState(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setMarkdownState(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Undo/Redo availability
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Scroll percent state for mobile tab sync
  const scrollPercentRef = useRef(0);

  // Scroll sync handlers - percentage-based sync
  const handleEditorScroll = useCallback(() => {
    if (isScrollingRef.current) return;
    const editor = textareaRef.current;
    const preview = previewRef.current;
    if (!editor) return;

    const editorScrollHeight = editor.scrollHeight - editor.clientHeight;
    if (editorScrollHeight > 0) {
      scrollPercentRef.current = editor.scrollTop / editorScrollHeight;
    }

    if (!preview) return;

    const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
    if (previewScrollHeight > 0) {
      isScrollingRef.current = true;
      preview.scrollTop = scrollPercentRef.current * previewScrollHeight;
    }

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 50);
  }, []);

  const handlePreviewScroll = useCallback(() => {
    if (isScrollingRef.current) return;
    const editor = textareaRef.current;
    const preview = previewRef.current;
    if (!preview) return;

    const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
    if (previewScrollHeight > 0) {
      scrollPercentRef.current = preview.scrollTop / previewScrollHeight;
    }

    if (!editor) return;

    const editorScrollHeight = editor.scrollHeight - editor.clientHeight;
    if (editorScrollHeight > 0) {
      isScrollingRef.current = true;
      editor.scrollTop = scrollPercentRef.current * editorScrollHeight;
    }

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 50);
  }, []);

  // Sync scroll position when switching tabs (mobile)
  const syncScrollToEditor = useCallback(() => {
    const editor = textareaRef.current;
    if (!editor) return;

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      const scrollHeight = editor.scrollHeight - editor.clientHeight;
      if (scrollHeight > 0) {
        editor.scrollTop = scrollPercentRef.current * scrollHeight;
      }
    });
  }, []);

  const syncScrollToPreview = useCallback(() => {
    const preview = previewRef.current;
    if (!preview) return;

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      const scrollHeight = preview.scrollHeight - preview.clientHeight;
      if (scrollHeight > 0) {
        preview.scrollTop = scrollPercentRef.current * scrollHeight;
      }
    });
  }, []);

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
    syncScrollToEditor,
    syncScrollToPreview,
  };
}; 