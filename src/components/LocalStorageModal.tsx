import React, { useState, useEffect, useCallback } from 'react';

interface SavedDocument {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface LocalStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onLoad: (content: string) => void;
}

const STORAGE_KEY = 'markdown-editor-documents';

// Get all saved documents
const getSavedDocuments = (): SavedDocument[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save documents to localStorage
const saveDocuments = (documents: SavedDocument[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
};

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Extract title from markdown content
const extractTitle = (content: string): string => {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      return trimmed.replace(/^#+\s*/, '').slice(0, 50) || '제목 없음';
    }
    if (trimmed.length > 0) {
      return trimmed.slice(0, 50) || '제목 없음';
    }
  }
  return '빈 문서';
};

const LocalStorageModalComponent: React.FC<LocalStorageModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onLoad,
}) => {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [newDocName, setNewDocName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load documents on mount
  useEffect(() => {
    if (isOpen) {
      setDocuments(getSavedDocuments());
      setNewDocName(extractTitle(currentContent));
      setIsCreating(false);
      setDeleteConfirm(null);
    }
  }, [isOpen, currentContent]);

  // Save new document
  const handleSaveNew = useCallback(() => {
    if (!newDocName.trim()) return;

    const newDoc: SavedDocument = {
      id: Date.now().toString(),
      name: newDocName.trim(),
      content: currentContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedDocs = [newDoc, ...documents];
    saveDocuments(updatedDocs);
    setDocuments(updatedDocs);
    setIsCreating(false);
    setNewDocName('');
  }, [newDocName, currentContent, documents]);

  // Update existing document
  const handleUpdate = useCallback((doc: SavedDocument) => {
    const updatedDocs = documents.map(d =>
      d.id === doc.id
        ? { ...d, content: currentContent, updatedAt: new Date().toISOString() }
        : d
    );
    saveDocuments(updatedDocs);
    setDocuments(updatedDocs);
  }, [documents, currentContent]);

  // Load document
  const handleLoad = useCallback((doc: SavedDocument) => {
    onLoad(doc.content);
    onClose();
  }, [onLoad, onClose]);

  // Delete document
  const handleDelete = useCallback((docId: string) => {
    const updatedDocs = documents.filter(d => d.id !== docId);
    saveDocuments(updatedDocs);
    setDocuments(updatedDocs);
    setDeleteConfirm(null);
  }, [documents]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              내 문서함
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            aria-label="닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* New document section */}
          {isCreating ? (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                문서 이름
              </label>
              <input
                type="text"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="문서 이름을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNew();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSaveNew}
                  disabled={!newDocName.trim()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
                >
                  💾 저장
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full mb-4 py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              현재 문서를 새로 저장
            </button>
          )}

          {/* Document list */}
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/>
              </svg>
              <p>저장된 문서가 없습니다</p>
              <p className="text-sm mt-1">현재 문서를 저장해보세요!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                저장된 문서 ({documents.length}개)
              </p>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        📄 {doc.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        수정: {formatDate(doc.updatedAt)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                        {doc.content.slice(0, 80).replace(/\n/g, ' ')}...
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleLoad(doc)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
                    >
                      📂 불러오기
                    </button>
                    <button
                      onClick={() => handleUpdate(doc)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
                      title="현재 내용으로 덮어쓰기"
                    >
                      💾
                    </button>
                    {deleteConfirm === doc.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-2 rounded text-xs font-medium transition-colors"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white py-1.5 px-2 rounded text-xs font-medium transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(doc.id)}
                        className="bg-gray-200 dark:bg-gray-600 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 py-1.5 px-3 rounded text-sm transition-colors"
                        title="삭제"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export const LocalStorageModal = React.memo(LocalStorageModalComponent);
