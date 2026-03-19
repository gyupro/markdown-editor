import React from 'react';
import { MarkdownComponents } from '@/types/markdown';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import MermaidBlock from './MermaidBlock';

// Translation interface for markdown components
export interface MarkdownTranslations {
  goToSection: string;  // Template: "Go to {section} section"
  copyLink: string;
  copyCode: string;
  codeCopied: string;
  copyCodeAriaLabel: string;
  codeCopiedAriaLabel: string;
}

// Default English translations (fallback)
const defaultTranslations: MarkdownTranslations = {
  goToSection: 'Go to {section} section',
  copyLink: 'Copy link',
  copyCode: 'Copy code',
  codeCopied: 'Copied!',
  copyCodeAriaLabel: 'Copy code to clipboard',
  codeCopiedAriaLabel: 'Code copied to clipboard',
};

// 텍스트를 URL 친화적인 ID로 변환하는 함수
const createSlug = (text: string): string => {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // 유니코드 문자, 숫자, 공백, 하이픈만 유지
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변경
    .replace(/-+/g, '-') // 연속된 하이픈을 하나로 변경
    .replace(/^-+|-+$/g, ''); // 시작과 끝의 하이픈 제거

  // 모든 헤딩 ID가 하이픈으로 시작하도록 함
  return '-' + slug;
};

// 헤딩 컴포넌트에서 사용할 텍스트 추출 함수
const extractText = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  if (React.isValidElement(children)) {
    const elementProps = children.props as { children?: React.ReactNode };
    return extractText(elementProps.children);
  }
  return '';
};

// 앵커 링크가 있는 헤딩 컴포넌트
const HeadingWithAnchor: React.FC<{
  level: 1 | 2 | 3;
  children: React.ReactNode;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
  translations: MarkdownTranslations;
}> = ({ level, children, props, translations }) => {
  const text = extractText(children);
  const id = createSlug(text);
  const goToSectionLabel = translations.goToSection.replace('{section}', text);

  const handleAnchorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const anchorLink = (size: string) => (
    <a
      href={`#${id}`}
      onClick={handleAnchorClick}
      className={`ml-3 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity duration-300 ${size}`}
      style={{ color: 'var(--accent)' }}
      aria-label={goToSectionLabel}
      title={translations.copyLink}
    >
      &para;
    </a>
  );

  if (level === 1) {
    return (
      <h1
        id={id}
        className="group relative scroll-mt-20 mb-6 md:mb-8 pb-3 md:pb-4 leading-[1.15] tracking-tight"
        style={{
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          borderBottom: '2px solid var(--accent)',
        }}
        {...props}
      >
        {children}
        {anchorLink('text-xl')}
      </h1>
    );
  } else if (level === 2) {
    return (
      <h2
        id={id}
        className="group relative scroll-mt-20 mt-10 md:mt-12 mb-4 md:mb-5 pb-2 leading-[1.2] tracking-tight"
        style={{
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
          fontSize: 'clamp(1.375rem, 3vw, 2rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          borderBottom: '1px solid var(--border)',
        }}
        {...props}
      >
        {children}
        {anchorLink('text-lg')}
      </h2>
    );
  } else {
    return (
      <h3
        id={id}
        className="group relative scroll-mt-20 mt-8 md:mt-10 mb-3 md:mb-4 leading-[1.25] tracking-tight"
        style={{
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
          fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
          fontWeight: 600,
          fontStyle: 'italic',
          color: 'var(--text-primary)',
        }}
        {...props}
      >
        {children}
        {anchorLink('text-base')}
      </h3>
    );
  }
};

// Extract language from code element className
const extractLanguage = (codeElement: React.ReactNode): string => {
  if (React.isValidElement(codeElement)) {
    const props = codeElement.props as { className?: string };
    const match = /language-(\w+)/.exec(props.className || '');
    return match ? match[1] : '';
  }
  return '';
};

// Extract code text from children recursively
const extractCodeText = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractCodeText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractCodeText(props.children);
  }
  return '';
};

const CodeBlock: React.FC<{ children: React.ReactNode; translations: MarkdownTranslations }> = ({ children: codeElementAsNode, translations }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  let actualCodeText = '';
  let language = '';

  if (typeof codeElementAsNode === 'string') {
    actualCodeText = codeElementAsNode;
  } else if (React.isValidElement(codeElementAsNode)) {
    language = extractLanguage(codeElementAsNode);
    actualCodeText = extractCodeText(codeElementAsNode);
  }

  // Mermaid diagram support
  if (language === 'mermaid') {
    return <MermaidBlock code={actualCodeText.trim()} />;
  }

  const handleCopy = async () => {
    await copyToClipboard(actualCodeText);
  };

  const cleanedCode = actualCodeText.replace(/\n$/, '');

  return (
    <div className="relative group my-6 md:my-8">
      <div
        className="rounded-lg overflow-hidden"
        style={{
          boxShadow: '0 8px 30px var(--shadow-color), 0 2px 8px var(--shadow-color)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Language bar - integrated header */}
        {language && (
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{
              background: 'var(--code-bg)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.15em]"
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                color: '#e8c36a',
              }}
            >
              {language}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            </div>
          </div>
        )}

        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            borderRadius: 0,
            fontSize: '0.85rem',
            lineHeight: '1.7',
            background: 'var(--code-bg)',
            fontFamily: 'var(--font-jetbrains), monospace',
          }}
          showLineNumbers={cleanedCode.split('\n').length > 3}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1.5em',
            color: '#4a4458',
            userSelect: 'none',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.75rem',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {cleanedCode}
        </SyntaxHighlighter>
      </div>

      <button
        onClick={handleCopy}
        className="absolute top-2 right-14 px-3 py-1.5 rounded-md text-xs transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 z-10"
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          background: 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        title={isCopied ? translations.codeCopied : translations.copyCode}
        aria-label={isCopied ? translations.codeCopiedAriaLabel : translations.copyCodeAriaLabel}
      >
        {isCopied ? (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
          </span>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        )}
      </button>
    </div>
  );
};

