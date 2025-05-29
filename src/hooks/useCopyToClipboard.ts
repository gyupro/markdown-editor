import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  isError: boolean;
  errorMessage: string | null;
  copyToClipboard: (text: string) => Promise<boolean>;
}

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setIsCopied(false);
    setIsError(false);
    setErrorMessage(null);
  }, []);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    // 상태 초기화
    resetState();

    // 빈 텍스트 체크
    if (!text || text.trim().length === 0) {
      setIsError(true);
      setErrorMessage('복사할 내용이 없습니다.');
      return false;
    }

    // 모던 브라우저의 navigator.clipboard API 시도
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        
        // 2초 후 복사 상태 초기화
        setTimeout(resetState, 2000);
        return true;
      } catch (err) {
        console.warn('navigator.clipboard.writeText 실패:', err);
        // 폴백 방법으로 계속 진행
      }
    }

    // 폴백: 레거시 방법 시도 (document.execCommand)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('aria-hidden', 'true');
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length); // 모바일 호환성
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setIsCopied(true);
        setTimeout(resetState, 2000);
        return true;
      } else {
        throw new Error('document.execCommand("copy") 실패');
      }
    } catch (fallbackErr) {
      console.error('폴백 복사 방법도 실패:', fallbackErr);
      
      // 최종 에러 처리
      setIsError(true);
      
      // 사용자 친화적 에러 메시지
      if (!navigator.clipboard) {
        setErrorMessage('이 브라우저는 자동 복사를 지원하지 않습니다. 텍스트를 직접 선택하여 복사해 주세요.');
      } else if (!window.isSecureContext) {
        setErrorMessage('보안상의 이유로 복사할 수 없습니다. HTTPS 환경에서 사용해 주세요.');
      } else {
        setErrorMessage('복사에 실패했습니다. 브라우저 설정을 확인하거나 직접 선택하여 복사해 주세요.');
      }
      
      // 3초 후 에러 상태 초기화
      setTimeout(resetState, 3000);
      return false;
    }
  }, [resetState]);

  return { 
    isCopied, 
    isError, 
    errorMessage, 
    copyToClipboard 
  };
}; 