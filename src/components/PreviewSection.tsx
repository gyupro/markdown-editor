import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from './MarkdownComponents';

interface PreviewSectionProps {
  isVisible: boolean;
  isClient: boolean;
  markdown: string;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  isVisible,
  isClient,
  markdown,
  previewRef,
}) => (
  <section 
    className={`${isVisible ? 'flex' : 'hidden'} md:flex md:w-1/2 flex-col`} 
    aria-label="미리보기"
  >
    <header className="hidden md:block bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">✨ PREVIEW</h2>
    </header>
    <div className="flex-1 overflow-auto overflow-x-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 px-4 md:px-0">
      {isClient ? (
        <article 
          ref={previewRef} 
          className="py-4 md:p-6 max-w-full prose prose-slate dark:prose-invert prose-lg md:prose-xl prose-headings:scroll-mt-4 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-blockquote:border-l-blue-500 prose-img:rounded-lg prose-img:shadow-lg" 
          aria-label="렌더링된 마크다운 미리보기"
          style={{
            fontSize: 'clamp(14px, 4vw, 18px)',
            lineHeight: '1.7',
            maxWidth: '100%',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      ) : (
        <div className="p-4 text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
          미리보기를 로드하는 중...
        </div>
      )}
    </div>
  </section>
); 