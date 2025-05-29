import React from 'react';
import { MobileTab } from '@/types/markdown';

interface MobileTabsProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({ activeTab, onTabChange }) => (
  <div className="md:hidden flex bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <button
      onClick={() => onTabChange('editor')}
      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
        activeTab === 'editor'
          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
      }`}
      aria-pressed={activeTab === 'editor'}
    >
      📝 편집기
    </button>
    <button
      onClick={() => onTabChange('preview')}
      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
        activeTab === 'preview'
          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
      }`}
      aria-pressed={activeTab === 'preview'}
    >
      ✨ 미리보기
    </button>
  </div>
); 