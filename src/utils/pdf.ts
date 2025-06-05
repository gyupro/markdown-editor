import { PDFOptions } from '@/types/markdown';
import { CSSProperties } from 'react';

// PDF 옵션 상수화 및 타입 강화
export const PDF_DEFAULT_OPTIONS: PDFOptions = {
  margin: [0.5, 0.5, 0.5, 0.5],
  filename: 'markdown-document.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    letterRendering: true,
  },
  jsPDF: {
    unit: 'in',
    format: 'a4',
    orientation: 'portrait',
  },
  pagebreak: {
    mode: ['css', 'legacy'],
  },
} as const;

// Tailwind 스타일을 별도의 함수로 분리하여 재사용 가능하게 만듦
const generateTailwindStyles = (): string => `
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Tailwind 스타일 */
  .text-4xl { font-size: 2.25rem !important; }
  .text-3xl { font-size: 1.875rem !important; }
  .text-2xl { font-size: 1.5rem !important; }
  .text-lg { font-size: 1.125rem !important; }
  .text-sm { font-size: 0.875rem !important; }

  .font-bold { font-weight: 700 !important; }
  .font-semibold { font-weight: 600 !important; }

  /* 간격 관련 스타일 */
  .mb-6 { margin-bottom: 1.5rem !important; }
  .mb-4 { margin-bottom: 1rem !important; }
  .mb-3 { margin-bottom: 0.75rem !important; }
  .mt-8 { margin-top: 2rem !important; }
  .mt-6 { margin-top: 1.5rem !important; }
  .my-6 { margin-top: 1.5rem !important; margin-bottom: 1.5rem !important; }
  .pb-3 { padding-bottom: 0.75rem !important; }
  .pl-6 { padding-left: 1.5rem !important; }
  .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
  .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
  .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
  .px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
  .p-6 { padding: 1.5rem !important; }

  /* 색상 관련 스타일 */
  .text-gray-900 { color: #111827 !important; }
  .text-gray-800 { color: #1f2937 !important; }
  .text-gray-700 { color: #374151 !important; }
  .text-gray-300 { color: #d1d5db !important; }
  .text-white { color: #ffffff !important; }
  .text-pink-700 { color: #be185d !important; }
  .text-purple-600 { color: #9333ea !important; }
  .text-blue-600 { color: #2563eb !important; }

  /* 레이아웃 관련 스타일 */
  .leading-relaxed { line-height: 1.625 !important; }
  .flex { display: flex !important; }
  .items-center { align-items: center !important; }
  .items-start { align-items: flex-start !important; }

  /* 그라디언트 바 (h2용) */
  .w-1 { width: 0.25rem !important; }
  .h-8 { height: 2rem !important; }
  .bg-gradient-to-b { background: linear-gradient(to bottom, #3b82f6, #8b5cf6) !important; }
  .mr-3 { margin-right: 0.75rem !important; }
  .mr-2 { margin-right: 0.5rem !important; }
  .mt-1 { margin-top: 0.25rem !important; }
  .ml-6 { margin-left: 1.5rem !important; }
  .rounded-full { border-radius: 9999px !important; }
  .rounded-md { border-radius: 0.375rem !important; }
  .rounded-r-lg { border-radius: 0 0.5rem 0.5rem 0 !important; }
  .rounded-xl { border-radius: 0.75rem !important; }

  /* 배경색 */
  .bg-gradient-to-r { background: linear-gradient(to right, #dbeafe, #faf5ff) !important; }
  .bg-gradient-to-br { background: linear-gradient(to bottom right, #1f2937, #111827) !important; }
  .bg-white { background-color: #ffffff !important; }
  .bg-gray-800 { background-color: #1f2937 !important; }
  .bg-gray-900 { background-color: #111827 !important; }

  /* 테두리 */
  .border-l-4 { border-left: 4px solid !important; }
  .border-blue-500 { border-color: #3b82f6 !important; }
  .border { border: 1px solid !important; }
  .border-gray-200 { border-color: #e5e7eb !important; }
  .border-gray-700 { border-color: #374151 !important; }
  .border-pink-200 { border-color: #fbcfe8 !important; }

  /* 그림자 */
  .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
  .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }

  /* 페이지 나누기 기본 설정 */
  body, html {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 제목들은 페이지 분할 시 적절히 처리 */
  h1, h2 {
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }

  h3, h4, h5, h6 {
    page-break-inside: avoid !important;
  }

  /* 기타 스타일 */
  .italic { font-style: italic !important; }
  .font-mono { font-family: 'Monaco', 'Consolas', 'Courier New', monospace !important; }
  .underline { text-decoration: underline !important; }
  .space-y-2 > * + * { margin-top: 0.5rem !important; }
  .min-w-full { min-width: 100% !important; }
  .overflow-x-auto { overflow-x: auto !important; }
  .whitespace-nowrap { white-space: nowrap !important; }
  .uppercase { text-transform: uppercase !important; }
  .tracking-wider { letter-spacing: 0.05em !important; }
  .divide-y > * + * { border-top: 1px solid #e5e7eb !important; }
  .text-left { text-align: left !important; }
  .font-medium { font-weight: 500 !important; }
  .border-collapse { border-collapse: collapse !important; }
  .border-r { border-right: 1px solid #374151 !important; }
  .last\\:border-r-0:last-child { border-right: none !important; }

  /* 특별한 경우들 */
  .max-w-none { max-width: none !important; }

  /* 첫 번째 요소 마진 제거 */
  h1:first-child, h2:first-child, h3:first-child, p:first-child {
    margin-top: 0 !important;
  }

  /* 코드 블록 - 프리뷰와 동일한 어두운 테마 유지 */
  pre {
    background-color: #1f2937 !important;
    color: #f9fafb !important;
    padding: 1.5rem !important;
    border-radius: 0.5rem !important;
    overflow-x: auto !important;
    margin: 1.5rem 0 !important;
    font-family: 'Monaco', 'Consolas', 'Courier New', monospace !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
  }

  pre code {
    background-color: transparent !important;
    color: inherit !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 0 !important;
  }

  /* 테이블 스타일 */
  table {
    border-collapse: collapse !important;
    width: 100% !important;
    margin: 1rem 0 !important;
  }

  th {
    background-color: #1f2937 !important;
    color: white !important;
    padding: 0.75rem 1.5rem !important;
    text-align: left !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    border-right: 1px solid #374151 !important;
    font-size: 0.875rem !important;
  }

  th:last-child {
    border-right: none !important;
  }

  td {
    padding: 1rem 1.5rem !important;
    font-size: 1rem !important;
    font-weight: 500 !important;
    color: #1f2937 !important;
    white-space: nowrap !important;
  }

  tr {
    background-color: #ffffff !important;
    border-bottom: 1px solid #e5e7eb !important;
  }

  tbody tr:nth-child(even) {
    background-color: #f9fafb !important;
  }

  /* 리스트 스타일 - bullet 포인트 개선 */
  ul, ol {
    margin: 1rem 0 !important;
    margin-left: 1.5rem !important;
  }

  li {
    margin: 0.5rem 0 !important;
    color: #374151 !important;
    line-height: 1.625 !important;
    display: flex !important;
    align-items: flex-start !important;
  }

  li span:first-child {
    color: #3b82f6 !important;
    margin-right: 0.5rem !important;
    margin-top: 0.25rem !important;
  }

  /* HR 스타일 */
  hr {
    border: none !important;
    height: 0.25rem !important;
    background: linear-gradient(to right, #93c5fd, #c4b5fd, #f9a8d4) !important;
    border-radius: 9999px !important;
    opacity: 0.6 !important;
    margin: 2rem 0 !important;
  }

  /* strong, em 스타일 */
  strong {
    font-weight: bold !important;
    color: #2563eb !important;
  }

  em {
    font-style: italic !important;
    color: #9333ea !important;
  }

  /* 링크 스타일 */
  a {
    color: #2563eb !important;
    text-decoration: underline !important;
    font-weight: 500 !important;
  }

  /* 취소선 스타일 개선 */
  del, .line-through {
    text-decoration: none !important;
    position: relative !important;
  }

  del::after, .line-through::after {
    content: '' !important;
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    top: 80% !important;
    height: 1px !important;
    background-color: #6b7280 !important;
  }

  /* 인라인 코드 스타일 개선 */
  code:not(pre code) {
    background-color: #f3f4f6 !important;
    color: #e11d48 !important;
    padding: 0.05rem 0.15rem !important;
    border-radius: 0.2rem !important;
    font-family: 'Monaco', 'Consolas', 'Courier New', monospace !important;
    font-size: 0.875em !important;
    font-weight: 500 !important;
    line-height: 1 !important;
    vertical-align: 0.1em !important;
    display: inline !important;
    border: 1px solid #e5e7eb !important;
  }
`;

