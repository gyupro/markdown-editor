import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from './MarkdownComponents';

interface PreviewSectionProps {
  isVisible: boolean;
  isClient: boolean;
  markdown: string;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

const PreviewSectionComponent: React.FC<PreviewSectionProps> = ({
  isVisible,
  isClient,
  markdown,
  previewRef,
}) => {
  // 마크다운 렌더링 결과를 메모이제이션하여 성능 최적화
  const renderedMarkdown = useMemo(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={markdownComponents}
    >
      {markdown}
    </ReactMarkdown>
  ), [markdown]);

  return (
    <section 
      className={`${isVisible ? 'flex' : 'hidden'} md:flex w-full md:w-1/2 flex-col`} 
      aria-label="미리보기"
    >
      <header className="hidden md:block bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">✨ PREVIEW</h2>
      </header>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {isClient ? (
          <article 
            ref={previewRef}
            className="max-w-4xl mx-auto p-4 md:p-8" 
            aria-label="렌더링된 마크다운 미리보기"
          >
            {renderedMarkdown}
          </article>
        ) : (
          <div className="text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
            미리보기를 로드하는 중...
          </div>
        )}
      </div>
    </section>
  );
};

// React.memo로 컴포넌트 메모이제이션하여 불필요한 리렌더링 방지
export const PreviewSection = React.memo(PreviewSectionComponent); 