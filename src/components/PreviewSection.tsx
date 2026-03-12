'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTranslations } from 'next-intl';
import { createMarkdownComponents } from './MarkdownComponents';

interface PreviewSectionProps {
  isVisible: boolean;
  isClient: boolean;
  markdown: string;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
}

const PreviewSectionComponent: React.FC<PreviewSectionProps> = ({
  isVisible,
  isClient,
  markdown,
  previewRef,
  onScroll,
}) => {
  const t = useTranslations('preview');

  // Create markdown components with current locale translations
  // Note: goToSection uses {section} as a placeholder that gets replaced in the component
  const markdownComponents = useMemo(() => createMarkdownComponents({
    goToSection: t.raw('goToSection'),
    copyLink: t('copyLink'),
    copyCode: t('copyCode'),
    codeCopied: t('codeCopied'),
    copyCodeAriaLabel: t('copyCodeAriaLabel'),
    codeCopiedAriaLabel: t('codeCopiedAriaLabel'),
  }), [t]);

  // Memoize markdown rendering for performance
  const renderedMarkdown = useMemo(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {markdown}
    </ReactMarkdown>
  ), [markdown, markdownComponents]);

  return (
    <section
      className={`${isVisible ? 'flex' : 'hidden'} md:flex w-full md:w-1/2 flex-col`}
      aria-label={t('title')}
    >
      <header
        className="hidden md:flex items-center gap-2 px-5 py-2.5"
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h2
          className="text-[10px] font-semibold tracking-[0.25em] uppercase flex items-center gap-2"
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            color: 'var(--text-muted)',
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.6 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          {t('title').toUpperCase()}
        </h2>
      </header>
      <div
        ref={previewRef}
        className="flex-1 overflow-auto"
        style={{ background: 'var(--background)' }}
        onScroll={onScroll}
      >
        {isClient ? (
          <article
            className="max-w-3xl mx-auto px-6 py-8 md:px-12 md:py-12"
            aria-label={t('livePreview')}
          >
            {renderedMarkdown}
          </article>
        ) : (
          <div style={{ color: 'var(--text-muted)' }} role="status" aria-live="polite">
            {t('noContent')}
          </div>
        )}
      </div>
    </section>
  );
};

// React.memo로 컴포넌트 메모이제이션하여 불필요한 리렌더링 방지
export const PreviewSection = React.memo(PreviewSectionComponent); 