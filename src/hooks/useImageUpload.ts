import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const WEBP_QUALITY = 0.85; // WebP 품질 (0-1)

// 이미지를 WebP로 변환하는 함수
const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // GIF는 애니메이션 유지를 위해 변환하지 않음
    if (file.type === 'image/gif') {
      resolve(file);
      return;
    }

    // SVG는 벡터 포맷이므로 변환하지 않음
    if (file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    // 이미 WebP면 그대로 반환
    if (file.type === 'image/webp') {
      resolve(file);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // WebP 변환 실패 시 원본 반환
              resolve(file);
            }
          },
          'image/webp',
          WEBP_QUALITY
        );
      } else {
        resolve(file);
      }
    };

    img.onerror = () => {
      // 이미지 로드 실패 시 원본 반환
      resolve(file);
    };

    img.src = URL.createObjectURL(file);
  });
};

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
      setUploadProgress(10);

      // Convert to WebP (GIF, SVG 제외)
      const convertedBlob = await convertToWebP(file);
      const isConverted = convertedBlob.type === 'image/webp' && file.type !== 'image/webp';

      setUploadProgress(30);

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      // WebP로 변환된 경우 확장자를 webp로, 아니면 원본 확장자 유지
      const extension = isConverted ? 'webp' : (file.type === 'image/gif' ? 'gif' : file.type === 'image/svg+xml' ? 'svg' : file.name.split('.').pop() || 'webp');
      const fileName = `${timestamp}-${randomStr}.${extension}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, convertedBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: convertedBlob.type
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

      // Generate markdown with newlines for proper rendering
      const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const markdown = `\n![${altText}](${publicUrl})\n`;

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
