'use client';

import React, { useState } from 'react';
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { DEFAULT_MARKDOWN } from '@/constants/markdown';
import { MobileTab } from '@/types/markdown';

// 새로 분리된 컴포넌트들 임포트
import { Header } from '@/components/Header';
import { MobileTabs } from '@/components/MobileTabs';
import { EditorSection } from '@/components/EditorSection';
import { PreviewSection } from '@/components/PreviewSection';
import { FullscreenModal } from '@/components/FullscreenModal';
import { ShareModal } from '@/components/ShareModal';

export default function HomePage() {
  const { copyToClipboard } = useCopyToClipboard();
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTab>('editor');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
  } = useMarkdownEditor(DEFAULT_MARKDOWN);

  // 마크다운 복사 핸들러
  const handleCopyMarkdown = async () => {
    await copyToClipboard(markdown);
  };

  // 공유 모달 열기
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // 툴바 액션 핸들러들
  const toolbarHandlers = {
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
    onCopy: handleCopyMarkdown,
    onExportPDF: handleExportToPDF,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header 
        isExporting={isExporting}
        onExportPDF={handleExportToPDF}
        onFullscreen={() => setIsFullscreen(true)}
        onShare={handleShare}
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
        title="My Document"
      />
    </div>
  );
}
