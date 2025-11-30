import { useState, useCallback, useRef } from 'react';

const MAX_HISTORY_SIZE = 100;

export const useUndoRedo = (initialValue: string) => {
  const [history, setHistory] = useState<string[]>([initialValue]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoRef = useRef(false);

  // Get current value from history
  const currentValue = history[historyIndex];

  // Add new value to history
  const pushValue = useCallback((newValue: string) => {
    // Don't push if it's from undo/redo operation
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    setHistory(prev => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);

      // Don't add duplicate consecutive values
      if (newHistory[newHistory.length - 1] === newValue) {
        return prev;
      }

      // Add new value
      newHistory.push(newValue);

      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(-MAX_HISTORY_SIZE);
      }

      return newHistory;
    });

    setHistoryIndex(prev => {
      const newIndex = Math.min(prev + 1, MAX_HISTORY_SIZE - 1);
      return newIndex;
    });
  }, [historyIndex]);

  // Undo action
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true;
      setHistoryIndex(prev => prev - 1);
      return history[historyIndex - 1];
    }
    return null;
  }, [history, historyIndex]);

  // Redo action
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      setHistoryIndex(prev => prev + 1);
      return history[historyIndex + 1];
    }
    return null;
  }, [history, historyIndex]);

  // Check if undo/redo is available
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Reset history
  const resetHistory = useCallback((value: string) => {
    setHistory([value]);
    setHistoryIndex(0);
  }, []);

  return {
    currentValue,
    pushValue,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  };
};
