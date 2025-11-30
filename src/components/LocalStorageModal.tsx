import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface SavedDocument {
  id: string;
  name: string;
  content: string;
  folderId: string | null; // null = root level
  createdAt: string;
  updatedAt: string;
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null; // null = root level
  createdAt: string;
  isExpanded?: boolean;
}

interface LocalStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onLoad: (content: string) => void;
}

const STORAGE_KEY = 'markdown-editor-documents';
const FOLDERS_KEY = 'markdown-editor-folders';

// Get all saved documents
const getSavedDocuments = (): SavedDocument[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const docs = data ? JSON.parse(data) : [];
    // Migration: add folderId if missing
    return docs.map((doc: SavedDocument) => ({
      ...doc,
      folderId: doc.folderId ?? null
    }));
  } catch {
    return [];
  }
};

// Get all folders
const getSavedFolders = (): Folder[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FOLDERS_KEY);
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

// Save folders to localStorage
const saveFolders = (folders: Folder[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
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

// Folder Tree Item Component
const FolderTreeItem: React.FC<{
  folder: Folder;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
  isSelected: boolean;
  onRename: (newName: string) => void;
  onDelete: () => void;
  documentCount: number;
  children?: React.ReactNode;
}> = ({ folder, level, isExpanded, onToggle, onSelect, isSelected, onRename, onDelete, documentCount, children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRename = () => {
    if (editName.trim() && editName !== folder.name) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1.5 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isSelected ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={onSelect}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
        >
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
          {isExpanded ? (
            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v1H3.5v7a2 2 0 002 2h13.75L21 10.5V8a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14z" />
          ) : (
            <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
          )}
        </svg>

        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setEditName(folder.name);
                setIsEditing(false);
              }
            }}
            className="flex-1 px-1 py-0.5 text-sm border border-blue-400 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
            {folder.name}
          </span>
        )}

        <span className="text-xs text-gray-400">({documentCount})</span>

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500"
            title="이름 변경"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {showDeleteConfirm ? (
            <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-1.5 py-0.5 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-500 hover:text-red-500"
              title="삭제"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {isExpanded && children}
    </div>
  );
};

