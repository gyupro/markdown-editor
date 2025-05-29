import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Markdown Editor - 무료 온라인 마크다운 에디터",
    template: "%s | Markdown Editor"
  },
  description: "실시간 미리보기, PDF 출력, 키보드 단축키를 지원하는 강력하고 직관적인 온라인 마크다운 에디터입니다. GitHub Flavored Markdown을 지원하며 완전 무료로 사용할 수 있습니다.",
  keywords: [
    "마크다운", "markdown", "에디터", "editor", "온라인", "online", 
    "실시간", "미리보기", "preview", "PDF", "출력", "export",
    "GitHub", "GFM", "문서", "document", "작성", "writing",
    "무료", "free", "웹", "web", "텍스트", "text"
  ],
  authors: [{ name: "Markdown Editor Team" }],
  creator: "Markdown Editor",
  publisher: "Markdown Editor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://markdown.develop-on.co.kr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Markdown Editor - 무료 온라인 마크다운 에디터",
    description: "실시간 미리보기, PDF 출력, 키보드 단축키를 지원하는 강력하고 직관적인 온라인 마크다운 에디터입니다.",
    url: 'https://markdown.develop-on.co.kr',
    siteName: 'Markdown Editor',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.JPG',
        width: 1200,
        height: 630,
        alt: 'Markdown Editor - 온라인 마크다운 에디터',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Markdown Editor - 무료 온라인 마크다운 에디터",
    description: "실시간 미리보기, PDF 출력, 키보드 단축키를 지원하는 강력하고 직관적인 온라인 마크다운 에디터입니다.",
    images: ['/og-image.JPG'],
    creator: '@markdown_editor',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code-here',
    other: {
      'naver-site-verification': 'naver-verification-code-here',
    },
  },
  category: 'technology',
  classification: 'Text Editor, Productivity Tool',
  other: {
    'application-name': 'Markdown Editor',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Markdown Editor',
    'msapplication-TileColor': '#ffffff',
    'theme-color': '#ffffff',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Markdown Editor",
              "description": "실시간 미리보기, PDF 출력, 키보드 단축키를 지원하는 강력하고 직관적인 온라인 마크다운 에디터입니다.",
              "url": "https://markdown.develop-on.co.kr",
              "applicationCategory": "TextEditor",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "softwareVersion": "1.0",
              "featureList": [
                "실시간 마크다운 미리보기",
                "PDF 문서 출력",
                "키보드 단축키 지원",
                "GitHub Flavored Markdown 지원",
                "테이블 및 코드 블록 지원",
                "전체화면 모드",
                "무료 사용"
              ],
              "author": {
                "@type": "Organization",
                "name": "Markdown Editor Team"
              },
              "datePublished": "2024-01-01",
              "dateModified": new Date().toISOString().split('T')[0],
              "inLanguage": "ko-KR",
              "isAccessibleForFree": true
            })
          }}
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and PWA icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional SEO meta tags */}
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="language" content="Korean" />
        <meta name="geo.region" content="KR" />
        <meta name="geo.country" content="Korea" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
