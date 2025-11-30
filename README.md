# 📝 **FREE** Markdown Editor

> **🌐 Live Demo:** https://markdown.develop-on.co.kr/shared/idMj2BK6KA

> **🆓 100% FREE & Open Source** - A powerful, feature-rich markdown editor with document sharing built with Next.js

---

## 🌍 **Language / 언어 선택**

| [🇺🇸 **English**](#-english-version) | [🇰🇷 **한국어**](#-한국어-버전) |
|:---:|:---:|

---

# 🇺🇸 **English Version**

## ✨ **Key Features**

**Completely FREE** - No subscriptions, no limitations, no hidden costs!

- 🎨 **Beautiful Live Preview** - Real-time markdown rendering with elegant styling
- ⚡ **Instant Rendering** - See your changes as you type
- 🤖 **AI Content Generation** - GEMINI-powered content creation and improvement
- 📄 **PDF Export** - High-quality PDF generation with professional formatting
- 🌐 **Document Sharing** - Create shareable links for your documents
- 🖥️ **Fullscreen Mode** - Distraction-free writing and preview
- ⌨️ **Keyboard Shortcuts** - Speed up your workflow
- 🎯 **Code Highlighting** - Syntax highlighting for multiple languages
- 🌙 **Dark/Light Theme** - Seamless theme switching
- 📱 **Mobile Responsive** - Perfect experience on all devices
- ↩️ **Undo/Redo** - Full history support with Ctrl+Z/Y shortcuts
- 💾 **Local Storage** - Auto-save drafts and manage documents locally
- 🖼️ **Image Upload** - Drag & drop or paste images directly (auto-upload to cloud)
- 🔄 **Scroll Sync** - Synchronized scrolling between editor and preview

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/gyupro/markdown-editor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Setup

Create a `.env.local` file with your Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | **Bold** text |
| `Ctrl/Cmd + I` | *Italic* text |
| `Ctrl/Cmd + K` | Insert link |
| `Ctrl/Cmd + P` | Export to PDF |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + Shift + Z` | Redo (alternative) |
| `Ctrl/Cmd + S` | Save now |
| `ESC` | Exit fullscreen mode |

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
├── components/             # React components
├── hooks/                  # Custom hooks
├── lib/                    # Utilities & configs
└── types/                  # TypeScript types
```

## 🛠️ Tech Stack

- **Next.js 15.3.2** with Turbopack
- **React 19** for modern UI
- **TypeScript** for type safety
- **Tailwind CSS 4** for beautiful styling
- **Supabase** for database and document storage
- **Google Generative AI** for GEMINI integration

---

# 🇰🇷 **한국어 버전**

## ✨ **주요 기능**

**완전 무료** - 구독료도, 제한도, 숨겨진 비용도 없습니다!

- 🎨 **아름다운 실시간 미리보기** - 세련된 디자인으로 실시간 마크다운 렌더링
- ⚡ **즉시 렌더링** - 타이핑과 동시에 결과 확인
- 🤖 **AI 콘텐츠 생성** - GEMINI 기반 콘텐츠 생성 및 개선
- 📄 **PDF 출력** - 전문적인 포맷팅으로 고품질 PDF 생성
- 🌐 **문서 공유** - 문서의 공유 가능한 링크 생성
- 🖥️ **전체화면 모드** - 집중해서 작업할 수 있는 환경
- ⌨️ **키보드 단축키** - 워크플로우 속도 향상
- 🎯 **코드 하이라이팅** - 다양한 언어의 구문 강조
- 🌙 **다크/라이트 테마** - 매끄러운 테마 전환
- 📱 **모바일 반응형** - 모든 기기에서 완벽한 경험
- ↩️ **실행 취소/다시 실행** - Ctrl+Z/Y 단축키로 전체 히스토리 지원
- 💾 **로컬 저장소** - 초안 자동 저장 및 문서 로컬 관리
- 🖼️ **이미지 업로드** - 드래그 앤 드롭 또는 붙여넣기로 이미지 삽입 (클라우드 자동 업로드)
- 🔄 **스크롤 동기화** - 에디터와 미리보기 간 스크롤 동기화

## 🚀 빠른 시작

```bash
# 저장소 복제
git clone https://github.com/gyupro/markdown-editor

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 Supabase 정보로 수정

# 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

## 🔧 환경 설정

`.env.local` 파일을 생성하고 Supabase 설정을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## ⌨️ 키보드 단축키

| 단축키 | 동작 |
|--------|------|
| `Ctrl/Cmd + B` | **굵은 글씨** |
| `Ctrl/Cmd + I` | *기울임꼴* |
| `Ctrl/Cmd + K` | 링크 삽입 |
| `Ctrl/Cmd + P` | PDF로 출력 |
| `Ctrl/Cmd + Z` | 실행 취소 |
| `Ctrl/Cmd + Y` | 다시 실행 |
| `Ctrl/Cmd + Shift + Z` | 다시 실행 (대체) |
| `Ctrl/Cmd + S` | 지금 저장 |
| `ESC` | 전체화면 모드 종료 |

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js 앱 라우터
├── components/             # 리액트 컴포넌트
├── hooks/                  # 커스텀 훅
├── lib/                    # 유틸리티 & 설정
└── types/                  # TypeScript 타입
```

## 🛠️ 기술 스택

- **Next.js 15.3.2** (Turbopack 사용)
- **React 19** 최신 UI 라이브러리
- **TypeScript** 타입 안전성
- **Tailwind CSS 4** 아름다운 스타일링
- **Supabase** 데이터베이스 및 문서 저장소
- **Google Generative AI** GEMINI 통합

---

## 🤖 AI Disclaimer

> **⚠️ Plot Twist!** This entire project was crafted by our AI overlords (100% AI-generated) 🤖✨  
> While our silicon brain worked overtime, there might be some quirky bugs hiding in the code.  
> Think of them as Easter eggs... but less fun and more crashy! 🐛💥
> 
> **Don't forget to star this repo!** ⭐ Your stars fuel our AI's ego and help it write better code! 🚀

> **⚠️ 반전!** 이 프로젝트는 AI 로봇들이 100% 제작했습니다 🤖✨  
> 우리의 실리콘 브레인이 야근을 했지만, 코드 곳곳에 재미있는(?) 버그들이 숨어있을 수 있어요.  
> 이스터 에그라고 생각하세요... 단지 덜 재미있고 더 많이 터질 뿐! 🐛💥
> 
> **스타 주는 거 잊지 마세요!** ⭐ 여러분의 스타가 AI의 자존감을 높여주고 더 나은 코드를 짜게 해줍니다! 🚀

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
