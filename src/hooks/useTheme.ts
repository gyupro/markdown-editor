import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 테마 로드
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      // 저장된 테마가 있으면 사용
      setTheme(savedTheme);
    } else {
      // 저장된 테마가 없으면 시스템 설정 확인
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    setIsLoaded(true);
  }, []);

  // 테마 적용
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // localStorage에 저장
    localStorage.setItem('theme', theme);
  }, [theme, isLoaded]);

  // 테마 토글 함수
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    toggleTheme,
    isLoaded,
  };
};