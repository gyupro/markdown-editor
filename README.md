# 📝 **FREE** Markdown Editor

> **🆓 100% FREE & Open Source** - A powerful, feature-rich markdown editor built with Next.js

[한국어](#한국어) | [English](#english)

---

## English

### 🚀 **FREE** Features

✨ **Completely FREE** - No subscriptions, no limitations, no hidden costs!

- 🎨 **Beautiful Live Preview** - Real-time markdown rendering with elegant styling
- ⚡ **Instant Rendering** - See your changes as you type
- 🔧 **Powerful Toolbar** - One-click formatting with intuitive buttons
- 🖥️ **Fullscreen Mode** - Distraction-free writing and preview
- 📄 **PDF Export** - High-quality PDF generation with professional formatting
- ⌨️ **Keyboard Shortcuts** - Speed up your workflow
- 📊 **Table Support** - GitHub Flavored Markdown tables
- 🎯 **Code Highlighting** - Syntax highlighting for multiple languages
- 💬 **Rich Elements** - Blockquotes, lists, links, images, and more

### 🛠️ Tech Stack

- **Next.js 15.3.2** with Turbopack
- **React 19** for modern UI
- **TypeScript** for type safety
- **Tailwind CSS 4** for beautiful styling
- **React Markdown** with GitHub Flavored Markdown
- **html2pdf.js** for PDF generation

### 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | **Bold** text |
| `Ctrl/Cmd + I` | *Italic* text |
| `Ctrl/Cmd + K` | Insert link |
| `Ctrl/Cmd + P` | Export to PDF |
| `ESC` | Exit fullscreen mode |

### 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main editor page (refactored)
│   │   ├── layout.tsx            # App layout
│   │   ├── globals.css           # Global styles
│   │   ├── sitemap.ts           # SEO sitemap
│   │   └── favicon.ico          # App icon
│   ├── components/
│   │   ├── MarkdownComponents.tsx # Custom markdown renderers
│   │   └── Toolbar.tsx           # Editor toolbar component
│   ├── hooks/
│   │   └── useMarkdownEditor.ts  # Custom hook for editor logic
│   ├── utils/
│   │   └── pdf.ts               # PDF generation utilities
│   ├── constants/
│   │   └── markdown.ts          # App constants and defaults
│   └── types/
│       └── markdown.ts          # TypeScript type definitions
├── public/                      # Static assets
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── package.json                # Dependencies
```

### 🏗️ Architecture Highlights

#### **Clean Code Structure**
- **Modular Design**: 793-line monolith → 7 focused modules
- **Single Responsibility**: Each file has a specific purpose
- **Type Safety**: Comprehensive TypeScript definitions
- **Reusable Components**: Modular UI components

#### **Component Structure**
- `useMarkdownEditor` - Custom hook managing all editor state and logic
- `MarkdownComponents` - Beautiful custom renderers for markdown elements
- `Toolbar` - Intuitive editing toolbar with all formatting options
- `pdf.ts` - Dedicated PDF generation with custom styling

#### **Performance Features**
- **Code Splitting**: Automatic bundle optimization
- **Dynamic Imports**: PDF library loaded only when needed
- **Efficient Re-renders**: Optimized React hooks and callbacks
- **Memory Management**: Proper cleanup and event handling

### 🎯 Key Features Implementation

- **Real-time Preview**: Custom React hooks with optimized state management
- **PDF Generation**: Advanced CSS injection for pixel-perfect PDF output
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Dark/Light Theme**: Seamless theme switching with CSS variables
- **Type Safety**: Full TypeScript coverage for runtime error prevention


## 🤖 AI Disclaimer

> **⚠️ Plot Twist!** This entire project was crafted by our AI overlords (100% AI-generated) 🤖✨  
> While our silicon brain worked overtime, there might be some quirky bugs hiding in the code.  
> Think of them as Easter eggs... but less fun and more crashy! 🐛💥
> 
> **Don't forget to star this repo!** ⭐ Your stars fuel our AI's ego and help it write better code! 🚀

---



## 한국어

### 🚀 **무료** 기능들

✨ **완전 무료** - 구독료도, 제한도, 숨겨진 비용도 없습니다!

- 🎨 **아름다운 실시간 미리보기** - 세련된 디자인으로 실시간 마크다운 렌더링
- ⚡ **즉시 렌더링** - 타이핑과 동시에 결과 확인
- 🔧 **강력한 툴바** - 직관적인 버튼으로 원클릭 포맷팅
- 🖥️ **전체화면 모드** - 집중해서 작업할 수 있는 환경
- 📄 **PDF 출력** - 전문적인 포맷팅으로 고품질 PDF 생성
- ⌨️ **키보드 단축키** - 워크플로우 속도 향상
- 📊 **테이블 지원** - GitHub Flavored Markdown 테이블
- 🎯 **코드 하이라이팅** - 다양한 언어의 구문 강조
- 💬 **풍부한 요소들** - 인용구, 목록, 링크, 이미지 등

### 🛠️ 기술 스택

- **Next.js 15.3.2** (Turbopack 사용)
- **React 19** 최신 UI 라이브러리
- **TypeScript** 타입 안전성
- **Tailwind CSS 4** 아름다운 스타일링
- **React Markdown** GitHub Flavored Markdown 지원
- **html2pdf.js** PDF 생성

### 🚀 빠른 시작

```bash
# 저장소 복제
git clone <your-repo-url>

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

### ⌨️ 키보드 단축키

| 단축키 | 동작 |
|--------|------|
| `Ctrl/Cmd + B` | **굵은 글씨** |
| `Ctrl/Cmd + I` | *기울임꼴* |
| `Ctrl/Cmd + K` | 링크 삽입 |
| `Ctrl/Cmd + P` | PDF로 출력 |
| `ESC` | 전체화면 모드 종료 |

### 📁 프로젝트 구조

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # 메인 에디터 페이지 (리팩토링됨)
│   │   ├── layout.tsx            # 앱 레이아웃
│   │   ├── globals.css           # 전역 스타일
│   │   ├── sitemap.ts           # SEO 사이트맵
│   │   └── favicon.ico          # 앱 아이콘
│   ├── components/
│   │   ├── MarkdownComponents.tsx # 커스텀 마크다운 렌더러
│   │   └── Toolbar.tsx           # 에디터 툴바 컴포넌트
│   ├── hooks/
│   │   └── useMarkdownEditor.ts  # 에디터 로직 커스텀 훅
│   ├── utils/
│   │   └── pdf.ts               # PDF 생성 유틸리티
│   ├── constants/
│   │   └── markdown.ts          # 앱 상수 및 기본값
│   └── types/
│       └── markdown.ts          # TypeScript 타입 정의
├── public/                      # 정적 자산
├── postcss.config.mjs          # PostCSS 설정
├── tailwind.config.ts          # Tailwind CSS 설정
└── package.json                # 의존성
```

### 🏗️ 아키텍처 하이라이트

#### **깔끔한 코드 구조**
- **모듈러 디자인**: 793줄 모노리스 → 7개의 집중된 모듈
- **단일 책임 원칙**: 각 파일이 특정 목적을 가짐
- **타입 안전성**: 포괄적인 TypeScript 정의
- **재사용 가능한 컴포넌트**: 모듈식 UI 컴포넌트

#### **컴포넌트 구조**
- `useMarkdownEditor` - 모든 에디터 상태와 로직을 관리하는 커스텀 훅
- `MarkdownComponents` - 마크다운 요소들을 위한 아름다운 커스텀 렌더러
- `Toolbar` - 모든 포맷팅 옵션을 포함한 직관적인 편집 툴바
- `pdf.ts` - 커스텀 스타일링을 포함한 전용 PDF 생성

#### **성능 기능**
- **코드 분할**: 자동 번들 최적화
- **동적 임포트**: 필요할 때만 PDF 라이브러리 로드
- **효율적인 리렌더링**: 최적화된 React 훅과 콜백
- **메모리 관리**: 적절한 정리 및 이벤트 처리

### 🎯 주요 기능 구현

- **실시간 미리보기**: 최적화된 상태 관리를 가진 커스텀 React 훅
- **PDF 생성**: 픽셀 완벽한 PDF 출력을 위한 고급 CSS 주입
- **반응형 디자인**: Tailwind CSS를 활용한 모바일 우선 접근법
- **접근성**: ARIA 레이블, 키보드 네비게이션, 스크린 리더 지원
- **다크/라이트 테마**: CSS 변수를 활용한 매끄러운 테마 전환
- **타입 안전성**: 런타임 에러 방지를 위한 완전한 TypeScript 커버리지

---

## 🤝 Contributing

This is a **FREE** and open-source project! Contributions are welcome.

이 프로젝트는 **무료** 오픈소스입니다! 기여를 환영합니다.

## 📄 License

**FREE** to use - MIT License

**무료** 사용 - MIT 라이선스

---

**💖 Made with love for the developer community - 100% FREE forever!**

**💖 개발자 커뮤니티를 위해 사랑으로 제작 - 영원히 100% 무료!**

---


## 🤖 AI 면책조항

> **⚠️ 반전!** 이 프로젝트는 AI 로봇들이 100% 제작했습니다 🤖✨  
> 우리의 실리콘 브레인이 야근을 했지만, 코드 곳곳에 재미있는(?) 버그들이 숨어있을 수 있어요.  
> 이스터 에그라고 생각하세요... 단지 덜 재미있고 더 많이 터질 뿐! 🐛💥
> 
> **스타 주는 거 잊지 마세요!** ⭐ 여러분의 스타가 AI의 자존감을 높여주고 더 나은 코드를 짜게 해줍니다! 🚀
