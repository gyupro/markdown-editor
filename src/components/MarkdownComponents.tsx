import React from 'react';
import { MarkdownComponents } from '@/types/markdown';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

// 텍스트를 URL 친화적인 ID로 변환하는 함수
const createSlug = (text: string): string => {
  let slug = text
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
}> = ({ level, children, props }) => {
  const text = extractText(children);
  const id = createSlug(text);
  
  const handleAnchorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // URL 해시 업데이트
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const baseStyles = "group relative scroll-mt-20"; // scroll-mt-20은 고정 헤더를 위한 오프셋
  
  if (level === 1) {
    return (
      <h1 id={id} className={`text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white pb-2 md:pb-3 leading-tight ${baseStyles}`} {...props}>
        {children}
        <a 
          href={`#${id}`}
          onClick={handleAnchorClick}
          className="ml-2 opacity-0 group-hover:opacity-50 hover:!opacity-100 text-blue-500 hover:text-blue-600 transition-opacity duration-200 text-xl"
          aria-label={`${text} 섹션으로 이동`}
          title="링크 복사"
        >
          #
        </a>
      </h1>
    );
  } else if (level === 2) {
    return (
      <h2 id={id} className={`text-xl md:text-3xl font-semibold mb-3 md:mb-4 mt-6 md:mt-8 text-gray-800 dark:text-gray-100 flex items-center leading-tight ${baseStyles}`} {...props}>
        <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-blue-500 to-purple-500 mr-2 md:mr-3 rounded-full"></span>
        {children}
        <a 
          href={`#${id}`}
          onClick={handleAnchorClick}
          className="ml-2 opacity-0 group-hover:opacity-50 hover:!opacity-100 text-blue-500 hover:text-blue-600 transition-opacity duration-200 text-lg"
          aria-label={`${text} 섹션으로 이동`}
          title="링크 복사"
        >
          #
        </a>
      </h2>
    );
  } else {
    return (
      <h3 id={id} className={`text-lg md:text-2xl font-semibold mb-2 md:mb-3 mt-4 md:mt-6 text-gray-800 dark:text-gray-100 leading-tight ${baseStyles}`} {...props}>
        {children}
        <a 
          href={`#${id}`}
          onClick={handleAnchorClick}
          className="ml-2 opacity-0 group-hover:opacity-50 hover:!opacity-100 text-blue-500 hover:text-blue-600 transition-opacity duration-200 text-base"
          aria-label={`${text} 섹션으로 이동`}
          title="링크 복사"
        >
          #
        </a>
      </h3>
    );
  }
};

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children: codeElementAsNode }) => {
  let actualCodeText = '';

  // Case 1: The node itself is a string (e.g., text directly inside <pre>)
  if (typeof codeElementAsNode === 'string') {
    actualCodeText = codeElementAsNode;
  }
  // Case 2: The node is a React element (e.g., <pre><code>text</code></pre>, codeElementAsNode is the <code>)
  else if (React.isValidElement(codeElementAsNode)) {
    // codeElementAsNode.props가 존재하고 객체인지 확인 (children에 접근하기 전)
    const elementProps = codeElementAsNode.props as { children?: React.ReactNode };

    if (typeof elementProps.children === 'string') {
      // children of <code> is a string: <code>"text"</code>
      actualCodeText = elementProps.children;
    } else if (Array.isArray(elementProps.children)) {
      // children of <code> is an array: <code>{["text", <span/>, "more text"]}</code>
      actualCodeText = elementProps.children
        .map((childNode: React.ReactNode): string => { // Explicitly type childNode and return type
          if (typeof childNode === 'string') {
            return childNode;
          }
          if (React.isValidElement(childNode)) {
            // childNode.props가 존재하고 객체인지 확인
            const childElementProps = childNode.props as { children?: React.ReactNode };
            if (typeof childElementProps.children === 'string') {
              return childElementProps.children; // Text inside a child element like <span>text</span>
            }
          }
          return ''; // Non-string or non-extractable children become empty strings
        })
        .join('');
    } else if (React.isValidElement(elementProps.children)) {
      // children of <code> is another single React element: <code><span>text</span></code>
      const innerElement = elementProps.children;
      // innerElement.props가 존재하고 객체인지 확인
      const innerElementProps = innerElement.props as { children?: React.ReactNode };
      if (typeof innerElementProps.children === 'string') {
        actualCodeText = innerElementProps.children;
      }
    }
  }

  const { isCopied, copyToClipboard } = useCopyToClipboard();
  
  const handleCopy = async () => {
    await copyToClipboard(actualCodeText);
  };

  return (
    <div className="relative group">
      <pre className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-gray-100 p-4 md:p-6 rounded-xl shadow-lg my-4 md:my-6 overflow-x-auto text-sm md:text-base max-w-full">
        <code className="leading-normal whitespace-pre-wrap break-words block">
          {actualCodeText}
        </code>
      </pre>
      
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 bg-gray-700/90 hover:bg-gray-600 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
        title={isCopied ? '복사됨!' : '코드 복사'}
        aria-label={isCopied ? '코드가 클립보드에 복사되었습니다' : '코드를 클립보드에 복사'}
      >
        {isCopied ? '✅' : '📋'}
      </button>
    </div>
  );
};

export const markdownComponents: MarkdownComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <HeadingWithAnchor level={1} props={props}>
      {children}
    </HeadingWithAnchor>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <HeadingWithAnchor level={2} props={props}>
      {children}
    </HeadingWithAnchor>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <HeadingWithAnchor level={3} props={props}>
      {children}
    </HeadingWithAnchor>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 md:mb-4 text-base md:text-lg" {...props}>
      {children}
    </p>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 pl-4 md:pl-6 py-3 md:py-4 my-4 md:my-6 rounded-r-lg shadow-sm" {...props}>
      <div className="text-gray-700 dark:text-gray-300 italic text-sm md:text-base">
        {children}
      </div>
    </blockquote>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-700 dark:text-pink-300 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md font-mono text-xs md:text-sm border border-pink-200 dark:border-pink-700" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock {...props}>
      {children}
    </CodeBlock>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a 
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-500 transition-all duration-200 font-medium touch-manipulation"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="space-y-1.5 md:space-y-2 mb-4 md:mb-6 ml-4 md:ml-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="space-y-1.5 md:space-y-2 mb-4 md:mb-6 ml-4 md:ml-6" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start text-sm md:text-base" {...props}>
      <span className="text-blue-500 mr-2 mt-1 text-xs md:text-sm">•</span>
      <span>{children}</span>
    </li>
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-6 md:my-8 border-0 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-full opacity-60" {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-4 md:my-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 -mx-0 md:mx-0">
      <table className="w-full text-sm md:text-base" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-gray-800 dark:bg-gray-900" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800" {...props}>
      {children}
    </tbody>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-bold text-white bg-gray-800 dark:bg-gray-900 tracking-wider border-r border-gray-600 last:border-r-0 min-w-0 whitespace-nowrap" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-2 md:px-4 py-2 md:py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 min-w-0" {...props}>
      <div className="leading-relaxed">
        {children}
      </div>
    </td>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700" {...props}>
      {children}
    </tr>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-blue-600 dark:text-blue-400" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-purple-600 dark:text-purple-400" {...props}>
      {children}
    </em>
  ),
}; 