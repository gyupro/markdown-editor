'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useHashNavigation } from '@/hooks/useHashNavigation';
import { useTheme } from '@/hooks/useTheme';
import { DEFAULT_MARKDOWN } from '@/constants/markdown';
import { MobileTab } from '@/types/markdown';
import { extractTitleFromMarkdown } from '@/utils/markdown';

// Import components
import { Header } from '@/components/Header';
import { MobileTabs } from '@/components/MobileTabs';
import { EditorSection } from '@/components/EditorSection';
import { PreviewSection } from '@/components/PreviewSection';
import { FullscreenModal } from '@/components/FullscreenModal';
import { ShareModal } from '@/components/ShareModal';
import { AIModal } from '@/components/AIModal';
import { LocalStorageModal, saveDocumentById } from '@/components/LocalStorageModal';

export default function HomePage() {
  const t = useTranslations();
  const { copyToClipboard } = useCopyToClipboard();
  const { theme, toggleTheme, isLoaded: isThemeLoaded } = useTheme();
  const [mobileActiveTab, setMobileActiveTabState] = useState<MobileTab>('editor');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [isSaveMode, setIsSaveMode] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  const [documentTitle, setDocumentTitle] = useState(t('common.title'));
  const [showSharedNotice, setShowSharedNotice] = useState(false);
  const hasLoadedSharedDocument = useRef(false);

  // Hash navigation hook
  useHashNavigation();

  const {
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
    undo,
    redo,
    canUndo,
    canRedo,
    handleEditorScroll,
    handlePreviewScroll,
    syncScrollToEditor,
    syncScrollToPreview,
  } = useMarkdownEditor(DEFAULT_MARKDOWN);

  // Wrapper to sync scroll on mobile tab change
  const setMobileActiveTab = useCallback((tab: MobileTab) => {
    setMobileActiveTabState(tab);
    if (tab === 'editor') {
      syncScrollToEditor();
    } else {
      syncScrollToPreview();
    }
  }, [syncScrollToEditor, syncScrollToPreview]);

  // Auto extract title from markdown content
  useEffect(() => {
    const extractedTitle = extractTitleFromMarkdown(markdown);
    setDocumentTitle(extractedTitle);
  }, [markdown]);

  // Auto-save every 30 seconds (only when document ID exists)
  useEffect(() => {
    if (!currentDocumentId) return;

    const autoSaveInterval = setInterval(() => {
      const success = saveDocumentById(currentDocumentId, markdown);
      if (success) {
        setLastAutoSaved(new Date());
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [currentDocumentId, markdown]);

  // Load shared document (run once)
  useEffect(() => {
    if (hasLoadedSharedDocument.current) return;
    if (typeof window === 'undefined') return;

    const loadSharedDocument = () => {
      try {
        const sharedData = window.localStorage.getItem('temp_shared_document');
        if (sharedData) {
          const parsed = JSON.parse(sharedData);
          const content = parsed.content || '';
          setMarkdown(content);

          const extractedTitle = extractTitleFromMarkdown(content);
          setDocumentTitle(extractedTitle);

          if (parsed.fromShared) {
            setShowSharedNotice(true);
            setTimeout(() => setShowSharedNotice(false), 5000);
          }

          window.localStorage.removeItem('temp_shared_document');
          hasLoadedSharedDocument.current = true;
        }
      } catch (error) {
        console.error('Failed to load shared document:', error);
      }
    };

    loadSharedDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Copy markdown handler
  const handleCopyMarkdown = useCallback(async () => {
    await copyToClipboard(markdown);
  }, [copyToClipboard, markdown]);

  // Save handler (Ctrl+S or save button)
  const handleSave = useCallback(() => {
    if (currentDocumentId) {
      const success = saveDocumentById(currentDocumentId, markdown);
      if (success) {
        setLastAutoSaved(new Date());
      }
    } else {
      setIsSaveMode(true);
      setIsDocumentsModalOpen(true);
    }
  }, [currentDocumentId, markdown]);

  // Document saved callback
  const handleDocumentSaved = useCallback((docId: string) => {
    setCurrentDocumentId(docId);
    setLastAutoSaved(new Date());
    setIsSaveMode(false);
  }, []);

  // Document load callback
  const handleDocumentLoad = useCallback((content: string, docId: string) => {
    setMarkdown(content);
    setCurrentDocumentId(docId);
  }, [setMarkdown]);

  // New document
  const handleNewDocument = useCallback(() => {
    setMarkdown(DEFAULT_MARKDOWN);
    setCurrentDocumentId(null);
    setLastAutoSaved(null);
  }, [setMarkdown]);

  // Ctrl+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  // AI content apply handler
  const handleApplyAIContent = useCallback((content: string, replaceAll: boolean) => {
    if (replaceAll) {
      setMarkdown(content);
    } else {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const newText = markdown.substring(0, start) + '\n\n' + content + '\n\n' + markdown.substring(start);
        setMarkdown(newText);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + content.length + 4, start + content.length + 4);
        }, 0);
      }
    }
  }, [markdown, setMarkdown, textareaRef]);

  // Toolbar action handlers - memoized to prevent unnecessary re-renders
  const toolbarHandlers = useMemo(() => ({
    onHeading: insertHeading,
    onBold: () => insertFormatting('**', '**'),
    onItalic: () => insertFormatting('*', '*'),
    onStrikethrough: () => insertFormatting('~~', '~~'),
    onInlineCode: () => insertFormatting('`', '`'),
    onLink: () => insertFormatting('[', '](url)'),
    onImage: () => insertFormatting('![alt](', ')'),
    onBulletList: () => insertAtCursor('- '),
    onNumberedList: () => insertAtCursor('1. '),
    onQuote: () => insertFormatting('> ', ''),
    onTable: insertTable,
    onCodeBlock: () => insertAtCursor('```\n\n```'),
    onSelectAll: selectAll,
    onCopy: handleCopyMarkdown,
    onExportPDF: handleExportToPDF,
    onAI: () => setIsAIModalOpen(true),
    onUndo: undo,
    onRedo: redo,
    canUndo,
    canRedo,
    onSave: handleSave,
    currentDocumentId,
    lastAutoSaved,
    onOpenDocuments: () => {
      setIsSaveMode(false);
      setIsDocumentsModalOpen(true);
    },
  }), [insertHeading, insertFormatting, insertAtCursor, insertTable, selectAll, handleCopyMarkdown, handleExportToPDF, undo, redo, canUndo, canRedo, handleSave, currentDocumentId, lastAutoSaved]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Shared document load notice */}
      {showSharedNotice && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">{t('notifications.sharedDocumentLoaded')}: &ldquo;{documentTitle}&rdquo;</span>
            </div>
            <button
              onClick={() => setShowSharedNotice(false)}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Header
        isExporting={isExporting}
        onExportPDF={handleExportToPDF}
        onFullscreen={() => setIsFullscreen(true)}
        onShare={() => setIsShareModalOpen(true)}
        theme={theme}
        onThemeToggle={toggleTheme}
        isThemeLoaded={isThemeLoaded}
      />

      <MobileTabs
        activeTab={mobileActiveTab}
        onTabChange={setMobileActiveTab}
      />

      <main className="flex-1 flex overflow-hidden" role="main">
        <EditorSection
          isVisible={mobileActiveTab === 'editor'}
          markdown={markdown}
          onMarkdownChange={setMarkdown}
          textareaRef={textareaRef}
          toolbarHandlers={toolbarHandlers}
          onScroll={handleEditorScroll}
        />

        <PreviewSection
          isVisible={mobileActiveTab === 'preview'}
          isClient={isClient}
          markdown={markdown}
          previewRef={previewRef}
          onScroll={handlePreviewScroll}
        />
      </main>

      {isFullscreen && (
        <FullscreenModal
          isClient={isClient}
          isExporting={isExporting}
          markdown={markdown}
          onExportPDF={handleExportToPDF}
          onClose={() => setIsFullscreen(false)}
        />
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        markdown={markdown}
        title={documentTitle}
      />

      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentMarkdown={markdown}
        onApplyContent={handleApplyAIContent}
      />

      <LocalStorageModal
        isOpen={isDocumentsModalOpen}
        onClose={() => {
          setIsDocumentsModalOpen(false);
          setIsSaveMode(false);
        }}
        currentContent={markdown}
        onLoad={handleDocumentLoad}
        onSave={handleDocumentSaved}
        currentDocumentId={currentDocumentId}
        autoSaveMode={isSaveMode}
      />
    </div>
  );
}
