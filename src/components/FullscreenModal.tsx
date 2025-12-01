'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from 'next-intl';
import { markdownComponents } from './MarkdownComponents';

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

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-title"
    >
      <div className="flex flex-col h-full">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4" role="banner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <h1 id="fullscreen-title" className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">{t('title')}</h1>
              <a
                href="https://github.com/gyupro/markdown-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm items-center gap-1"
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
                className="px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors shadow-md hover:shadow-lg text-sm"
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
                className="px-3 md:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg text-sm"
                aria-label={t('exitLabel')}
              >
                <span className="text-xs md:text-base"></span>
                <span className="hidden sm:inline"> {t('closeEsc')}</span>
                <span className="sm:hidden"> {t('close')}</span>
              </button>
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {isClient ? (
            <article className="max-w-4xl mx-auto p-4 md:p-8" aria-label={t('previewLabel')}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {markdown}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
              {t('loadingPreview')}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}; 