import React, { useState, useCallback } from 'react';
import { useDocumentShare, DocumentWithMeta } from '@/hooks/useDocumentShare';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  title?: string;
}

const ShareModalComponent: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  markdown, 
  title = 'Untitled Document' 
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isSharing, setIsSharing] = useState(false);
  const [documentMeta, setDocumentMeta] = useState<DocumentWithMeta['_meta'] | null>(null);
  const { createShareableDocument, generateShareUrl, isLoading, error } = useDocumentShare();
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const handleCreateShare = useCallback(async () => {
    setIsSharing(true);
    const document = await createShareableDocument(title, markdown);
    
    if (document) {
      const url = generateShareUrl(document.share_token);
      setShareUrl(url);
      setDocumentMeta(document._meta || null);
    }
    setIsSharing(false);
  }, [createShareableDocument, generateShareUrl, title, markdown]);

  const handleCopyLink = useCallback(async () => {
    if (shareUrl) {
      await copyToClipboard(shareUrl);
    }
  }, [copyToClipboard, shareUrl]);

  const handleClose = useCallback(() => {
    setShareUrl('');
    setIsSharing(false);
    setDocumentMeta(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            문서 공유
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {!shareUrl ? (
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                현재 문서를 공유 가능한 링크로 만들어보세요.
              </p>
              <button
                onClick={handleCreateShare}
                disabled={isSharing || isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {isSharing || isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    공유 링크 생성 중...
                  </>
                ) : (
                  <>
                    🔗 공유 링크 생성
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              {documentMeta && (
                <div className={`mb-3 p-3 rounded-md ${
                  documentMeta.isReused 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' 
                    : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {documentMeta.isReused ? '♻️' : '✨'}
                    </span>
                    <p className={`text-sm font-medium ${
                      documentMeta.isReused 
                        ? 'text-yellow-800 dark:text-yellow-300' 
                        : 'text-green-800 dark:text-green-300'
                    }`}>
                      {documentMeta.message}
                    </p>
                  </div>
                </div>
              )}
              
              <p className="text-green-600 dark:text-green-400 mb-3 font-medium">
                ✅ 공유 링크가 준비되었습니다!
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">공유 링크:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                  />
                  <div className="relative">
                    <button
                      onClick={handleCopyLink}
                      className={`px-3 py-2 rounded text-sm transition-all duration-200 ${
                        isCopied 
                          ? 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300' 
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300'
                      }`}
                      title={isCopied ? '복사됨!' : '링크 복사'}
                    >
                      {isCopied ? '✓' : '📋'}
                    </button>
                    {isCopied && (
                      <div className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg animate-pulse whitespace-nowrap">
                        복사됨!
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                이 링크를 가진 누구나 문서를 볼 수 있습니다.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export const ShareModal = React.memo(ShareModalComponent); 