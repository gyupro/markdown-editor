'use client';

import React, { useState, useEffect } from 'react';
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
  const [documentTitle, setDocumentTitle] = useState('My Document');
  const [showSharedNotice, setShowSharedNotice] = useState(false);

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

  // 클라이언트 마운트 시 공유 문서 확인 (한 번만)
  useEffect(() => {
    const loadSharedDocument = () => {
      try {
        const sharedData = sessionStorage.getItem('temp_shared_document');
        if (sharedData) {
          const parsed = JSON.parse(sharedData);
          
          // 5분 이내 데이터만 유효 (선택사항)
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          if (parsed.timestamp && parsed.timestamp < fiveMinutesAgo) {
            sessionStorage.removeItem('temp_shared_document');
            return;
          }
          
          // 마크다운 내용 로드
          if (parsed.content) {
            setMarkdown(parsed.content);
          }
          
          // 제목 설정
          if (parsed.title) {
            setDocumentTitle(parsed.title);
          }
          
          // 공유 알림 표시
          if (parsed.fromShared) {
            setShowSharedNotice(true);
            setTimeout(() => setShowSharedNotice(false), 5000);
          }
          
          // sessionStorage에서 제거 (한 번만 사용)
          sessionStorage.removeItem('temp_shared_document');
        }
      } catch (error) {
        console.error('공유 문서 로드 실패:', error);
        // 에러 시 데이터 정리
        sessionStorage.removeItem('temp_shared_document');
      }
    };

    // 클라이언트에서만 실행
    if (isClient) {
      loadSharedDocument();
    }
  }, [isClient, setMarkdown]);

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
      {/* 공유받은 문서 로드 알림 */}
      {showSharedNotice && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">공유받은 문서가 로드되었습니다: "{documentTitle}"</span>
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
        title={documentTitle}
      />
    </div>
  );
}