// Document Item Component
const DocumentItem: React.FC<{
  doc: SavedDocument;
  level: number;
  onLoad: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onMove: (folderId: string | null) => void;
  folders: Folder[];
}> = ({ doc, level, onLoad, onUpdate, onDelete, onMove, folders }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  return (
    <div
      className="group flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50"
      style={{ paddingLeft: `${level * 16 + 24}px` }}
    >
      <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
      </svg>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {doc.name}
        </div>
        <div className="text-xs text-gray-400 truncate">
          {formatDate(doc.updatedAt)}
        </div>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onLoad}
          className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
          title="불러오기"
        >
          열기
        </button>
        <button
          onClick={onUpdate}
          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-500"
          title="현재 내용으로 덮어쓰기"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500"
            title="이동"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          {showMoveMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px]">
              <div className="p-1">
                <button
                  onClick={() => {
                    onMove(null);
                    setShowMoveMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    doc.folderId === null ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  📁 루트
                </button>
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      onMove(folder.id);
                      setShowMoveMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      doc.folderId === folder.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    📁 {folder.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {showDeleteConfirm ? (
          <div className="flex gap-0.5">
            <button
              onClick={() => {
                onDelete();
                setShowDeleteConfirm(false);
              }}
              className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-1.5 py-0.5 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-500 hover:text-red-500"
            title="삭제"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

const LocalStorageModalComponent: React.FC<LocalStorageModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onLoad,
}) => {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newDocName, setNewDocName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data on mount
  useEffect(() => {
    if (isOpen) {
      setDocuments(getSavedDocuments());
      setFolders(getSavedFolders());
      setNewDocName(extractTitle(currentContent));
      setIsCreatingDoc(false);
      setIsCreatingFolder(false);
      setSearchQuery('');
    }
  }, [isOpen, currentContent]);

  // Count documents in folder
  const getDocumentCount = useCallback((folderId: string | null): number => {
    return documents.filter(doc => doc.folderId === folderId).length;
  }, [documents]);

  // Filter documents by search
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter(doc =>
      doc.name.toLowerCase().includes(query) ||
      doc.content.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  // Get root-level documents
  const rootDocuments = useMemo(() => {
    return filteredDocuments.filter(doc => doc.folderId === null);
  }, [filteredDocuments]);

  // Get documents in a folder
  const getDocumentsInFolder = useCallback((folderId: string) => {
    return filteredDocuments.filter(doc => doc.folderId === folderId);
  }, [filteredDocuments]);

  // Toggle folder expansion
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  // Create new folder
  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) return;

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      parentId: selectedFolderId,
      createdAt: new Date().toISOString(),
    };

    const updatedFolders = [...folders, newFolder];
    saveFolders(updatedFolders);
    setFolders(updatedFolders);
    setExpandedFolders(prev => new Set([...prev, newFolder.id]));
    setIsCreatingFolder(false);
    setNewFolderName('');
  }, [newFolderName, selectedFolderId, folders]);

  // Rename folder
  const handleRenameFolder = useCallback((folderId: string, newName: string) => {
    const updatedFolders = folders.map(f =>
      f.id === folderId ? { ...f, name: newName } : f
    );
    saveFolders(updatedFolders);
    setFolders(updatedFolders);
  }, [folders]);

  // Delete folder
  const handleDeleteFolder = useCallback((folderId: string) => {
    // Move documents to root
    const updatedDocs = documents.map(doc =>
      doc.folderId === folderId ? { ...doc, folderId: null } : doc
    );
    saveDocuments(updatedDocs);
    setDocuments(updatedDocs);

    // Delete folder
    const updatedFolders = folders.filter(f => f.id !== folderId);
    saveFolders(updatedFolders);
    setFolders(updatedFolders);

    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  }, [folders, documents, selectedFolderId]);

  // Save new document
  const handleSaveNew = useCallback(() => {
    if (!newDocName.trim()) return;

    const newDoc: SavedDocument = {
      id: Date.now().toString(),
      name: newDocName.trim(),
      content: currentContent,
      folderId: selectedFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedDocs = [newDoc, ...documents];
    saveDocuments(updatedDocs);
    setDocuments(updatedDocs);
    setIsCreatingDoc(false);
    setNewDocName('');
  }, [newDocName, currentContent, selectedFolderId, documents]);

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
  }, [documents]);

  // Move document to folder
  const handleMoveDocument = useCallback((docId: string, folderId: string | null) => {
    const updatedDocs = documents.map(d =>
      d.id === docId ? { ...d, folderId } : d
    );
    saveDocuments(updatedDocs);
    setDocuments(updatedDocs);
  }, [documents]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              내 문서함
            </h2>
            <span className="text-sm text-gray-500">
              ({documents.length}개 문서, {folders.length}개 폴더)
            </span>
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

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="문서 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            새 폴더
          </button>
          <button
            onClick={() => setIsCreatingDoc(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            현재 문서 저장
          </button>
        </div>

        {/* Create Folder Form */}
        {isCreatingFolder && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="폴더 이름"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder();
                  if (e.key === 'Escape') setIsCreatingFolder(false);
                }}
              />
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white rounded-md transition-colors"
              >
                생성
              </button>
              <button
                onClick={() => setIsCreatingFolder(false)}
                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Create Document Form */}
        {isCreatingDoc && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="문서 이름"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNew();
                  if (e.key === 'Escape') setIsCreatingDoc(false);
                }}
              />
              <select
                value={selectedFolderId || ''}
                onChange={(e) => setSelectedFolderId(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">📁 루트</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>📁 {folder.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveNew}
                disabled={!newDocName.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-md transition-colors"
              >
                💾 저장
              </button>
              <button
                onClick={() => setIsCreatingDoc(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Content - Tree View */}
        <div className="flex-1 overflow-y-auto p-3">
          {documents.length === 0 && folders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-20 h-20 mx-auto mb-4 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/>
              </svg>
              <p className="text-lg font-medium">문서함이 비어있습니다</p>
              <p className="text-sm mt-1">새 폴더를 만들거나 현재 문서를 저장해보세요!</p>
            </div>
          ) : searchQuery && filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Folders */}
              {folders.map(folder => (
                <FolderTreeItem
                  key={folder.id}
                  folder={folder}
                  level={0}
                  isExpanded={expandedFolders.has(folder.id)}
                  onToggle={() => toggleFolder(folder.id)}
                  onSelect={() => setSelectedFolderId(folder.id)}
                  isSelected={selectedFolderId === folder.id}
                  onRename={(newName) => handleRenameFolder(folder.id, newName)}
                  onDelete={() => handleDeleteFolder(folder.id)}
                  documentCount={getDocumentCount(folder.id)}
                >
                  {/* Documents in this folder */}
                  {getDocumentsInFolder(folder.id).map(doc => (
                    <DocumentItem
                      key={doc.id}
                      doc={doc}
                      level={1}
                      onLoad={() => handleLoad(doc)}
                      onUpdate={() => handleUpdate(doc)}
                      onDelete={() => handleDelete(doc.id)}
                      onMove={(folderId) => handleMoveDocument(doc.id, folderId)}
                      folders={folders}
                    />
                  ))}
                </FolderTreeItem>
              ))}

              {/* Root-level documents */}
              {rootDocuments.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">
                    📁 루트 ({rootDocuments.length})
                  </div>
                  {rootDocuments.map(doc => (
                    <DocumentItem
                      key={doc.id}
                      doc={doc}
                      level={0}
                      onLoad={() => handleLoad(doc)}
                      onUpdate={() => handleUpdate(doc)}
                      onDelete={() => handleDelete(doc.id)}
                      onMove={(folderId) => handleMoveDocument(doc.id, folderId)}
                      folders={folders}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            💡 문서를 폴더로 드래그하거나 이동 버튼을 사용하세요
          </div>
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
