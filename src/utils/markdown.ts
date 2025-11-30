/**
 * 마크다운 텍스트에서 제목을 추출하는 유틸리티 함수들
 */

/**
 * 마크다운 텍스트에서 첫 번째 줄의 헤딩을 추출하거나, 없으면 첫 번째 줄을 제목으로 사용
 * @param markdown 마크다운 텍스트
 * @returns 추출된 제목
 */
export const extractTitleFromMarkdown = (markdown: string): string => {
  if (!markdown || typeof markdown !== 'string') {
    return 'FREE-마크다운 에디터';
  }

  // 줄 단위로 분리
  const lines = markdown.trim().split('\n');
  
  // 빈 줄이 아닌 첫 번째 줄 찾기
  const firstLine = lines.find(line => line.trim().length > 0);
  
  if (!firstLine) {
    return 'FREE-마크다운 에디터';
  }

  // 마크다운 헤딩 패턴 제거 (# ## ### 등)
  const cleanedTitle = firstLine
    .replace(/^\[.*?\]\(.*?\)\s*/, '') // 링크 패턴 제거 [text](url)
    .replace(/^#+\s*/, '') // 헤딩 마크 제거
    .replace(/^\*+\s*/, '') // 불릿 포인트 제거
    .replace(/^-+\s*/, '') // 대시 제거
    .replace(/^\d+\.\s*/, '') // 숫자 리스트 제거
    .replace(/^\>\s*/, '') // 인용 제거
    .replace(/^`+/, '') // 코드 블록 제거
    .replace(/\[.*?\]\(.*?\)/g, '') // 나머지 링크 패턴도 제거
    .trim();

  // 제목이 너무 길면 자르기
  if (cleanedTitle.length > 50) {
    return cleanedTitle.substring(0, 47) + '...';
  }

  // 빈 제목이면 기본값 반환
  return cleanedTitle || 'FREE-마크다운 에디터';
};

/**
 * 마크다운 텍스트에서 첫 번째 헤딩만 추출 (# ## ### 등)
 * @param markdown 마크다운 텍스트
 * @returns 첫 번째 헤딩 또는 null
 */
export const extractFirstHeading = (markdown: string): string | null => {
  if (!markdown || typeof markdown !== 'string') {
    return null;
  }

  const lines = markdown.trim().split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    // 헤딩 패턴 확인 (# ## ### 등)
    if (trimmedLine.match(/^#+\s+.+/)) {
      return trimmedLine.replace(/^#+\s*/, '').trim();
    }
  }
  
  return null;
};

/**
 * 제목이 유효한지 확인
 * @param title 확인할 제목
 * @returns 유효 여부
 */
export const isValidTitle = (title: string): boolean => {
  return Boolean(title && 
         typeof title === 'string' && 
         title.trim().length > 0 && 
         title.trim() !== 'FREE-마크다운 에디터');
};

/**
 * 마크다운 텍스트에서 요약 정보를 추출하는 유틸리티 함수
 * @param markdown 마크다운 텍스트
 * @returns 요약 정보
 */
export const extractSummaryFromMarkdown = (markdown: string): string => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // 제목 줄 제거
  const lines = markdown.trim().split('\n');
  const contentLines = lines.slice(1).filter(line => line.trim().length > 0);
  
  // 첫 번째 문단 찾기 (헤딩이 아닌 일반 텍스트)
  const firstParagraph = contentLines.find(line => {
    const trimmed = line.trim();
    return !trimmed.startsWith('#') && 
           !trimmed.startsWith('-') && 
           !trimmed.startsWith('*') && 
           !trimmed.startsWith('>') && 
           !trimmed.startsWith('```') &&
           !trimmed.match(/^\d+\./) &&
           trimmed.length > 10;
  });

  if (!firstParagraph) {
    return '';
  }

  // 마크다운 서식 제거하고 요약
  const cleanText = firstParagraph
    .replace(/\*\*(.*?)\*\*/g, '$1') // 굵은 글씨
    .replace(/\*(.*?)\*/g, '$1') // 기울임
    .replace(/~~(.*?)~~/g, '$1') // 취소선
    .replace(/`(.*?)`/g, '$1') // 인라인 코드
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 링크
    .trim();

  // 요약 길이 제한
  if (cleanText.length > 100) {
    return cleanText.substring(0, 97) + '...';
  }

  return cleanText;
};

/**
 * 마크다운 텍스트의 기본 통계 정보 추출
 * @param markdown 마크다운 텍스트
 * @returns 통계 정보
 */
export const getMarkdownStats = (markdown: string): {
  wordCount: number;
  lineCount: number;
  headingCount: number;
  hasCodeBlocks: boolean;
  hasTables: boolean;
  hasImages: boolean;
} => {
  if (!markdown || typeof markdown !== 'string') {
    return {
      wordCount: 0,
      lineCount: 0,
      headingCount: 0,
      hasCodeBlocks: false,
      hasTables: false,
      hasImages: false,
    };
  }

  const lines = markdown.split('\n');
  const words = markdown.trim().split(/\s+/).filter(word => word.length > 0);
  
  return {
    wordCount: words.length,
    lineCount: lines.length,
    headingCount: lines.filter(line => line.trim().match(/^#+\s/)).length,
    hasCodeBlocks: markdown.includes('```'),
    hasTables: markdown.includes('|'),
    hasImages: markdown.includes('!['),
  };
}; 