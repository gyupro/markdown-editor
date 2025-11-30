import { useCallback, useRef, RefObject } from 'react';

export const useScrollSync = (
  editorRef: RefObject<HTMLTextAreaElement | null>,
  previewRef: RefObject<HTMLDivElement | null>
) => {
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncScroll = useCallback((source: 'editor' | 'preview') => {
    if (isScrolling.current) return;

    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    isScrolling.current = true;

    const sourceEl = source === 'editor' ? editor : preview;
    const targetEl = source === 'editor' ? preview : editor;

    const scrollHeight = sourceEl.scrollHeight - sourceEl.clientHeight;
    if (scrollHeight <= 0) {
      isScrolling.current = false;
      return;
    }

    const scrollPercent = sourceEl.scrollTop / scrollHeight;
    const targetScrollHeight = targetEl.scrollHeight - targetEl.clientHeight;

    targetEl.scrollTop = scrollPercent * targetScrollHeight;

    // Prevent scroll event loop
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 50);
  }, [editorRef, previewRef]);

  const handleEditorScroll = useCallback(() => {
    syncScroll('editor');
  }, [syncScroll]);

  const handlePreviewScroll = useCallback(() => {
    syncScroll('preview');
  }, [syncScroll]);

  return {
    handleEditorScroll,
    handlePreviewScroll,
  };
};
