'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useHashNavigation } from '@/hooks/useHashNavigation';
import { useTheme } from '@/hooks/useTheme';
import { DEFAULT_MARKDOWN } from '@/constants/markdown';
import { MobileTab } from '@/types/markdown';
import { extractTitleFromMarkdown } from '@/utils/markdown';

// 새로 분리된 컴포넌트들 임포트
import { Header } from '@/components/Header';
import { MobileTabs } from '@/components/MobileTabs';
import { EditorSection } from '@/components/EditorSection';
import { PreviewSection } from '@/components/PreviewSection';
import { FullscreenModal } from '@/components/FullscreenModal';
import { ShareModal } from '@/components/ShareModal';
import { AIModal } from '@/components/AIModal';

export default function HomePage() {
  const { copyToClipboard } = useCopyToClipboard();
  const { theme, toggleTheme, isLoaded: isThemeLoaded } = useTheme();
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTab>('editor');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('FREE-마크다운 에디터');
  const [showSharedNotice, setShowSharedNotice] = useState(false);
  const hasLoadedSharedDocument = useRef(false);

  // 해시 네비게이션 훅 사용
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
  } = useMarkdownEditor(DEFAULT_MARKDOWN);

  // 마크다운 내용이 변경될 때마다 제목 자동 추출
  useEffect(() => {
    const extractedTitle = extractTitleFromMarkdown(markdown);
    setDocumentTitle(extractedTitle);
  }, [markdown]);

  // 공유받은 문서 로드 (한 번만 실행)
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

          // 마크다운 내용에서 제목 추출
          const extractedTitle = extractTitleFromMarkdown(content);
          setDocumentTitle(extractedTitle);

          if (parsed.fromShared) {
            setShowSharedNotice(true);
            // 5초 후 알림 숨기기
            setTimeout(() => setShowSharedNotice(false), 5000);
          }

          // 사용 후 로컬스토리지에서 제거
          window.localStorage.removeItem('temp_shared_document');
          hasLoadedSharedDocument.current = true;
        }
      } catch (error) {
        console.error('공유 문서 로드 실패:', error);
      }
    };

    loadSharedDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  // 마크다운 복사 핸들러 - useCallback으로 메모이제이션
  const handleCopyMarkdown = useCallback(async () => {
    await copyToClipboard(markdown);
  }, [copyToClipboard, markdown]);

  // AI 콘텐츠 적용 핸들러
  const handleApplyAIContent = useCallback((content: string, replaceAll: boolean) => {
    if (replaceAll) {
      setMarkdown(content);
    } else {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const newText = markdown.substring(0, start) + '\n\n' + content + '\n\n' + markdown.substring(start);
        setMarkdown(newText);
        
        // 커서를 새로 추가된 콘텐츠 뒤로 이동
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + content.length + 4, start + content.length + 4);
        }, 0);
      }
    }
  }, [markdown, setMarkdown, textareaRef]);

  // 툴바 액션 핸들러들 - useMemo로 메모이제이션하여 불필요한 리렌더링 방지
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
  }), [insertHeading, insertFormatting, insertAtCursor, insertTable, selectAll, handleCopyMarkdown, handleExportToPDF]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 공유받은 문서 로드 알림 */}
      {showSharedNotice && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">공유받은 문서가 로드되었습니다: &ldquo;{documentTitle}&rdquo;</span>
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
        />
        
        <PreviewSection
          isVisible={mobileActiveTab === 'preview'}
          isClient={isClient}
          markdown={markdown}
          previewRef={previewRef}
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
    </div>
  );
}
