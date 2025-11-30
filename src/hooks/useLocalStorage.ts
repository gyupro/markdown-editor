import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'markdown-editor-draft';

// Simple debounce implementation
function debounce(
  func: (value: string) => void,
  wait: number
): { (value: string): void; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (value: string) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(value), wait);
  };

  debouncedFn.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  return debouncedFn;
}

// Helper to safely access localStorage
const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const removeStorageItem = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const useLocalStorage = (key: string = STORAGE_KEY, initialValue: string) => {
  // Start with initialValue for SSR
  const [value, setValue] = useState(initialValue);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const saved = getStorageItem(key);
    if (saved !== null) {
      setValue(saved);
    }
    setIsHydrated(true);
  }, [key]);

  // Create debounced save function
  const debouncedSaveRef = useRef<{ (value: string): void; cancel: () => void } | null>(null);

  useEffect(() => {
    debouncedSaveRef.current = debounce((newValue: string) => {
      if (setStorageItem(key, newValue)) {
        setLastSaved(new Date());
      }
      setIsSaving(false);
    }, 1000);

    return () => {
      debouncedSaveRef.current?.cancel();
    };
  }, [key]);

  // Save to localStorage when value changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;

    setIsSaving(true);
    debouncedSaveRef.current?.(value);
  }, [value, isHydrated]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (setStorageItem(key, value)) {
      setLastSaved(new Date());
    }
  }, [key, value]);

  // Clear saved data
  const clearSaved = useCallback(() => {
    if (removeStorageItem(key)) {
      setLastSaved(null);
    }
  }, [key]);

  // Check if there's saved data
  const hasSavedData = useCallback(() => {
    return getStorageItem(key) !== null;
  }, [key]);

  return {
    value,
    setValue,
    lastSaved,
    isSaving,
    saveNow,
    clearSaved,
    hasSavedData,
  };
};
