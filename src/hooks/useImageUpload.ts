import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export interface ImageUploadResult {
  url: string;
  markdown: string;
}

export interface ImageUploadError {
  message: string;
  code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'UPLOAD_FAILED';
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<ImageUploadError | null>(null);

  const validateFile = useCallback((file: File): ImageUploadError | null => {
    if (file.size > MAX_FILE_SIZE) {
      return {
        message: `파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다. (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        code: 'FILE_TOO_LARGE'
      };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        message: `지원하지 않는 파일 형식입니다. (지원: JPEG, PNG, GIF, WebP, SVG)`,
        code: 'INVALID_TYPE'
      };
    }

    return null;
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<ImageUploadResult | null> => {
    setError(null);
    setUploadProgress(0);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop() || 'png';
      const fileName = `${timestamp}-${randomStr}.${extension}`;
      const filePath = `uploads/${fileName}`;

      setUploadProgress(30);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(80);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      setUploadProgress(100);

      // Generate markdown
      const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const markdown = `![${altText}](${publicUrl})`;

      return {
        url: publicUrl,
        markdown
      };
    } catch (err) {
      console.error('Image upload error:', err);
      setError({
        message: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
        code: 'UPLOAD_FAILED'
      });
      return null;
    } finally {
      setIsUploading(false);
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 500);
    }
  }, [validateFile]);

  const uploadFromClipboard = useCallback(async (clipboardData: DataTransfer): Promise<ImageUploadResult | null> => {
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          return uploadImage(file);
        }
      }
    }

    return null;
  }, [uploadImage]);

  const uploadFromDrop = useCallback(async (dataTransfer: DataTransfer): Promise<ImageUploadResult[]> => {
    const results: ImageUploadResult[] = [];
    const files = dataTransfer.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const result = await uploadImage(file);
        if (result) {
          results.push(result);
        }
      }
    }

    return results;
  }, [uploadImage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadImage,
    uploadFromClipboard,
    uploadFromDrop,
    isUploading,
    uploadProgress,
    error,
    clearError,
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_TYPES
  };
};
