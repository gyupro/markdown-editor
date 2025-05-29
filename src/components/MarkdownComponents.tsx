import React from 'react';
import { MarkdownComponents } from '@/types/markdown';

export const markdownComponents: MarkdownComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white pb-2 md:pb-3 leading-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl md:text-3xl font-semibold mb-3 md:mb-4 mt-6 md:mt-8 text-gray-800 dark:text-gray-100 flex items-center leading-tight" {...props}>
      <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-blue-500 to-purple-500 mr-2 md:mr-3 rounded-full"></span>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-3 mt-4 md:mt-6 text-gray-800 dark:text-gray-100 leading-tight" {...props}>
      {children}
    </h3>
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
    <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-3 md:p-6 rounded-xl shadow-lg my-4 md:my-6 overflow-x-auto border border-gray-700 text-xs md:text-sm max-w-full" {...props}>
      <code className="leading-relaxed break-words">
        {children}
      </code>
    </pre>
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
    <div className="overflow-x-auto my-4 md:my-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <table className="min-w-full text-xs md:text-base" {...props}>
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
    <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs md:text-sm font-bold text-white bg-gray-800 dark:bg-gray-900 uppercase tracking-wider border-r border-gray-600 last:border-r-0" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-3 md:px-6 py-2 md:py-4 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 break-words" {...props}>
      {children}
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