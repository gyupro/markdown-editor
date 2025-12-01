# 📝 **FREE** Markdown Editor

> **🌐 Live Demo:** https://markdown.develop-on.co.kr/shared/idMj2BK6KA

> **🆓 100% FREE & Open Source** - A powerful, feature-rich markdown editor with document sharing built with Next.js

---

## 🌍 **Language / 언어 선택 / 言語選択 / 语言选择**

| [🇺🇸 **English**](#-english-version) | [🇰🇷 **한국어**](#-한국어-버전) | [🇯🇵 **日本語**](#-日本語版) | [🇨🇳 **中文**](#-中文版) |
|:---:|:---:|:---:|:---:|

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
| `Ctrl/Cmd + S` | Save to documents |
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
| `Ctrl/Cmd + S` | 문서함에 저장 |
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

# 🇯🇵 **日本語版**

## ✨ **主な機能**

**完全無料** - サブスクリプション、制限、隠れた費用は一切ありません！

- 🎨 **美しいライブプレビュー** - エレガントなスタイリングによるリアルタイムMarkdownレンダリング
- ⚡ **即座にレンダリング** - 入力と同時に変更を確認
- 🤖 **AIコンテンツ生成** - GEMINI搭載のコンテンツ作成と改善
- 📄 **PDF出力** - プロフェッショナルなフォーマットで高品質PDF生成
- 🌐 **ドキュメント共有** - ドキュメントの共有リンクを作成
- 🖥️ **フルスクリーンモード** - 集中して執筆・プレビュー
- ⌨️ **キーボードショートカット** - ワークフローを高速化
- 🎯 **コードハイライト** - 複数言語の構文強調表示
- 🌙 **ダーク/ライトテーマ** - シームレスなテーマ切り替え
- 📱 **モバイル対応** - すべてのデバイスで完璧な体験
- ↩️ **元に戻す/やり直し** - Ctrl+Z/Yショートカットで完全な履歴サポート
- 💾 **ローカルストレージ** - 下書きの自動保存とローカルでのドキュメント管理
- 🖼️ **画像アップロード** - ドラッグ＆ドロップまたは直接画像を貼り付け（クラウドに自動アップロード）
- 🔄 **スクロール同期** - エディタとプレビュー間の同期スクロール

## 🚀 クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/gyupro/markdown-editor

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.localをSupabase認証情報で編集

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🔧 環境設定

Supabase設定で`.env.local`ファイルを作成:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## ⌨️ キーボードショートカット

| ショートカット | 操作 |
|----------|--------|
| `Ctrl/Cmd + B` | **太字** テキスト |
| `Ctrl/Cmd + I` | *斜体* テキスト |
| `Ctrl/Cmd + K` | リンク挿入 |
| `Ctrl/Cmd + P` | PDFに出力 |
| `Ctrl/Cmd + Z` | 元に戻す |
| `Ctrl/Cmd + Y` | やり直し |
| `Ctrl/Cmd + Shift + Z` | やり直し（代替） |
| `Ctrl/Cmd + S` | ドキュメントに保存 |
| `ESC` | フルスクリーンモード終了 |

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js アプリルーター
├── components/             # Reactコンポーネント
├── hooks/                  # カスタムフック
├── lib/                    # ユーティリティ＆設定
└── types/                  # TypeScript型
```

## 🛠️ 技術スタック

- **Next.js 15.3.2** (Turbopack使用)
- **React 19** 最新UIライブラリ
- **TypeScript** 型安全性
- **Tailwind CSS 4** 美しいスタイリング
- **Supabase** データベースとドキュメントストレージ
- **Google Generative AI** GEMINI統合

---

# 🇨🇳 **中文版**

## ✨ **主要功能**

**完全免费** - 无订阅、无限制、无隐藏费用！

- 🎨 **精美实时预览** - 优雅样式的实时Markdown渲染
- ⚡ **即时渲染** - 边输入边查看更改
- 🤖 **AI内容生成** - GEMINI驱动的内容创建和改进
- 📄 **PDF导出** - 专业格式的高质量PDF生成
- 🌐 **文档分享** - 创建文档的分享链接
- 🖥️ **全屏模式** - 无干扰的写作和预览
- ⌨️ **键盘快捷键** - 加速您的工作流程
- 🎯 **代码高亮** - 多种语言的语法高亮
- 🌙 **深色/浅色主题** - 无缝切换主题
- 📱 **移动端响应式** - 所有设备上的完美体验
- ↩️ **撤销/重做** - 支持Ctrl+Z/Y快捷键的完整历史记录
- 💾 **本地存储** - 自动保存草稿和本地文档管理
- 🖼️ **图片上传** - 拖放或直接粘贴图片（自动上传到云端）
- 🔄 **滚动同步** - 编辑器和预览之间的同步滚动

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/gyupro/markdown-editor

# 安装依赖
npm install

# 设置环境变量
cp .env.example .env.local
# 用您的Supabase凭据编辑.env.local

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 🔧 环境配置

创建包含Supabase配置的`.env.local`文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## ⌨️ 键盘快捷键

| 快捷键 | 操作 |
|----------|--------|
| `Ctrl/Cmd + B` | **粗体** 文本 |
| `Ctrl/Cmd + I` | *斜体* 文本 |
| `Ctrl/Cmd + K` | 插入链接 |
| `Ctrl/Cmd + P` | 导出PDF |
| `Ctrl/Cmd + Z` | 撤销 |
| `Ctrl/Cmd + Y` | 重做 |
| `Ctrl/Cmd + Shift + Z` | 重做（替代） |
| `Ctrl/Cmd + S` | 保存到文档 |
| `ESC` | 退出全屏模式 |

## 📁 项目结构

```
src/
├── app/                    # Next.js应用路由
├── components/             # React组件
├── hooks/                  # 自定义Hooks
├── lib/                    # 工具和配置
└── types/                  # TypeScript类型
```

## 🛠️ 技术栈

- **Next.js 15.3.2** (使用Turbopack)
- **React 19** 现代UI库
- **TypeScript** 类型安全
- **Tailwind CSS 4** 精美样式
- **Supabase** 数据库和文档存储
- **Google Generative AI** GEMINI集成

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

> **⚠️ どんでん返し！** このプロジェクトは100% AIによって作成されました 🤖✨
> シリコンの頭脳が残業しましたが、コードのあちこちに楽しい(？)バグが隠れているかもしれません。
> イースターエッグだと思ってください...ただ、あまり楽しくなくてクラッシュしやすいだけ！ 🐛💥
>
> **スターを忘れずに！** ⭐ あなたのスターがAIの自尊心を高め、より良いコードを書かせます！ 🚀

> **⚠️ 反转！** 这个项目是由AI 100%制作的 🤖✨
> 我们的硅脑加班工作，但代码中可能藏着一些有趣的(?)bug。
> 把它们当作彩蛋吧...只是没那么有趣，更容易崩溃！ 🐛💥
>
> **别忘了给个Star！** ⭐ 你的Star能提升AI的自尊心，帮助它写出更好的代码！ 🚀

---

## 🤝 Contributing

This is a **FREE** and open-source project! Contributions are welcome.

이 프로젝트는 **무료** 오픈소스입니다! 기여를 환영합니다.

このプロジェクトは**無料**のオープンソースです！貢献を歓迎します。

这是一个**免费**的开源项目！欢迎贡献。

## 📄 License

**FREE** to use - MIT License

**무료** 사용 - MIT 라이선스

**無料**で使用可能 - MIT ライセンス

**免费**使用 - MIT 许可证

---

**💖 Made with love for the developer community - 100% FREE forever!**

**💖 개발자 커뮤니티를 위해 사랑으로 제작 - 영원히 100% 무료!**

**💖 開発者コミュニティのために愛を込めて制作 - 永遠に100%無料！**

**💖 为开发者社区用爱制作 - 永远100%免费！**
