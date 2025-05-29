import React, { useState, useRef, useEffect } from 'react';

interface MobileMenuProps {
  isExporting: boolean;
  onExportPDF: () => void;
  onFullscreen: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isExporting, 
  onExportPDF, 
  onFullscreen 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
        aria-label="메뉴 열기"
        aria-expanded={isOpen}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          )}
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <button
            onClick={() => handleMenuAction(onExportPDF)}
            disabled={isExporting}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {isExporting ? (
              <>
                <span className="animate-spin text-base">⏳</span>
                <span>PDF 생성 중...</span>
              </>
            ) : (
              <>
                <span className="text-base">📄</span>
                <span>PDF 출력</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => handleMenuAction(onFullscreen)}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <span className="text-base">🖥️</span>
            <span>전체화면 미리보기</span>
          </button>

          <hr className="my-2 border-gray-200 dark:border-gray-600" />
          
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              키보드 단축키: Ctrl+P (PDF), ESC (전체화면 종료)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 