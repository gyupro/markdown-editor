export const DEFAULT_MARKDOWN = `# Markdown Editor

**무료 온라인 마크다운 에디터**에 오신 것을 환영합니다.

## 기본 기능

### 문서함 & 저장
- **폴더 구조**: 문서를 깔끔하게 정리
- **자동저장**: 30초마다 자동 저장
- **Undo/Redo**: \`Ctrl+Z\` / \`Ctrl+Y\`

### 이미지 & 공유
- **드래그 앤 드롭** 이미지 업로드
- **클립보드 붙여넣기** (\`Ctrl+V\`)
- **공유 링크 & QR 코드** 생성

---

## 확장 마크다운 문법

### 수학 수식 (LaTeX)

인라인 수식: $E = mc^2$ 와 $\\sum_{i=1}^{n} x_i$

블록 수식:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}
$$

#### 헤딩 4단계

##### 헤딩 5단계

###### 헤딩 6단계

### 하이라이트

이 문장에서 ==중요한 부분==을 강조할 수 있습니다.

==하이라이트된 텍스트==는 눈에 띄게 표시됩니다.

### 위첨자 & 아래첨자

- 물의 화학식: H<sub>2</sub>O
- 이산화탄소: CO<sub>2</sub>
- 면적: 100m<sup>2</sup>
- 수학: x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup>

### 각주

마크다운 에디터는 다양한 문법을 지원합니다[^1]. 수학 수식도 렌더링할 수 있습니다[^2].

[^1]: GitHub Flavored Markdown 기반으로 확장된 문법을 지원합니다.
[^2]: KaTeX 라이브러리를 사용하여 LaTeX 수식을 렌더링합니다.

### 이모지

이모지 단축코드를 사용할 수 있습니다: :rocket: :heart: :star: :thumbsup: :fire:

:warning: 주의사항도 이모지로 표현 가능합니다 :memo:

### Mermaid 다이어그램

\`\`\`mermaid
graph TD
    A[마크다운 입력] --> B{파싱}
    B --> C[remark-gfm]
    B --> D[remark-math]
    B --> E[remark-emoji]
    C --> F[HTML 렌더링]
    D --> F
    E --> F
    F --> G[미리보기 출력]
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Editor
    participant Preview
    User->>Editor: 마크다운 입력
    Editor->>Preview: 실시간 변환
    Preview-->>User: 렌더링 결과 표시
\`\`\`

### 취소선 & 체크리스트

~~취소된 텍스트~~ 는 이렇게 표시됩니다.

- [x] 기본 마크다운 지원
- [x] GFM (테이블, 체크리스트)
- [x] 코드 구문 강조
- [x] 수학 수식 (LaTeX)
- [x] Mermaid 다이어그램
- [x] 이모지 단축코드
- [x] 하이라이트, 각주

### 접기/펼치기

<details>
<summary>클릭하여 상세 내용 보기</summary>

이 영역은 접고 펼칠 수 있습니다.

- 긴 코드 예시
- 부가 설명
- 참고 자료

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

</details>

### 코드 구문 강조

\`\`\`typescript
interface MarkdownPlugin {
  name: string;
  transform: (content: string) => string;
}

const plugins: MarkdownPlugin[] = [
  { name: 'math', transform: renderLatex },
  { name: 'emoji', transform: convertEmoji },
  { name: 'mermaid', transform: renderDiagram },
];
\`\`\`

---

## 단축키

| 기능 | 단축키 | 설명 |
|------|--------|------|
| 저장 | \`Ctrl+S\` | 문서함에 저장 |
| 굵게 | \`Ctrl+B\` | **굵은 텍스트** |
| 기울임 | \`Ctrl+I\` | *기울임 텍스트* |
| 링크 | \`Ctrl+K\` | [링크 삽입](url) |
| 실행 취소 | \`Ctrl+Z\` | 이전 상태로 |
| 다시 실행 | \`Ctrl+Y\` | 되돌린 작업 재실행 |
| PDF 출력 | \`Ctrl+P\` | PDF로 저장 |

---

> 이 에디터는 **오픈소스**입니다. 즐거운 마크다운 작성하세요!
`;

export const TABLE_TEMPLATE = `
| 열1 | 열2 | 열3 |
|-----|-----|-----|
| 내용1 | 내용2 | 내용3 |
| 내용4 | 내용5 | 내용6 |
`;

export const KEYBOARD_SHORTCUTS = {
  BOLD: 'b',
  ITALIC: 'i',
  LINK: 'k',
  PDF: 'p',
  ESCAPE: 'Escape',
} as const;
