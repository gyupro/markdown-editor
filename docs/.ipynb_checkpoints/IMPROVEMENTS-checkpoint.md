# 마크다운 에디터 개선점 분석

## 개요

현재 마크다운 에디터는 기본적인 기능이 잘 구현되어 있으나, 사용성과 안정성 측면에서 개선이 필요한 부분이 있습니다.

---

## 1. 핵심 기능 개선

### 1.1 Undo/Redo 기능 부재

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

### 1.2 로컬 저장 기능 부재

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

### 1.3 검색/치환 기능 부재

**현재 상태**: 긴 문서에서 특정 텍스트를 찾거나 치환할 수 없음

**개선 방안**:
- `Ctrl+F`: 검색 모달 열기
- `Ctrl+H`: 치환 모달 열기
- 정규식 검색 지원 (선택적)

**UI 제안**:
```
[검색어 입력] [이전] [다음] [닫기]
[치환어 입력] [치환] [모두 치환]
```

---

### 1.4 에디터-프리뷰 스크롤 동기화 부재

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

## 2. 코드 품질 개선

### 2.1 코드 하이라이팅 부재

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

### 2.2 PDF 출력 최적화 필요

**현재 상태**: `pdf.ts:1-733`

pdf.ts 파일이 733줄로 과도하게 비대하며, OKLCH 색상 변환 로직이 복잡함

**문제점**:
- 브라우저 호환성 이슈로 인한 과도한 색상 변환 코드
- 페이지 분할 로직이 불안정
- 번들 크기 증가

**개선 방안**:
1. Tailwind 색상을 RGB로 통일 (OKLCH 사용 자제)
2. PDF 생성 로직을 서버사이드로 이동 고려 (puppeteer 사용)
3. 파일 분리: `pdf-styles.ts`, `pdf-generator.ts`

---

### 2.3 컴포넌트 메모이제이션 불완전

**현재 상태**: 일부 컴포넌트만 `React.memo` 적용

**미적용 컴포넌트**:
- `Toolbar.tsx` - 매 렌더링 시 재생성
- `AIModal.tsx` - 불필요한 리렌더링 발생

**개선 방안**:
```typescript
// Toolbar.tsx
export const Toolbar = React.memo(ToolbarComponent);

// 핸들러 함수 메모이제이션
const toolbarHandlers = useMemo(() => ({
  onBold: () => insertFormatting('**', '**'),
  // ...
}), [insertFormatting]);
```

---

## 3. 접근성 및 UX 개선

### 3.1 키보드 탐색 개선 필요

**현재 상태**: `Toolbar.tsx:23-34`

툴바 버튼에 키보드 포커스 이동이 불편함

**개선 방안**:
- 화살표 키로 툴바 버튼 간 이동
- `Tab` 키로 그룹 간 이동
- `role="toolbar"` 및 `aria-orientation` 추가

```tsx
<nav
  role="toolbar"
  aria-label="편집 도구"
  aria-orientation="horizontal"
>
```

---

### 3.2 모바일 최적화 필요

**현재 상태**: `MobileTabs.tsx` 존재하나 터치 제스처 미지원

**개선 방안**:
- 스와이프로 에디터/프리뷰 전환
- 툴바 버튼 크기 증가 (최소 44x44px)
- 가상 키보드 표시 시 레이아웃 조정

---

### 3.3 줄 번호 표시 기능 부재

**현재 상태**: 에디터에 줄 번호가 없어 긴 문서 탐색이 어려움

**개선 방안**:
```tsx
<div className="flex">
  <div className="line-numbers select-none text-gray-400 pr-4">
    {markdown.split('\n').map((_, i) => (
      <div key={i}>{i + 1}</div>
    ))}
  </div>
  <textarea ... />
</div>
```

---

## 4. 에러 처리 및 안정성

### 4.1 AI 생성 에러 복구

**현재 상태**: `AIModal.tsx:88-93`

AI 생성 실패 시 상세한 에러 원인 표시 부족

**개선 방안**:
```typescript
const errorMessages: Record<string, string> = {
  'RATE_LIMIT': 'API 요청 한도 초과. 잠시 후 재시도하세요.',
  'CONTENT_FILTER': '생성된 콘텐츠가 정책에 위반됩니다.',
  'NETWORK_ERROR': '네트워크 연결을 확인해주세요.',
  'TIMEOUT': '요청 시간이 초과되었습니다.',
};
```

---

### 4.2 공유 링크 만료 처리

**현재 상태**: `useDocumentShare.ts`에서 문서 만료 개념 없음

**개선 방안**:
- 문서에 `expires_at` 필드 추가
- 만료된 문서 접근 시 안내 메시지 표시
- 선택적 만료 시간 설정 UI 추가

---

## 5. 성능 최적화

### 5.1 대용량 문서 처리

**현재 상태**: 10,000줄 이상 문서 편집 시 렌더링 지연 발생

**개선 방안**:
- 가상화된 텍스트 영역 사용 (`react-virtualized`)
- 마크다운 파싱 Web Worker로 이동
- 프리뷰 렌더링 디바운스 적용

```typescript
const debouncedMarkdown = useDebounce(markdown, 150);

// 프리뷰는 디바운스된 값 사용
<ReactMarkdown>{debouncedMarkdown}</ReactMarkdown>
```

---

### 5.2 번들 크기 최적화

**현재 상태**: html2pdf.js가 전체 번들에 포함

**개선 방안**:
- PDF 내보내기 시에만 동적 임포트 (이미 적용됨, 유지)
- `react-markdown` 코드 스플리팅 고려
- 사용하지 않는 remark 플러그인 제거

---

## 우선순위 정리

| 순위 | 개선 항목 | 난이도 | 영향도 |
|------|----------|--------|--------|
| 1 | 로컬 저장 기능 | 낮음 | 높음 |
| 2 | Undo/Redo | 중간 | 높음 |
| 3 | 스크롤 동기화 | 중간 | 중간 |
| 4 | 코드 하이라이팅 | 낮음 | 중간 |
| 5 | 검색/치환 | 중간 | 중간 |
| 6 | 줄 번호 표시 | 낮음 | 낮음 |
| 7 | 대용량 문서 최적화 | 높음 | 낮음 |
| 8 | PDF 최적화 | 높음 | 낮음 |

---

## 결론

가장 시급한 개선 사항은 **로컬 저장**과 **Undo/Redo** 기능입니다. 이 두 기능은 사용자 데이터 보호와 직결되며, 구현 난이도 대비 효과가 높습니다.

그 다음으로 **스크롤 동기화**와 **코드 하이라이팅**을 통해 편집 경험을 개선하면 경쟁력 있는 에디터가 될 수 있습니다.
