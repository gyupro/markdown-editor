import React from 'react';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { validateShareToken } from '@/utils/validation';
import { extractSummaryFromMarkdown, extractTitleFromMarkdown } from '@/utils/markdown';
import SharedDocumentClient from './SharedDocumentClient';

// 서버사이드에서 메타데이터 생성
export async function generateMetadata(
  { params }: { params: Promise<{ token: string; locale?: string }> }
): Promise<Metadata> {
  try {
    const { token } = await params;
    
    // URL 해시가 포함된 경우 토큰만 추출
    const cleanToken = token.split('#')[0];
    
    // 토큰 검증
    if (!validateShareToken(cleanToken)) {
      return {
        title: '잘못된 공유 링크 | FREE 마크다운 에디터',
        description: '유효하지 않은 공유 링크입니다.',
      };
    }

    // 서버에서 문서 데이터 가져오기
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('share_token', cleanToken)
      .eq('is_public', true)
      .single();

    if (error || !document) {
      return {
        title: '문서를 찾을 수 없음 | FREE 마크다운 에디터',
        description: '요청하신 문서를 찾을 수 없습니다.',
      };
    }

    // 문서에서 제목 추출 (메타데이터에서 사용할 제목)
    const extractedTitle = extractTitleFromMarkdown(document.content) || document.title;
    
    // 문서 내용에서 요약 추출 (최대 160자)
    const summary = extractSummaryFromMarkdown(document.content);
    const description = summary || `${extractedTitle} - FREE 마크다운 에디터로 작성된 문서`;
    
    // 동적 URL 설정
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://markdown.develop-on.co.kr';
    const canonicalUrl = `${baseUrl}/shared/${cleanToken}`;

    return {
      title: `${extractedTitle} | FREE 마크다운 에디터`,
      description,
      keywords: [
        extractedTitle,
        '마크다운', 'markdown', '공유', 'share',
        '문서', 'document', '에디터', 'editor',
        '무료', 'free', '온라인', 'online',
        'preview', '미리보기'
      ],
      authors: [{ name: 'FREE 마크다운 에디터' }],
      creator: 'FREE 마크다운 에디터',
      publisher: 'FREE 마크다운 에디터',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      // Open Graph
      openGraph: {
        title: extractedTitle,
        description,
        type: 'article',
        url: canonicalUrl,
        siteName: 'FREE 마크다운 에디터',
        locale: 'ko_KR',
        publishedTime: document.created_at,
        modifiedTime: document.updated_at || document.created_at,
        authors: ['FREE 마크다운 에디터'],
      },
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: extractedTitle,
        description,
        site: '@markdown_editor',
        creator: '@markdown_editor',
      },
      // 추가 메타태그
      other: {
        'article:author': 'FREE 마크다운 에디터',
        'article:published_time': document.created_at,
        'article:modified_time': document.updated_at || document.created_at,
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 오류:', error);
    return {
      title: '오류 발생 | FREE 마크다운 에디터',
      description: '문서를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

// 클라이언트 컴포넌트에 props 전달을 위한 서버 컴포넌트
export default async function SharedDocumentPage({ 
  params 
}: { 
  params: Promise<{ token: string; locale?: string }> 
}) {
  const { token } = await params;
  
  return <SharedDocumentClient initialToken={token} />;
} 