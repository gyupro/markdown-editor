// 토큰 검증 및 보안 유틸리티 함수들

/**
 * 공유 토큰의 유효성을 검증합니다.
 * 기존 UUID v4 토큰(36자)과 새로운 nanoid 토큰(10자) 모두 지원합니다.
 */
export const validateShareToken = (token: string): boolean => {
  // 기본 검증: 길이 체크
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // UUID v4 패턴 검증 (기존 링크 호환성)
  // 형식: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  // nanoid 10자리 패턴 검증 (새로운 링크)
  // nanoid는 기본적으로 A-Z, a-z, 0-9, _, - 문자를 사용
  const nanoidPattern = /^[A-Za-z0-9_-]{10}$/;
  
  // UUID 패턴 체크
  if (uuidPattern.test(token)) {
    return true; // UUID는 표준 형식이므로 추가 검증 없이 통과
  }
  
  // nanoid 패턴 체크
  if (nanoidPattern.test(token)) {
    // nanoid의 경우 추가 보안 검증: 의심스러운 패턴 차단
    const suspiciousPatterns = [
      /^(.)\1{9}$/, // 같은 문자 10개 (예: aaaaaaaaaa)
      /^(..)\1{4}$/, // 같은 패턴 5번 반복 (예: abababab)
      /^(012|123|234|345|456|567|678|789|890|901)/, // 연속 숫자
      /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/, // 연속 알파벳
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(token.toLowerCase()));
  }
  
  // 둘 다 아니면 유효하지 않음
  return false;
};

/**
 * 환경 변수 검증
 */
export const validateEnvironment = (): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Supabase 환경 변수 검증
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.');
  } else {
    // URL 형식 검증
    try {
      new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    } catch {
      errors.push('NEXT_PUBLIC_SUPABASE_URL이 올바른 URL 형식이 아닙니다.');
    }
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.');
  } else {
    // Supabase anon key 형식 검증 (JWT 토큰 형태)
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!anonKey.includes('.') || anonKey.split('.').length !== 3) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY가 올바른 JWT 형식이 아닙니다.');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 입력값 생성 (XSS 방지) - 이모지와 유니코드 문자 보존
 */
export const sanitizeInput = (input: string, maxLength: number = 10000): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // 길이 제한
  let sanitized = input.slice(0, maxLength);
  
  // 위험한 HTML 태그와 스크립트만 제거하고 이모지/유니코드는 보존
  // XSS 공격에 사용될 수 있는 패턴만 선별적으로 처리
  sanitized = sanitized
    // 스크립트 태그 완전 제거
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // 이벤트 핸들러 제거
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // javascript: 프로토콜 제거  
    .replace(/javascript:/gi, '')
    // 위험한 data: URL 제거 (이미지 제외)
    .replace(/data:(?!image\/[a-z]+;base64,)[^;\s]*/gi, '')
    // 위험한 HTML 태그만 이스케이프 (기본 HTML 태그는 보존)
    .replace(/<script/gi, '&lt;script')
    .replace(/<\/script>/gi, '&lt;/script&gt;')
    .replace(/<iframe/gi, '&lt;iframe')
    .replace(/<object/gi, '&lt;object')
    .replace(/<embed/gi, '&lt;embed')
    .replace(/<form/gi, '&lt;form');
  
  return sanitized;
};

/**
 * 제목 검증
 */
export const validateTitle = (title: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: '제목은 필수입니다.' };
  }
  
  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length === 0) {
    return { isValid: false, error: '제목은 공백일 수 없습니다.' };
  }
  
  if (trimmedTitle.length > 200) {
    return { isValid: false, error: '제목은 200자를 초과할 수 없습니다.' };
  }
  
  // 위험한 패턴만 차단 (스크립트 태그, HTML 태그 등)
  const dangerousPatterns = [
    /<[^>]*>/g, // HTML 태그
    /javascript:/gi, // javascript: 프로토콜
    /on\w+\s*=/gi, // 이벤트 핸들러
    /data:(?!image\/[a-z]+;base64,)/gi, // 의심스러운 data: URL
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmedTitle)) {
      return { isValid: false, error: '제목에 허용되지 않는 코드가 포함되어 있습니다.' };
    }
  }
  
  return { isValid: true };
};

/**
 * 마크다운 콘텐츠 검증
 */
export const validateContent = (content: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: '내용은 필수입니다.' };
  }
  
  // 최대 길이 제한 (1MB)
  const maxLength = 1024 * 1024; // 1MB
  if (content.length > maxLength) {
    return { 
      isValid: false, 
      error: `내용이 너무 깁니다. 최대 ${Math.floor(maxLength / 1024)}KB까지 허용됩니다.` 
    };
  }
  
  // 기본적인 악성 콘텐츠 패턴 검사 (더 정확한 패턴 사용)
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // script 태그
    /javascript\s*:/gi, // javascript: 프로토콜
    /\bon(click|load|error|focus|blur|change|submit|keyup|keydown|mouseover|mouseout)\s*=/gi, // 실제 이벤트 핸들러만
    /data:(?!image\/[a-z]+;base64,)(?!text\/)[^;\s]*/gi, // 의심스러운 data: URL (이미지와 텍스트 제외)
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(content)) {
      return { 
        isValid: false, 
        error: '보안상의 이유로 허용되지 않는 내용이 포함되어 있습니다.' 
      };
    }
  }
  
  return { isValid: true };
};

/**
 * Rate limiting을 위한 간단한 메모리 기반 저장소
 */
class SimpleRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  
  constructor(maxRequests: number = 10, windowMs: number = 60000) { // 기본: 1분에 10번
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // 윈도우 밖의 요청들 제거
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // 새 요청 추가
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  // 메모리 정리 (주기적으로 호출 권장)
  cleanup(): void {
    const now = Date.now();
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < this.windowMs);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// 전역 Rate Limiter 인스턴스
export const globalRateLimiter = new SimpleRateLimiter(); 