# 마크다운 에디터 개선점 분석

## 개요

현재 마크다운 에디터는 기본적인 기능이 잘 구현되어 있으나, 사용성과 안정성 측면에서 개선이 필요한 부분이 있습니다.

---

## 1. 로컬 저장 기능 부재

**현재 상태**: 페이지 새로고침 시 작성 중인 문서가 유실됨

**문제점**:
- 브라우저 충돌/새로고침 시 작업 내용 손실
- 사용자가 직접 복사해서 저장해야 함

**개선 방안**:
```typescript
// useLocalStorage.ts 훅 생성
const STORAGE_KEY = 'markdown-editor-draft';

const useLocalStorage = (key: string, initialValue: string) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    const saved = localStorage.getItem(key);
    return saved ?? initialValue;
  });

  useEffect(() => {
    const debounced = debounce(() => {
      localStorage.setItem(key, value);
    }, 1000);
    debounced();
    return () => debounced.cancel();
  }, [key, value]);

  return [value, setValue] as const;
};
```

**자동 저장 주기**: 1초 디바운스

---

## 2. Undo/Redo 기능 부재

**현재 상태**: 텍스트 편집 시 실행 취소/다시 실행 기능이 없음

**문제점**:
- 실수로 텍스트 삭제 시 복구 불가
- 브라우저 기본 Undo가 `setMarkdown` 호출 시 제대로 작동하지 않음

**개선 방안**:
```typescript
// useMarkdownEditor.ts에 히스토리 관리 추가
const [history, setHistory] = useState<string[]>([initialMarkdown]);
const [historyIndex, setHistoryIndex] = useState(0);

const undo = useCallback(() => {
  if (historyIndex > 0) {
    setHistoryIndex(prev => prev - 1);
    setMarkdown(history[historyIndex - 1]);
  }
}, [history, historyIndex]);

const redo = useCallback(() => {
  if (historyIndex < history.length - 1) {
    setHistoryIndex(prev => prev + 1);
    setMarkdown(history[historyIndex + 1]);
  }
}, [history, historyIndex]);
```

**단축키**: `Ctrl+Z` (Undo), `Ctrl+Y` (Redo)

---

## 3. 에디터-프리뷰 스크롤 동기화 부재

**현재 상태**: `EditorSection.tsx:48`, `PreviewSection.tsx:44`

에디터와 프리뷰가 독립적으로 스크롤되어 현재 편집 위치와 프리뷰가 일치하지 않음

**개선 방안**:
```typescript
// useScrollSync.ts
const useScrollSync = (
  editorRef: RefObject<HTMLTextAreaElement>,
  previewRef: RefObject<HTMLDivElement>
) => {
  const syncScroll = useCallback((source: 'editor' | 'preview') => {
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    const sourceEl = source === 'editor' ? editor : preview;
    const targetEl = source === 'editor' ? preview : editor;

    const scrollPercent = sourceEl.scrollTop /
      (sourceEl.scrollHeight - sourceEl.clientHeight);

    targetEl.scrollTop = scrollPercent *
      (targetEl.scrollHeight - targetEl.clientHeight);
  }, []);

  return { syncScroll };
};
```

---

## 4. 코드 하이라이팅 부재

**현재 상태**: `MarkdownComponents.tsx:104-171`

코드 블록이 단색으로 표시되어 가독성이 떨어짐

**개선 방안**:
- `prism-react-renderer` 또는 `rehype-highlight` 라이브러리 추가
- 언어별 구문 강조 적용

```typescript
// MarkdownComponents.tsx 수정
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock: React.FC<Props> = ({ language, children }) => (
  <SyntaxHighlighter language={language} style={vscDarkPlus}>
    {children}
  </SyntaxHighlighter>
);
```

---

## 우선순위 정리

| 순위 | 개선 항목 | 난이도 | 영향도 |
|------|----------|--------|--------|
| 1 | 로컬 저장 기능 | 낮음 | 높음 |
| 2 | Undo/Redo | 중간 | 높음 |
| 3 | 스크롤 동기화 | 중간 | 중간 |
| 4 | 코드 하이라이팅 | 낮음 | 중간 |
