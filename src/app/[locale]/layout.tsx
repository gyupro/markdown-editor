import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/request';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO content for each locale
const seoContent: Record<Locale, {
  title: string;
  description: string;
  keywords: string[];
  ogLocale: string;
  language: string;
  geoRegion: string;
  geoCountry: string;
}> = {
  en: {
    title: "FREE Markdown Editor - Online Editor with Real-Time Preview",
    description: "Free online Markdown editor with real-time preview, PDF export, syntax highlighting, and AI content generation. Supports English, Chinese, Japanese. No registration required.",
    keywords: [
      "markdown", "editor", "online", "free", "real-time preview", "PDF export",
      "syntax highlighting", "GitHub Flavored Markdown", "GFM", "web editor",
      "document editor", "text editor", "markdown preview", "code editor"
    ],
    ogLocale: "en_US",
    language: "English",
    geoRegion: "US",
    geoCountry: "United States"
  },
  zh: {
    title: "免费Markdown编辑器 - 在线实时预览编辑器",
    description: "免费在线Markdown编辑器，支持实时预览、PDF导出、语法高亮和AI内容生成。支持中文、英文、日文，无需注册即可使用。",
    keywords: [
      "Markdown编辑器", "在线编辑器", "免费", "实时预览", "PDF导出",
      "语法高亮", "GitHub Flavored Markdown", "GFM", "网页编辑器",
      "文档编辑器", "文本编辑器", "Markdown工具", "代码编辑器"
    ],
    ogLocale: "zh_CN",
    language: "Chinese",
    geoRegion: "CN",
    geoCountry: "China"
  },
  ja: {
    title: "無料Markdownエディタ - リアルタイムプレビュー付きオンラインエディタ",
    description: "無料のオンラインMarkdownエディタ。リアルタイムプレビュー、PDF出力、シンタックスハイライト、AI生成機能を搭載。日本語、英語、中国語に対応。登録不要。",
    keywords: [
      "Markdownエディタ", "オンラインエディタ", "無料", "リアルタイムプレビュー",
      "PDF出力", "シンタックスハイライト", "GitHub Flavored Markdown", "GFM",
      "Webエディタ", "文書エディタ", "テキストエディタ", "Markdownツール"
    ],
    ogLocale: "ja_JP",
    language: "Japanese",
    geoRegion: "JP",
    geoCountry: "Japan"
  },
  ko: {
    title: "무료 마크다운 에디터 - 실시간 미리보기 온라인 에디터",
    description: "실시간 미리보기, PDF 출력, 문법 강조, AI 콘텐츠 생성을 지원하는 무료 온라인 마크다운 에디터입니다. 한국어, 영어, 중국어, 일본어 지원. 회원가입 없이 사용 가능.",
    keywords: [
      "마크다운", "에디터", "온라인", "무료", "실시간 미리보기", "PDF 출력",
      "문법 강조", "GitHub Flavored Markdown", "GFM", "웹 에디터",
      "문서 편집기", "텍스트 에디터", "마크다운 미리보기"
    ],
    ogLocale: "ko_KR",
    language: "Korean",
    geoRegion: "KR",
    geoCountry: "Korea"
  }
};

// Generate metadata for each locale
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const seo = seoContent[locale as Locale];
  const baseUrl = 'https://markdown.develop-on.co.kr';

  // Generate alternates for all locales
  const alternateLanguages: Record<string, string> = {};
  locales.forEach(loc => {
    alternateLanguages[loc === 'en' ? 'x-default' : loc] = `${baseUrl}/${loc}`;
    alternateLanguages[loc] = `${baseUrl}/${loc}`;
  });

  return {
    title: {
      default: seo.title,
      template: `%s | Markdown Editor`
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "Markdown Editor Team" }],
    creator: "Markdown Editor",
    publisher: "Markdown Editor",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: alternateLanguages,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${locale}`,
      siteName: 'Markdown Editor',
      locale: seo.ogLocale,
      type: 'website',
      images: [
        {
          url: '/og-image.JPG',
          width: 1200,
          height: 630,
          alt: seo.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
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
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();
  const seo = seoContent[locale as Locale];
  const baseUrl = 'https://markdown.develop-on.co.kr';

  // Generate structured data for the locale
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Markdown Editor",
    "description": seo.description,
    "url": `${baseUrl}/${locale}`,
    "applicationCategory": "TextEditor",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "softwareVersion": "1.0",
    "featureList": locale === 'zh' ? [
      "实时Markdown预览",
      "PDF文档导出",
      "键盘快捷键支持",
      "GitHub Flavored Markdown支持",
      "表格和代码块支持",
      "全屏模式",
      "AI内容生成",
      "多语言支持",
      "免费使用"
    ] : locale === 'ja' ? [
      "リアルタイムMarkdownプレビュー",
      "PDFドキュメント出力",
      "キーボードショートカット対応",
      "GitHub Flavored Markdown対応",
      "テーブルとコードブロック対応",
      "フルスクリーンモード",
      "AIコンテンツ生成",
      "多言語サポート",
      "無料で利用可能"
    ] : locale === 'ko' ? [
      "실시간 마크다운 미리보기",
      "PDF 문서 출력",
      "키보드 단축키 지원",
      "GitHub Flavored Markdown 지원",
      "테이블 및 코드 블록 지원",
      "전체화면 모드",
      "AI 콘텐츠 생성",
      "다국어 지원",
      "무료 사용"
    ] : [
      "Real-time Markdown preview",
      "PDF document export",
      "Keyboard shortcuts support",
      "GitHub Flavored Markdown support",
      "Table and code block support",
      "Fullscreen mode",
      "AI content generation",
      "Multilingual support",
      "Free to use"
    ],
    "author": {
      "@type": "Organization",
      "name": "Markdown Editor Team"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : locale === 'ko' ? 'ko-KR' : 'en-US',
    "availableLanguage": ["en", "zh-CN", "ja", "ko"],
    "isAccessibleForFree": true
  };

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        {/* Theme initialization script - must run before render to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* Hreflang tags for SEO */}
        {locales.map((loc) => (
          <link
            key={loc}
            rel="alternate"
            hrefLang={loc === 'zh' ? 'zh-CN' : loc === 'ja' ? 'ja-JP' : loc === 'ko' ? 'ko-KR' : 'en'}
            href={`${baseUrl}/${loc}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Additional SEO meta tags */}
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="language" content={seo.language} />
        <meta name="geo.region" content={seo.geoRegion} />
        <meta name="geo.country" content={seo.geoCountry} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D9C9GV0E49"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D9C9GV0E49');
          `}
        </Script>

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
