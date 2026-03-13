'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkEmoji from 'remark-emoji';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { useTranslations } from 'next-intl';
import { createMarkdownComponents } from './MarkdownComponents';
import { preprocessMarkdown } from '@/lib/markdownPreprocess';

interface FullscreenModalProps {
  isClient: boolean;
  isExporting: boolean;
  markdown: string;
  onExportPDF: () => void;
  onClose: () => void;
}

const GitHubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
  </svg>
);

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isClient,
  isExporting,
  markdown,
  onExportPDF,
  onClose,
}) => {
  const t = useTranslations('fullscreen');
  const tHeader = useTranslations('header');
  const tPreview = useTranslations('preview');

  // Create markdown components with current locale translations
  // Note: goToSection uses {section} as a placeholder that gets replaced in the component
  const markdownComponents = useMemo(() => createMarkdownComponents({
    goToSection: tPreview.raw('goToSection'),
    copyLink: tPreview('copyLink'),
    copyCode: tPreview('copyCode'),
    codeCopied: tPreview('codeCopied'),
    copyCodeAriaLabel: tPreview('copyCodeAriaLabel'),
    codeCopiedAriaLabel: tPreview('codeCopiedAriaLabel'),
  }), [tPreview]);

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        background: 'var(--background)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-title"
    >
      <div className="flex flex-col h-full">
        <header
          className="backdrop-blur-sm px-4 md:px-6 py-3 md:py-4"
          style={{
            background: 'var(--surface-elevated)',
            borderBottom: '1px solid var(--border)',
          }}
          role="banner"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <h1 id="fullscreen-title" className="text-lg md:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t('title')}</h1>
              <a
                href="https://github.com/gyupro/markdown-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex transition-colors duration-200 text-sm items-center gap-1"
                style={{ color: 'var(--text-muted)' }}
                title="GitHub Repository"
                aria-label={t('openSourceLabel')}
              >
                <GitHubIcon />
                <span className="hidden md:inline">{tHeader('openSource')}</span>
              </a>
            </div>
            <nav className="flex gap-2 md:gap-3" aria-label={t('actions')}>
              <button
                onClick={onExportPDF}
                disabled={isExporting}
                className="px-3 md:px-4 py-2 text-white rounded-lg transition-colors shadow-md hover:shadow-lg text-sm"
                style={{
                  background: 'var(--accent)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                aria-label={isExporting ? t('exportingPDF') : t('exportPDF')}
              >
                {isExporting ? (
                  <>
                    <span className="text-xs md:text-base"></span>
                    <span className="hidden sm:inline"> {t('exportingPDF')}</span>
                    <span className="sm:hidden"> {t('exportingShort')}</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs md:text-base"></span>
                    <span className="hidden sm:inline"> {t('exportPDF')}</span>
                    <span className="sm:hidden"> PDF</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-3 md:px-4 py-2 text-white rounded-lg transition-colors shadow-md hover:shadow-lg text-sm"
                style={{
                  background: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                aria-label={t('exitLabel')}
              >
                <span className="text-xs md:text-base"></span>
                <span className="hidden sm:inline"> {t('closeEsc')}</span>
                <span className="sm:hidden"> {t('close')}</span>
              </button>
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-auto" style={{ background: 'var(--background)' }}>
          {isClient ? (
            <article className="max-w-4xl mx-auto p-4 md:p-8" aria-label={t('previewLabel')}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, [remarkEmoji, { accessible: true }]]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={markdownComponents}
              >
                {preprocessMarkdown(markdown)}
              </ReactMarkdown>
            </article>
          ) : (
            <div role="status" aria-live="polite" style={{ color: 'var(--text-muted)' }}>
              {t('loadingPreview')}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}; 