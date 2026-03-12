'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { MobileTab } from '@/types/markdown';

interface MobileTabsProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({ activeTab, onTabChange }) => {
  const t = useTranslations('tabs');

  return (
    <div className="md:hidden flex" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => onTabChange('editor')}
        className="flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        style={{
          background: activeTab === 'editor' ? 'var(--surface-elevated)' : 'transparent',
          color: activeTab === 'editor' ? 'var(--accent)' : 'var(--text-muted)',
          borderBottom: activeTab === 'editor' ? '2px solid var(--accent)' : '2px solid transparent',
        }}
        aria-pressed={activeTab === 'editor'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        {t('editor')}
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className="flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        style={{
          background: activeTab === 'preview' ? 'var(--surface-elevated)' : 'transparent',
          color: activeTab === 'preview' ? 'var(--accent)' : 'var(--text-muted)',
          borderBottom: activeTab === 'preview' ? '2px solid var(--accent)' : '2px solid transparent',
        }}
        aria-pressed={activeTab === 'preview'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        {t('preview')}
      </button>
    </div>
  );
}; 