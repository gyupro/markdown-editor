import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateShareToken, globalRateLimiter } from '@/utils/validation';

// 클라이언트 IP 추출 헬퍼 함수
const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || remoteAddr || 'unknown';
};

// 공유 문서 조회 (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Rate limiting 체크 (조회는 더 관대하게 - 1분에 30번)
    const clientIP = getClientIP(request);
    if (!globalRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 429 }
      );
    }

    const { token } = await params;

    // 토큰 검증
    if (!validateShareToken(token)) {
      return NextResponse.json(
        { error: '유효하지 않은 공유 토큰입니다.' },
        { status: 400 }
      );
    }

    // 데이터베이스에서 문서 조회
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('share_token', token)
      .eq('is_public', true)
      .single();

    if (error || !document) {
      // 보안상 구체적인 에러 내용은 노출하지 않음
      return NextResponse.json(
        { error: '문서를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 민감한 정보 제거 후 반환 (share_token, is_public 필드 제거)
    const { share_token: _, is_public: __, ...safeDocument } = document;
    
    return NextResponse.json(safeDocument);
  } catch (error) {
    console.error('GET /api/documents/[token] 오류:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 공유 문서 업데이트 (PUT) - 향후 사용을 위한 준비
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Rate limiting 체크
    const clientIP = getClientIP(request);
    if (!globalRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 429 }
      );
    }

    const { token } = await params;

    // 토큰 검증
    if (!validateShareToken(token)) {
      return NextResponse.json(
        { error: '유효하지 않은 공유 토큰입니다.' },
        { status: 400 }
      );
    }

    // 현재는 업데이트 기능을 지원하지 않음
    return NextResponse.json(
      { error: '문서 업데이트는 현재 지원되지 않습니다.' },
      { status: 405 }
    );
  } catch (error) {
    console.error('PUT /api/documents/[token] 오류:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 