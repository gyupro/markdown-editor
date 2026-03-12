'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MobileMenu } from './MobileMenu';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  isExporting: boolean;
  onExportPDF: () => void;
  onFullscreen: () => void;
  onShare: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  isThemeLoaded?: boolean;
}

const GitHubIcon = () => (
  <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ isExporting, onExportPDF, onFullscreen, onShare, theme, onThemeToggle, isThemeLoaded = false }) => {
  const t = useTranslations('header');

  return (
    <header className="px-4 md:px-6 py-3 md:py-4" style={{ background: 'var(--surface-elevated)', borderBottom: '1px solid var(--border)' }} role="banner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Markdown Editor Logo"
              width={32}
              height={32}
              className="w-6 h-6 md:w-8 md:h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <h1 className="text-base md:text-xl font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              Markdown Editor
            </h1>
          </div>
          <a
            href="https://github.com/gyupro/markdown-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex transition-colors duration-200 text-sm items-center gap-1 flex-shrink-0"
            style={{ color: 'var(--text-muted)' }}
            title="GitHub Repository"
            aria-label={t('viewOnGitHub')}
          >
            <GitHubIcon />
            <span className="hidden sm:inline">{t('openSource')}</span>
          </a>
        </div>
        <nav className="flex items-center gap-2" aria-label="Main actions">
          {/* Language Switcher */}
          <LanguageSwitcher />

          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-subtle)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
            title={theme === 'light' ? t('darkMode') : t('lightMode')}
            suppressHydrationWarning
          >
            {/* Show placeholder during SSR, then actual icon after hydration */}
            {!isThemeLoaded ? (
              <span className="w-5 h-5 block" />
            ) : theme === 'light' ? (
              <MoonIcon />
            ) : (
              <SunIcon />
            )}
          </button>
          <button
            onClick={onShare}
            className="px-3 md:px-4 py-1.5 rounded-md transition-all duration-150 flex items-center gap-1 md:gap-2 text-sm flex-shrink-0"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--surface)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
            aria-label={t('shareDocument')}
          >
            <span className="text-sm" aria-hidden="true">🌐</span>
            <span className="hidden sm:inline">{t('shareDocument')}</span>
            <span className="sm:hidden">{t('share')}</span>
          </button>
          <div className="hidden md:flex gap-2">
            <button
              onClick={onExportPDF}
              disabled={isExporting}
              className="px-4 py-1.5 rounded-md disabled:opacity-50 transition-all duration-150 flex items-center gap-2 text-sm"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.borderColor = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--surface)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
              aria-label={isExporting ? t('exportingPDF') : t('exportPDF')}
            >
              {isExporting ? (
                <>
                  <span className="animate-spin text-sm" aria-hidden="true">⏳</span>
                  <span>{t('exportingPDF')}</span>
                </>
              ) : (
                <>
                  <span className="text-sm" aria-hidden="true">📄</span>
                  <span>{t('exportPDF')}</span>
                </>
              )}
            </button>
            <button
              onClick={onFullscreen}
              className="px-4 py-1.5 rounded-md transition-all duration-150 text-sm flex items-center gap-2"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--surface)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
              aria-label={t('fullscreenPreview')}
            >
              <span className="text-sm" aria-hidden="true">🖥️</span>
              <span>{t('fullscreenPreview')}</span>
            </button>
          </div>
          <div className="md:hidden">
            <MobileMenu
              isExporting={isExporting}
              onExportPDF={onExportPDF}
              onFullscreen={onFullscreen}
              theme={theme}
              onThemeToggle={onThemeToggle}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}; 