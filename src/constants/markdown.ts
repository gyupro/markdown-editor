export const DEFAULT_MARKDOWN = `# 📝 Markdown Editor

안녕하세요! 이것은 **강력한 마크다운 에디터**입니다.

## ✨ 주요 기능

- 🎨 **아름다운 미리보기**: 세련된 디자인으로 문서를 확인하세요
- ⚡ **실시간 렌더링**: 타이핑과 동시에 결과를 확인
- 🔧 **강력한 툴바**: 클릭 한 번으로 포맷팅 적용
- 🖥️ **전체화면 모드**: 집중해서 작업하고 미리보기
- 📄 **PDF 출력**: 문서를 PDF로 저장하세요
- 📋 **복사 기능**: 마크다운 텍스트와 코드를 쉽게 복사

## 📊 테이블 예시

| 기능 | 상태 | 설명 |
|------|------|------|
| 실시간 미리보기 | ✅ 완료 | 타이핑과 동시에 렌더링 |
| 키보드 단축키 | ✅ 완료 | Ctrl+B, Ctrl+I, Ctrl+K |
| 전체화면 모드 | ✅ 완료 | ESC로 종료 가능 |
| 테이블 지원 | ✅ 완료 | GitHub Flavored Markdown |
| PDF 출력 | ✅ 완료 | 고품질 PDF 생성 |
| 복사 기능 | ✅ 완료 | 마크다운 및 코드 복사 |

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