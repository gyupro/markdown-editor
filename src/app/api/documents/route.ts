import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';
import {
  validateTitle,
  validateContent,
  sanitizeInput,
  globalRateLimiter,
  validateEnvironment
} from '@/utils/validation';

// 환경 변수 검증 (서버 시작 시)
const envValidation = validateEnvironment();
if (!envValidation.isValid) {
  console.error('환경 변수 검증 실패:', envValidation.errors);
}

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

// 문서 생성 (POST)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting 체크
    const clientIP = getClientIP(request);
    if (!globalRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 429 }
      );
    }

    // Content-Type 검증
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: '올바르지 않은 Content-Type입니다.' },
        { status: 400 }
      );
    }

    // 요청 본문 파싱
    let body: { title: string; content: string };
    try {
      body = await request.json() as { title: string; content: string };
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return NextResponse.json(
        { error: '잘못된 JSON 형식입니다.' },
        { status: 400 }
      );
    }

    const { title, content } = body;

    // 입력값 검증
    const titleValidation = validateTitle(title);
    if (!titleValidation.isValid) {
      console.error('제목 검증 실패:', titleValidation.error);
      return NextResponse.json(
        { error: titleValidation.error },
        { status: 400 }
      );
    }

    const contentValidation = validateContent(content);
    if (!contentValidation.isValid) {
      console.error('내용 검증 실패:', contentValidation.error);
      return NextResponse.json(
        { error: contentValidation.error },
        { status: 400 }
      );
    }

    // 입력값 생성
    const sanitizedTitle = sanitizeInput(title, 200);
    const sanitizedContent = sanitizeInput(content, 10 * 1024 * 1024); // 10MB로 증가
    
    // 동일한 내용의 기존 공개 문서가 있는지 확인
    const { data: existingDocument, error: searchError } = await supabase
      .from('documents')
      .select('*')
      .eq('content', sanitizedContent)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 기존 문서가 있다면 그것을 반환
    if (existingDocument && !searchError) {
      const response = NextResponse.json({
        ...existingDocument,
        _meta: {
          isReused: true,
          message: '동일한 내용의 문서가 이미 존재하여 기존 공유 링크를 사용합니다.'
        }
      });
      
      // UTF-8 인코딩 명시적 설정
      response.headers.set('Content-Type', 'application/json; charset=utf-8');
      return response;
    }
    
    // 기존 문서가 없다면 새로운 문서 생성 (nanoid 사용으로 더 짧은 토큰 생성 - 10자)
    const shareToken = nanoid(10);
    
    const { data: newDocument, error: insertError } = await supabase
      .from('documents')
      .insert([
        {
          title: sanitizedTitle,
          content: sanitizedContent,
          share_token: shareToken,
          is_public: true,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('문서 삽입 오류:', insertError);
      return NextResponse.json(
        { error: '문서 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      ...newDocument,
      _meta: {
        isReused: false,
        message: '새로운 공유 링크가 생성되었습니다.'
      }
    });
    
    // UTF-8 인코딩 명시적 설정
    response.headers.set('Content-Type', 'application/json; charset=utf-8');
    return response;
  } catch (error) {
    console.error('POST /api/documents 오류:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 