// 스타일 적용 유틸리티 함수
export const applyStylesToElement = (element: HTMLElement, styles: string): void => {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  element.appendChild(styleElement);
};

// PDF 최적화 스타일 적용 유틸리티 함수
export const applyPDFOptimizationStyles = (element: HTMLElement): void => {
  const styles: CSSProperties = {
    maxHeight: 'none',
    height: 'auto',
    overflow: 'visible',
    width: '100%',
    display: 'block',
  };

  Object.assign(element.style, styles);
};

// PDF 생성 함수
export const generatePDF = async (
  element: HTMLElement,
  options: PDFOptions = PDF_DEFAULT_OPTIONS,
): Promise<void> => {
  const html2pdf = (await import('html2pdf.js')).default;

  // 스타일 적용
  applyStylesToElement(element, generateTailwindStyles());

  // PDF 최적화 스타일 적용
  applyPDFOptimizationStyles(element);

  // PDF 생성
  await html2pdf().set(options).from(element).save();
};

// React 컴포넌트에서 사용할 수 있는 PDF 내보내기 함수
export const exportToPDF = async (
  previewRef: React.RefObject<HTMLDivElement>,
  customOptions?: Partial<PDFOptions>,
): Promise<void> => {
  if (!previewRef.current) {
    throw new Error('Preview element not found');
  }

  // 프리뷰 내용을 복제
  const element = previewRef.current.cloneNode(true) as HTMLElement;

  // 커스텀 옵션이 있으면 기본 옵션과 병합
  const options = customOptions
    ? { ...PDF_DEFAULT_OPTIONS, ...customOptions }
    : PDF_DEFAULT_OPTIONS;

  // PDF 생성
  await generatePDF(element, options);
};