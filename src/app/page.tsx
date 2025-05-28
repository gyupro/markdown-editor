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

## 📊 테이블 예시

| 기능 | 상태 | 설명 |
|------|------|------|
| 실시간 미리보기 | ✅ 완료 | 타이핑과 동시에 렌더링 |
| 키보드 단축키 | ✅ 완료 | Ctrl+B, Ctrl+I, Ctrl+K |
| 전체화면 모드 | ✅ 완료 | ESC로 종료 가능 |
| 테이블 지원 | ✅ 완료 | GitHub Flavored Markdown |

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

## 📖 인용구

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white border-b-4 border-gradient-to-r from-blue-500 to-purple-500 pb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" {...props}>
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
      <thead className="bg-gradient-to-r from-blue-500 to-purple-600" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props}>
        {children}
      </tbody>
    ),
    th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap" {...props}>
        {children}
      </td>
    ),
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150" {...props}>
        {children}
      </tr>
    ),
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className="font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" {...props}>
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
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Markdown Editor</h1>
          <button
            onClick={() => setIsFullscreen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            🖥️ 전체화면 미리보기
          </button>
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
              <div className="p-6 max-w-none">
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
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">🖥️ 전체화면 미리보기</h1>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                >
                  ✕ 닫기 (ESC)
                </button>
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