// Factory function to create markdown components with translations
export const createMarkdownComponents = (translations?: Partial<MarkdownTranslations>): MarkdownComponents => {
  const t: MarkdownTranslations = { ...defaultTranslations, ...translations };

  return {
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <HeadingWithAnchor level={1} props={props} translations={t}>
        {children}
      </HeadingWithAnchor>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <HeadingWithAnchor level={2} props={props} translations={t}>
        {children}
      </HeadingWithAnchor>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <HeadingWithAnchor level={3} props={props} translations={t}>
        {children}
      </HeadingWithAnchor>
    ),
    h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = extractText(children);
      const id = createSlug(text);
      return (
        <h4
          id={id}
          className="group relative scroll-mt-20 mt-6 md:mt-8 mb-2 md:mb-3 leading-[1.3]"
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
          {...props}
        >
          {children}
        </h4>
      );
    },
    h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className="mt-5 md:mt-6 mb-2 leading-[1.3]"
        style={{
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
          fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
          fontWeight: 600,
          color: 'var(--text-secondary)',
        }}
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className="mt-4 md:mt-5 mb-2 leading-[1.3]"
        style={{
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
          fontSize: 'clamp(0.875rem, 1.6vw, 1rem)',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
        {...props}
      >
        {children}
      </h6>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p
        className="mb-4 md:mb-5"
        style={{
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
          fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)',
          lineHeight: '1.85',
          color: 'var(--text-secondary)',
          letterSpacing: '0.01em',
        }}
        {...props}
      >
        {children}
      </p>
    ),
    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="my-6 md:my-8 pl-5 md:pl-7 py-4 md:py-5 rounded-r-md relative overflow-hidden"
        style={{
          borderLeft: '3px solid var(--blockquote-border)',
          background: 'var(--blockquote-bg)',
        }}
        {...props}
      >
        <div
          className="absolute top-3 left-3 text-4xl leading-none opacity-10 select-none"
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            color: 'var(--accent)',
          }}
          aria-hidden="true"
        >
          &ldquo;
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontStyle: 'italic',
            fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
            lineHeight: '1.8',
            color: 'var(--text-secondary)',
          }}
        >
          {children}
        </div>
      </blockquote>
    ),
    code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code
        className="px-1.5 md:px-2 py-0.5 md:py-1 rounded-[4px]"
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '0.85em',
          fontWeight: 500,
          background: 'var(--inline-code-bg)',
          color: 'var(--inline-code-text)',
          border: '1px solid var(--inline-code-border)',
        }}
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
      <CodeBlock {...props} translations={t}>
        {children}
      </CodeBlock>
    ),
    a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        href={href}
        className="underline decoration-1 underline-offset-3 transition-all duration-200 font-medium"
        style={{
          color: 'var(--link-color)',
          textDecorationColor: 'var(--link-color)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--link-hover)';
          e.currentTarget.style.textDecorationThickness = '2px';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--link-color)';
          e.currentTarget.style.textDecorationThickness = '1px';
        }}
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="space-y-2 md:space-y-2.5 mb-5 md:mb-6 ml-1" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, start, ...props }: React.HTMLAttributes<HTMLOListElement> & { start?: number }) => {
      const startIndex = (start ?? 1) - 1; // start attribute is 1-based
      let index = 0;
      const numberedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const currentIndex = index;
          index++;
          return React.cloneElement(child as React.ReactElement<{ 'data-index'?: number; 'data-ordered'?: boolean }>, {
            'data-index': startIndex + currentIndex,
            'data-ordered': true,
          });
        }
        return child;
      });
      return (
        <ol className="space-y-2 md:space-y-2.5 mb-5 md:mb-6 ml-1" {...props}>
          {numberedChildren}
        </ol>
      );
    },
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement> & { 'data-index'?: number; 'data-ordered'?: boolean }) => {
      const childArray = React.Children.toArray(children);
      const hasCheckbox = childArray.some(
        (child) => React.isValidElement(child) && (child.props as { type?: string }).type === 'checkbox'
      );
      const isOrdered = (props as { 'data-ordered'?: boolean })['data-ordered'];
      const index = (props as { 'data-index'?: number })['data-index'] ?? 0;

      const { 'data-index': _di, 'data-ordered': _do, ...domProps } = props as Record<string, unknown>;

      return (
        <li
          className="flex items-start"
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: 'clamp(1rem, 1.7vw, 1.15rem)',
            lineHeight: '1.8',
            color: 'var(--text-secondary)',
          }}
          {...domProps}
        >
          {hasCheckbox ? null : isOrdered ? (
            <span
              className="mr-3 mt-0.5 min-w-[1.5em] text-right font-semibold"
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                color: 'var(--accent)',
                fontSize: '0.9em',
              }}
            >
              {index + 1}.
            </span>
          ) : (
            <span
              className="mr-3 mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          )}
          <span>{children}</span>
        </li>
      );
    },
    hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
      <div className="my-10 md:my-12 flex items-center justify-center gap-4" {...props}>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <div className="flex gap-1.5">
          <span className="w-1 h-1 rounded-full" style={{ background: 'var(--accent)', opacity: 0.4 }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', opacity: 0.7 }} />
          <span className="w-1 h-1 rounded-full" style={{ background: 'var(--accent)', opacity: 0.4 }} />
        </div>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>
    ),
    table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div
        className="overflow-x-auto my-6 md:my-8 rounded-lg"
        style={{
          border: '1px solid var(--border)',
          boxShadow: '0 4px 20px var(--shadow-color)',
        }}
      >
        <table
          className="w-full"
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: '0.95rem',
          }}
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead style={{ background: 'var(--table-header)' }} {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...props}>
        {children}
      </tbody>
    ),
    th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th
        className="px-4 md:px-5 py-3 md:py-3.5 text-left text-xs font-bold tracking-[0.15em] uppercase"
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          color: 'var(--accent)',
          background: 'var(--table-header)',
          borderBottom: '2px solid var(--accent)',
        }}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td
        className="px-4 md:px-5 py-3 md:py-3.5"
        style={{
          color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--border)',
        }}
        {...props}
      >
        <div className="leading-relaxed">
          {children}
        </div>
      </td>
    ),
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className="transition-colors duration-150"
        style={{
          background: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent-subtle)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        {...props}
      >
        {children}
      </tr>
    ),
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong
        className="font-bold"
        style={{ color: 'var(--text-primary)' }}
        {...props}
      >
        {children}
      </strong>
    ),
    em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <em
        style={{
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
        }}
        {...props}
      >
        {children}
      </em>
    ),
    input: ({ type, checked, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
      if (type === 'checkbox') {
        return (
          <input
            type="checkbox"
            checked={checked}
            disabled
            className="mr-2 mt-1 h-4 w-4 rounded cursor-default"
            style={{
              accentColor: 'var(--accent)',
              borderColor: 'var(--border)',
            }}
            {...props}
          />
        );
      }
      return <input type={type} checked={checked} {...props} />;
    },
    // Highlight ==text== via rehype-raw <mark>
    mark: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <mark
        className="px-1 py-0.5 rounded-sm"
        style={{
          background: 'var(--accent-subtle, rgba(255, 213, 79, 0.3))',
          color: 'var(--text-primary)',
          borderBottom: '2px solid var(--accent)',
        }}
        {...props}
      >
        {children}
      </mark>
    ),
    // Superscript
    sup: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <sup
        className="text-[0.75em] leading-none"
        style={{ color: 'var(--accent)' }}
        {...props}
      >
        {children}
      </sup>
    ),
    // Subscript
    sub: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <sub
        className="text-[0.75em] leading-none"
        style={{ color: 'var(--accent)' }}
        {...props}
      >
        {children}
      </sub>
    ),
    // Footnote section (generated by remark-gfm)
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const dataFootnotes = (props as Record<string, unknown>)['data-footnotes'];
      if (dataFootnotes) {
        return (
          <section
            className="mt-12 pt-6"
            style={{
              borderTop: '2px solid var(--border)',
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
            }}
            {...props}
          >
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Footnotes
            </div>
            {children}
          </section>
        );
      }
      return <section {...props}>{children}</section>;
    },
    // Strikethrough
    del: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <del
        className="line-through"
        style={{
          color: 'var(--text-muted)',
          textDecorationColor: 'var(--text-muted)',
        }}
        {...props}
      >
        {children}
      </del>
    ),
    // Details/Summary (collapsible via rehype-raw)
    details: ({ children, ...props }: React.HTMLAttributes<HTMLDetailsElement>) => (
      <details
        className="my-4 rounded-lg overflow-hidden"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--blockquote-bg)',
        }}
        {...props}
      >
        {children}
      </details>
    ),
    summary: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <summary
        className="px-4 py-3 cursor-pointer font-medium select-none"
        style={{
          color: 'var(--text-primary)',
          background: 'var(--surface-elevated)',
        }}
        {...props}
      >
        {children}
      </summary>
    ),
  };
};

// Default export for backward compatibility (uses English translations)
export const markdownComponents: MarkdownComponents = createMarkdownComponents();
