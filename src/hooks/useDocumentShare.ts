import { useState, useCallback } from 'react';
import { Document } from '@/lib/supabase';

export interface DocumentWithMeta extends Document {
  _meta?: {
    isReused: boolean;
    message: string;
  };
}

// 에러 타입 정의
interface ApiError {
  type: 'network' | 'server' | 'client' | 'timeout';
  message: string;
  status?: number;
  retryable: boolean;
}

// API 호출 시 재시도 헬퍼 함수
const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // 마지막 시도이거나 재시도할 수 없는 에러인 경우
      if (attempt === maxRetries || !isRetryableError(error)) {
        throw error;
      }
      
      // 재시도 전 대기
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError!;
};

// 재시도 가능한 에러인지 판단
const isRetryableError = (error: any): boolean => {
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    return true; // 네트워크 에러
  }
  
  if (error.status >= 500 && error.status < 600) {
    return true; // 서버 에러
  }
  
  if (error.status === 429) {
    return true; // Rate limit
  }
  
  return false;
};

// 에러를 분석하여 ApiError 객체 생성
const analyzeError = (error: any): ApiError => {
  // 네트워크 연결 에러
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    return {
      type: 'network',
      message: '인터넷 연결을 확인해 주세요. 네트워크에 연결되지 않았습니다.',
      retryable: true
    };
  }
  
  // 타임아웃 에러
  if (error.name === 'AbortError' || error.code === 'TIMEOUT') {
    return {
      type: 'timeout',
      message: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      retryable: true
    };
  }
  
  // HTTP 상태 코드별 에러 처리
  if (error.status) {
    const status = error.status;
    
    if (status >= 400 && status < 500) {
      const clientMessages: Record<number, string> = {
        400: '잘못된 요청입니다. 입력 내용을 확인해 주세요.',
        401: '인증이 필요합니다. 다시 로그인해 주세요.',
        403: '접근 권한이 없습니다.',
        404: '요청한 문서를 찾을 수 없습니다.',
        429: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.'
      };
      
      return {
        type: 'client',
        message: clientMessages[status] || `클라이언트 오류가 발생했습니다. (${status})`,
        status,
        retryable: status === 429
      };
    }
    
    if (status >= 500) {
      return {
        type: 'server',
        message: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        status,
        retryable: true
      };
    }
  }
  
  // 일반적인 에러
  return {
    type: 'client',
    message: error.message || '알 수 없는 오류가 발생했습니다.',
    retryable: false
  };
};

export const useDocumentShare = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 문서 저장 및 공유 링크 생성
  const createShareableDocument = useCallback(async (title: string, content: string): Promise<DocumentWithMeta | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await withRetry(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
        
        try {
          const response = await fetch('/api/documents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.message || 'Failed to create document');
            (error as any).status = response.status;
            throw error;
          }

          return await response.json();
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }
      });

      return result;
    } catch (err) {
      const apiError = analyzeError(err);
      setError(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 공유 링크로 문서 로드
  const loadSharedDocument = useCallback(async (token: string): Promise<Document | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await withRetry(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8초 타임아웃
        
        try {
          const response = await fetch(`/api/documents/${token}`, {
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const error = new Error(response.status === 404 ? 'Document not found' : 'Failed to load document');
            (error as any).status = response.status;
            throw error;
          }

          return await response.json();
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }
      });

      return result;
    } catch (err) {
      const apiError = analyzeError(err);
      setError(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 문서 업데이트
  const updateSharedDocument = useCallback(async (token: string, title: string, content: string): Promise<Document | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await withRetry(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
        
        try {
          const response = await fetch(`/api/documents/${token}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const error = new Error('Failed to update document');
            (error as any).status = response.status;
            throw error;
          }

          return await response.json();
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }
      });

      return result;
    } catch (err) {
      const apiError = analyzeError(err);
      setError(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 공유 링크 생성
  const generateShareUrl = useCallback((token: string): string => {
    return `${window.location.origin}/shared/${token}`;
  }, []);

  return {
    isLoading,
    error,
    createShareableDocument,
    loadSharedDocument,
    updateSharedDocument,
    generateShareUrl,
  };
}; 