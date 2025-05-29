'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function HomePage() {
  const [markdown, setMarkdown] = useState(
    `# 📝 Markdown Editor

안녕하세요! 이것은 **강력한 마크다운 에디터**입니다.

## ✨ 주요 기능

- 🎨 **아름다운 미리보기**: 세련된 디자인으로 문서를 확인하세요
- ⚡ **실시간 렌더링**: 타이핑과 동시에 결과를 확인
- 🔧 **강력한 툴바**: 클릭 한 번으로 포맷팅 적용
- 🖥️ **전체화면 모드**: 집중해서 작업하고 미리보기
- 📄 **PDF 출력**: 문서를 PDF로 저장하세요

## 📊 테이블 예시

| 기능 | 상태 | 설명 |
|------|------|------|
| 실시간 미리보기 | ✅ 완료 | 타이핑과 동시에 렌더링 |
| 키보드 단축키 | ✅ 완료 | Ctrl+B, Ctrl+I, Ctrl+K |
| 전체화면 모드 | ✅ 완료 | ESC로 종료 가능 |
| 테이블 지원 | ✅ 완료 | GitHub Flavored Markdown |
| PDF 출력 | ✅ 완료 | 고품질 PDF 생성 |

## 💻 코드 예시

\`\`\`javascript
// JavaScript 예시
function greet(name) {
  console.log(\`안녕하세요, \${name}님!\`);
  return \`환영합니다! 🎉\`;
}

greet("개발자");
\`\`\`

\`\`\`python
# Python 예시
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(f"피보나치 수열: {[fibonacci(i) for i in range(10)]}")
\`\`\`

## 📝 텍스트 스타일링

**굵은 글씨**로 중요한 내용을 강조하고, *기울임꼴*로 부가 설명을 추가하며, ~~취소선~~으로 수정된 내용을 표시할 수 있습니다.

\`인라인 코드\`도 물론 지원됩니다!

## 💬 인용구

> "프로그래밍은 생각을 코드로 표현하는 예술이다."
> 
> 훌륭한 개발자는 복잡한 문제를 단순하게 해결한다. 💭

> **💡 팁**: 마크다운을 사용하면 문서 작성이 훨씬 쉬워집니다!

## 🔗 링크

- [GitHub](https://github.com) - 세계 최대의 코드 저장소
- [MDN Web Docs](https://developer.mozilla.org) - 웹 개발 문서
- [Stack Overflow](https://stackoverflow.com) - 개발자 Q&A

---

### 즐거운 마크다운 작성하세요! 🚀
`
  );

  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // PDF 출력 함수
  const exportToPDF = async () => {
    if (!isClient || !previewRef.current) return;
    
    setIsExporting(true);
    
    try {
      // html2pdf 동적 임포트
      const html2pdf = (await import('html2pdf.js')).default;
      
      // PDF 옵션 설정
      const options = {
        margin: [0.2, 0.5, 0.5, 0.5],
        filename: 'markdown-document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      // 프리뷰 내용을 그대로 복제 (beautifulComponents 스타일 유지)
      const element = previewRef.current.cloneNode(true) as HTMLElement;
      
      // 프리뷰와 동일한 Tailwind 스타일을 PDF에서도 사용할 수 있도록 CSS 추가
      const addTailwindCSS = (element: HTMLElement) => {
        const style = document.createElement('style');
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* 프리뷰와 동일한 Tailwind 스타일 */
          .text-4xl { font-size: 2.25rem !important; }
          .text-3xl { font-size: 1.875rem !important; }
          .text-2xl { font-size: 1.5rem !important; }
          .text-lg { font-size: 1.125rem !important; }
          .text-sm { font-size: 0.875rem !important; }
          
          .font-bold { font-weight: 700 !important; }
          .font-semibold { font-weight: 600 !important; }
          
          .mb-6 { margin-bottom: 1.5rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .mb-3 { margin-bottom: 0.75rem !important; }
          .mt-8 { margin-top: 2rem !important; }
          .mt-6 { margin-top: 1.5rem !important; }
          .my-6 { margin-top: 1.5rem !important; margin-bottom: 1.5rem !important; }
          .pb-3 { padding-bottom: 0.75rem !important; }
          .pl-6 { padding-left: 1.5rem !important; }
          .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
          .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
          .px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .p-6 { padding: 1.5rem !important; }
          
          .text-gray-900 { color: #111827 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-300 { color: #d1d5db !important; }
          .text-white { color: #ffffff !important; }
          .text-pink-700 { color: #be185d !important; }
          .text-purple-600 { color: #9333ea !important; }
          .text-blue-600 { color: #2563eb !important; }
          
          .leading-relaxed { line-height: 1.625 !important; }
          .leading-relaxed { line-height: 1.5 !important; }
          
          .flex { display: flex !important; }
          .items-center { align-items: center !important; }
          .items-start { align-items: flex-start !important; }
          
          /* 그라디언트 바 (h2용) */
          .w-1 { width: 0.25rem !important; }
          .h-8 { height: 2rem !important; }
          .bg-gradient-to-b { background: linear-gradient(to bottom, #3b82f6, #8b5cf6) !important; }
          .mr-3 { margin-right: 0.75rem !important; }
          .mr-2 { margin-right: 0.5rem !important; }
          .mt-1 { margin-top: 0.25rem !important; }
          .ml-6 { margin-left: 1.5rem !important; }
          .rounded-full { border-radius: 9999px !important; }
          .rounded-md { border-radius: 0.375rem !important; }
          .rounded-r-lg { border-radius: 0 0.5rem 0.5rem 0 !important; }
          .rounded-xl { border-radius: 0.75rem !important; }
          
          /* 배경색 */
          .bg-gradient-to-r { background: linear-gradient(to right, #dbeafe, #faf5ff) !important; }
          .bg-gradient-to-br { background: linear-gradient(to bottom right, #1f2937, #111827) !important; }
          .bg-white { background-color: #ffffff !important; }
          .bg-gray-800 { background-color: #1f2937 !important; }
          .bg-gray-900 { background-color: #111827 !important; }
          
          /* 테두리 */
          .border-l-4 { border-left: 4px solid !important; }
          .border-blue-500 { border-color: #3b82f6 !important; }
          .border { border: 1px solid !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          .border-gray-700 { border-color: #374151 !important; }
          .border-pink-200 { border-color: #fbcfe8 !important; }
          
          /* 그림자 */
          .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
          .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
          
          /* 기타 스타일 */
          .italic { font-style: italic !important; }
          .font-mono { font-family: 'Monaco', 'Consolas', 'Courier New', monospace !important; }
          .underline { text-decoration: underline !important; }
          .space-y-2 > * + * { margin-top: 0.5rem !important; }
          .min-w-full { min-width: 100% !important; }
          .overflow-x-auto { overflow-x: auto !important; }
          .whitespace-nowrap { white-space: nowrap !important; }
          .uppercase { text-transform: uppercase !important; }
          .tracking-wider { letter-spacing: 0.05em !important; }
          .divide-y > * + * { border-top: 1px solid #e5e7eb !important; }
          .text-left { text-align: left !important; }
          .font-medium { font-weight: 500 !important; }
          .border-collapse { border-collapse: collapse !important; }
          .border-r { border-right: 1px solid #374151 !important; }
          .last\\:border-r-0:last-child { border-right: none !important; }
          
          /* 특별한 경우들 */
          .max-w-none { max-width: none !important; }
          
          /* 첫 번째 요소 마진 제거 */
          h1:first-child, h2:first-child, h3:first-child, p:first-child {
            margin-top: 0 !important;
          }
          
          /* 코드 블록 - 프리뷰와 동일한 어두운 테마 유지 */
          pre {
            background-color: #1f2937 !important;
            color: #f9fafb !important;
            padding: 1.5rem !important;
            border-radius: 0.5rem !important;
            overflow-x: auto !important;
            margin: 1.5rem 0 !important;
            font-family: 'Monaco', 'Consolas', 'Courier New', monospace !important;
            font-size: 0.875rem !important;
            line-height: 1.5 !important;
          }
          
          pre code {
            background-color: transparent !important;
            color: inherit !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
          }
          
          /* 테이블 스타일 */
          table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 1rem 0 !important;
          }
          
          th {
            background-color: #1f2937 !important;
            color: white !important;
            padding: 0.75rem 1.5rem !important;
            text-align: left !important;
            font-weight: bold !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            border-right: 1px solid #374151 !important;
            font-size: 0.875rem !important;
          }
          
          th:last-child {
            border-right: none !important;
          }
          
          td {
            padding: 1rem 1.5rem !important;
            font-size: 1rem !important;
            font-weight: 500 !important;
            color: #1f2937 !important;
            white-space: nowrap !important;
          }
          
          tr {
            background-color: #ffffff !important;
            border-bottom: 1px solid #e5e7eb !important;
          }
          
          tbody tr:nth-child(even) {
            background-color: #f9fafb !important;
          }
          
          /* 리스트 스타일 - bullet 포인트 개선 */
          ul {
            margin: 1rem 0 !important;
            margin-left: 1.5rem !important;
          }
          
          ol {
            margin: 1rem 0 !important;
            margin-left: 1.5rem !important;
          }
          
          li {
            margin: 0.5rem 0 !important;
            color: #374151 !important;
            line-height: 1.625 !important;
            display: flex !important;
            align-items: flex-start !important;
          }
          
          li span:first-child {
            color: #3b82f6 !important;
            margin-right: 0.5rem !important;
            margin-top: 0.25rem !important;
          }
          
          /* HR 스타일 */
          hr {
            border: none !important;
            height: 0.25rem !important;
            background: linear-gradient(to right, #93c5fd, #c4b5fd, #f9a8d4) !important;
            border-radius: 9999px !important;
            opacity: 0.6 !important;
            margin: 2rem 0 !important;
          }
          
          /* strong, em 스타일 */
          strong {
            font-weight: bold !important;
            color: #2563eb !important;
          }
          
          em {
            font-style: italic !important;
            color: #9333ea !important;
          }
          
          /* 링크 스타일 */
          a {
            color: #2563eb !important;
            text-decoration: underline !important;
            font-weight: 500 !important;
          }
        `;
        element.appendChild(style);
      };
      
      // 스타일 적용
      addTailwindCSS(element);

      // PDF 생성
      await html2pdf().set(options).from(element).save();
      
    } catch (error) {
      console.error('PDF 출력 중 오류가 발생했습니다:', error);
      alert('PDF 출력 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsExporting(false);
    }
  };

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            insertFormatting('**', '**');
            break;
          case 'i':
            e.preventDefault();
            insertFormatting('*', '*');
            break;
          case 'k':
            e.preventDefault();
            insertFormatting('[', '](url)');
            break;
          case 'p':
            e.preventDefault();
            exportToPDF();
            break;
        }
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // 텍스트 포맷팅 함수
  const insertFormatting = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
    setMarkdown(newText);

    // 커서 위치 설정
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, end + before.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
    }, 0);
  }, [markdown]);

  // 툴바 버튼 액션들
  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertAtCursor(prefix);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = markdown.substring(0, start) + text + markdown.substring(start);
    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const insertTable = () => {
    const tableText = `
| 열1 | 열2 | 열3 |
|-----|-----|-----|
| 내용1 | 내용2 | 내용3 |
| 내용4 | 내용5 | 내용6 |
`;
    insertAtCursor(tableText);
  };

  const ToolbarButton = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      title={title}
      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
    >
      {children}
    </button>
  );

  // 더 아름다운 커스텀 컴포넌트들
  const beautifulComponents = {
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white pb-3" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-3xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-100 flex items-center" {...props}>
        <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 mr-3 rounded-full"></span>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-2xl font-semibold mb-3 mt-6 text-gray-800 dark:text-gray-100" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-lg" {...props}>
        {children}
      </p>
    ),
    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 pl-6 py-4 my-6 rounded-r-lg shadow-sm" {...props}>
        <div className="text-gray-700 dark:text-gray-300 italic">
          {children}
        </div>
      </blockquote>
    ),
    code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-700 dark:text-pink-300 px-2 py-1 rounded-md font-mono text-sm border border-pink-200 dark:border-pink-700" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
      <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 rounded-xl shadow-lg my-6 overflow-x-auto border border-gray-700" {...props}>
        <code className="text-sm leading-relaxed">
          {children}
        </code>
      </pre>
    ),
    a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a 
        href={href}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-500 transition-all duration-200 font-medium"
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="space-y-2 mb-6 ml-6" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="space-y-2 mb-6 ml-6" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start" {...props}>
        <span className="text-blue-500 mr-2 mt-1">•</span>
        <span>{children}</span>
      </li>
    ),
    hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
      <hr className="my-8 border-0 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-full opacity-60" {...props} />
    ),
    table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto my-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="min-w-full" {...props}>
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
      <th className="px-6 py-4 text-left text-sm font-bold text-white bg-gray-800 dark:bg-gray-900 uppercase tracking-wider border-r border-gray-600 last:border-r-0" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td className="px-6 py-4 text-base font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap" {...props}>
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

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Markdown Editor</h1>
            <a 
              href="https://github.com/gyupro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm flex items-center gap-1"
              title="GitHub Repository"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Open Source
            </a>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  PDF 생성 중...
                </>
              ) : (
                <>
                  📄 PDF 출력
                </>
              )}
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🖥️ 전체화면 미리보기
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">📝 EDITOR</h2>
          </div>
          
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center gap-1 flex-wrap">
            <ToolbarButton onClick={() => insertHeading(1)} title="헤딩 1">
              <span className="font-bold text-lg">H1</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => insertHeading(2)} title="헤딩 2">
              <span className="font-bold">H2</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => insertHeading(3)} title="헤딩 3">
              <span className="font-bold text-sm">H3</span>
            </ToolbarButton>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <ToolbarButton onClick={() => insertFormatting('**', '**')} title="굵게 (Ctrl+B)">
              <span className="font-bold">B</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => insertFormatting('*', '*')} title="기울임 (Ctrl+I)">
              <span className="italic">I</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => insertFormatting('~~', '~~')} title="취소선">
              <span className="line-through">S</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => insertFormatting('`', '`')} title="인라인 코드">
              <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">code</span>
            </ToolbarButton>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <ToolbarButton onClick={() => insertFormatting('[', '](url)')} title="링크 (Ctrl+K)">
              🔗
            </ToolbarButton>
            <ToolbarButton onClick={() => insertFormatting('![alt](', ')')} title="이미지">
              🖼️
            </ToolbarButton>
            <ToolbarButton onClick={() => insertAtCursor('- ')} title="불릿 리스트">
              • 
            </ToolbarButton>
            <ToolbarButton onClick={() => insertAtCursor('1. ')} title="번호 리스트">
              1.
            </ToolbarButton>
            <ToolbarButton onClick={() => insertFormatting('> ', '')} title="인용구">
              💬
            </ToolbarButton>
            <ToolbarButton onClick={insertTable} title="테이블">
              📊
            </ToolbarButton>
            <ToolbarButton onClick={() => insertAtCursor('```\n\n```')} title="코드 블록">
              📝
            </ToolbarButton>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <ToolbarButton onClick={exportToPDF} title="PDF 출력 (Ctrl+P)">
              📄
            </ToolbarButton>
          </div>

          <textarea
            ref={textareaRef}
            className="flex-1 w-full p-4 text-sm font-mono leading-6 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 resize-none focus:outline-none border-none"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Enter your markdown here..."
            spellCheck={false}
          />
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">✨ PREVIEW</h2>
          </div>
          <div className="flex-1 overflow-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            {isClient ? (
              <div ref={previewRef} className="p-6 max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={beautifulComponents}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="p-4 text-gray-500 dark:text-gray-400">Loading preview...</div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex flex-col h-full">
            <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold text-gray-800 dark:text-white">🖥️ 전체화면 미리보기</h1>
                  <a 
                    href="https://github.com/gyupro" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm flex items-center gap-1"
                    title="GitHub Repository"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    Open Source
                  </a>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={exportToPDF}
                    disabled={isExporting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors shadow-md hover:shadow-lg"
                  >
                    {isExporting ? '📄 PDF 생성 중...' : '📄 PDF 출력'}
                  </button>
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    ✕ 닫기 (ESC)
                  </button>
                </div>
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              {isClient ? (
                <div className="max-w-4xl mx-auto p-8">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={beautifulComponents}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">Loading preview...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
