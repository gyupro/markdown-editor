import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

// Safe check for browser localStorage (handles Node.js v22+ built-in localStorage)
const isBrowserLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    if (!window.localStorage) return false;
    const testKey = '__test_storage__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Safe localStorage access
const getStorageTheme = (): Theme | null => {
  if (!isBrowserLocalStorageAvailable()) return null;
  try {
    return window.localStorage.getItem('theme') as Theme | null;
  } catch {
    return null;
  }
};

const setStorageTheme = (theme: Theme): void => {
  if (!isBrowserLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem('theme', theme);
  } catch {
    // Ignore errors
  }
};

export const useTheme = () => {
  // Always initialize with 'light' for SSR consistency
  // The blocking script in layout.tsx handles the CSS immediately
  // This state will sync with localStorage/DOM in useEffect
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 테마 로드 - sync with localStorage and DOM
  useEffect(() => {
    // Read from DOM first (blocking script already applied)
    const isDarkFromDOM = document.documentElement.classList.contains('dark');
    const savedTheme = getStorageTheme();

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (isDarkFromDOM) {
      setTheme('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    setIsLoaded(true);
  }, []);

  // 테마 적용
  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // localStorage에 저장
    setStorageTheme(theme);
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