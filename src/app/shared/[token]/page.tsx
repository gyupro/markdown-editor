import React from 'react';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { validateShareToken } from '@/utils/validation';
import { extractSummaryFromMarkdown } from '@/utils/markdown';
import SharedDocumentClient from './SharedDocumentClient';

// 서버사이드에서 메타데이터 생성
export async function generateMetadata(
  { params }: { params: Promise<{ token: string }> }
): Promise<Metadata> {
  try {
    const { token } = await params;
    
    // 토큰 검증
    if (!validateShareToken(token)) {
      return {
        title: '잘못된 공유 링크 | FREE 마크다운 에디터',
        description: '유효하지 않은 공유 링크입니다.',
      };
    }

    // 서버에서 문서 데이터 가져오기
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('share_token', token)
      .eq('is_public', true)
      .single();

    if (error || !document) {
      return {
        title: '문서를 찾을 수 없음 | FREE 마크다운 에디터',
        description: '요청하신 문서를 찾을 수 없습니다.',
      };
    }

    // 문서 내용에서 요약 추출 (최대 150자)
    const summary = extractSummaryFromMarkdown(document.content);
    const description = summary || `${document.title} - FREE 마크다운 에디터로 작성된 문서`;

    return {
      title: `${document.title}`,
      description: description,
      openGraph: {
        title: document.title,
        description: description,
        type: 'article',
        siteName: 'FREE 마크다운 에디터',
        locale: 'ko_KR',
        publishedTime: document.created_at,
      },
      twitter: {
        card: 'summary',
        title: document.title,
        description: description,
      },
      // 카카오톡 최적화를 위한 추가 메타데이터
      other: {
        'og:article:author': 'FREE 마크다운 에디터',
        'og:article:published_time': document.created_at,
      }
    };
  } catch (error) {
    console.error('메타데이터 생성 오류:', error);
    return {
      title: 'FREE 마크다운 에디터',
      description: '온라인 마크다운 에디터로 문서를 작성하고 공유하세요.',
    };
  }
}

export default function SharedDocumentPage() {
  return <SharedDocumentClient />;
} 