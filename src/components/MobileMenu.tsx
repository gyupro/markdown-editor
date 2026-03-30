'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface MobileMenuProps {
  isExporting: boolean;
  onExportPDF: () => void;
  onFullscreen: () => void;
  onShare: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isExporting,
  onExportPDF,
  onFullscreen,
  onShare,
  theme,
  onThemeToggle
}) => {
  const t = useTranslations('mobileMenu');
  const tHeader = useTranslations('header');
  const tShortcuts = useTranslations('shortcuts');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
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
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        aria-label={t('open')}
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

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg py-2 z-50" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>
          <button
            onClick={() => handleMenuAction(onShare)}
            className="w-full px-4 py-3 text-left text-sm hover:opacity-80 flex items-center gap-3"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            <span>{tHeader('shareDocument')}</span>
          </button>

          <button
            onClick={() => handleMenuAction(onExportPDF)}
            disabled={isExporting}
            className="w-full px-4 py-3 text-left text-sm hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>{t('exportingPDF')}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>{t('exportPDF')}</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleMenuAction(onFullscreen)}
            className="w-full px-4 py-3 text-left text-sm hover:opacity-80 flex items-center gap-3"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
            <span>{t('fullscreenPreview')}</span>
          </button>

          <button
            onClick={() => handleMenuAction(onThemeToggle)}
            className="w-full px-4 py-3 text-left text-sm hover:opacity-80 flex items-center gap-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {theme === 'light' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>{t('darkMode')}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>{t('lightMode')}</span>
              </>
            )}
          </button>

          <hr className="my-2" style={{ borderColor: 'var(--border)' }} />

          <div className="px-4 py-2">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {tShortcuts('hint')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
