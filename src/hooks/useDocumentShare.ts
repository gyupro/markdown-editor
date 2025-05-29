import { useState } from 'react';
import { Document } from '@/lib/supabase';

export interface DocumentWithMeta extends Document {
  _meta?: {
    isReused: boolean;
    message: string;
  };
}

export const useDocumentShare = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 문서 저장 및 공유 링크 생성
  const createShareableDocument = async (title: string, content: string): Promise<DocumentWithMeta | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const document = await response.json();
      return document;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 공유 링크로 문서 로드
  const loadSharedDocument = async (token: string): Promise<Document | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${token}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Document not found');
        }
        throw new Error('Failed to load document');
      }

      const document = await response.json();
      return document;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 문서 업데이트
  const updateSharedDocument = async (token: string, title: string, content: string): Promise<Document | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      const document = await response.json();
      return document;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 공유 링크 생성
  const generateShareUrl = (token: string): string => {
    return `${window.location.origin}/shared/${token}`;
  };

  return {
    isLoading,
    error,
    createShareableDocument,
    loadSharedDocument,
    updateSharedDocument,
    generateShareUrl,
  };
}; 