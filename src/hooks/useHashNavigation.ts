import { useEffect, useCallback } from 'react';

export const useHashNavigation = (contentLoaded: boolean = true) => {
  // 해시로 스크롤하는 함수
  const scrollToHash = useCallback((hash?: string) => {
    const targetHash = hash || window.location.hash.slice(1);
    if (targetHash) {
      // 더 긴 지연으로 렌더링 완료 대기
      setTimeout(() => {
        const element = document.getElementById(targetHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  useEffect(() => {
    if (!contentLoaded) return;

    // 페이지 로드 시 URL 해시 확인 및 스크롤
    const handleHashOnLoad = () => {
      scrollToHash();
    };

    // 브라우저 뒤로가기/앞으로가기 시 해시 변경 처리
    const handleHashChange = () => {
      scrollToHash();
    };

    // 초기 로드 시 해시 처리
    handleHashOnLoad();

    // 해시 변경 이벤트 리스너 등록
    window.addEventListener('hashchange', handleHashChange);

    // 정리
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [contentLoaded, scrollToHash]);

  return { scrollToHash };
}; 