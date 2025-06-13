import { PDFOptions } from '@/types/markdown';
import { CSSProperties } from 'react';

// PDF 옵션 상수화 및 타입 강화
export const PDF_DEFAULT_OPTIONS: PDFOptions = {
  margin: [10, 10, 10, 10], // mm 단위로 변경하여 더 정확한 여백 설정
  filename: 'markdown-document.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    logging: false,
    allowTaint: true,
    windowHeight: 1080,
    scrollY: 0, // 스크롤 위치 초기화
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  },
  pagebreak: {
    mode: ['avoid-all', 'css', 'legacy'],
    before: ['.page-break-before', '.break-before'],
    after: ['.page-break-after', '.break-after'], 
    avoid: ['pre', 'blockquote', 'table', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr', 'figure'],
  },
  enableLinks: true,
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
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
    break-after: avoid !important;
    break-inside: avoid !important;
  }

  /* 제목과 다음 내용이 함께 유지되도록 */
  h1 + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + * {
    page-break-before: avoid !important;
    break-before: avoid !important;
  }

  /* 목록 항목들이 분리되지 않도록 */
  ul, ol {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  li {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* 코드 블록이 분리되지 않도록 */
  pre {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* 테이블이 분리되지 않도록 */
  table {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* 인용구가 분리되지 않도록 */
  blockquote {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* 이미지와 캡션이 분리되지 않도록 */
  figure {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* 단락의 마지막 줄이 혼자 남지 않도록 */
  p {
    orphans: 3 !important;
    widows: 3 !important;
  }

  /* 페이지 여백 설정 */
  @page {
    margin: 0.5in !important;
    size: a4 !important;
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

  /* 페이지 분할 클래스 */
  .page-break-before {
    page-break-before: always !important;
    break-before: always !important;
  }

  .page-break-after {
    page-break-after: always !important;
    break-after: always !important;
  }

  .keep-with-previous {
    page-break-before: avoid !important;
    break-before: avoid !important;
  }

  /* 블록 요소들의 페이지 분할 방지 */
  .prose > * {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* 마크다운 특정 요소들의 페이지 분할 처리 */
  blockquote {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    border-left: 4px solid #3b82f6 !important;
    padding-left: 1rem !important;
    margin: 1rem 0 !important;
  }

  /* 목록 항목 그룹화 */
  ul > li:first-child,
  ol > li:first-child {
    page-break-before: avoid !important;
    break-before: avoid !important;
  }

  ul > li:last-child,
  ol > li:last-child {
    page-break-after: avoid !important;
    break-after: avoid !important;
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


// Simple OKLCH cleanup function - just removes unsupported color functions
const convertOklchToHex = (styles: string): string => {
  let convertedStyles = styles;
  
  // Simply remove unsupported color functions to prevent parsing errors
  convertedStyles = convertedStyles.replace(/oklch\([^)]+\)/g, '');
  convertedStyles = convertedStyles.replace(/color-mix\([^)]+\)/g, '');
  convertedStyles = convertedStyles.replace(/color\(display-p3[^)]+\)/g, '');
  convertedStyles = convertedStyles.replace(/lch\([^)]+\)/g, '');
  convertedStyles = convertedStyles.replace(/lab\([^)]+\)/g, '');
  
  return convertedStyles;
};

// 스타일 적용 유틸리티 함수
export const applyStylesToElement = (element: HTMLElement, styles: string): void => {
  const styleElement = document.createElement('style');
  styleElement.textContent = convertOklchToHex(styles);
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


// React 컴포넌트에서 사용할 수 있는 PDF 내보내기 함수
export const exportToPDF = async (
  previewRef: React.RefObject<HTMLDivElement | null>,
  customOptions?: Partial<PDFOptions>,
): Promise<void> => {
  if (!previewRef.current) {
    throw new Error('Preview element not found');
  }

  try {
    // html2pdf 동적 임포트
    const html2pdf = (await import('html2pdf.js')).default;
    
    // 프리뷰 내용을 복제
    const element = previewRef.current.cloneNode(true) as HTMLElement;
    
    // 복제된 element를 임시 컨테이너에 추가
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '190mm'; // A4 width minus margins (210mm - 20mm)
    tempContainer.style.backgroundColor = 'white';
    tempContainer.appendChild(element);
    document.body.appendChild(tempContainer);

    // More thorough approach: override computed styles that contain OKLCH
    const replaceOklchInComputedStyles = (el: HTMLElement) => {
      const computedStyle = window.getComputedStyle(el);
      
      // Get the current computed values and override only if they contain OKLCH
      const properties = [
        'background-color', 'color', 'border-color', 'border-top-color',
        'border-right-color', 'border-bottom-color', 'border-left-color'
      ];
      
      properties.forEach(property => {
        const value = computedStyle.getPropertyValue(property);
        if (value && value.includes('oklch')) {
          // Set the computed color directly as hex (browser will convert OKLCH to hex)
          const computedColor = value; // This will be the actual resolved color
          // Force a recalculation by setting a safe fallback
          if (property.includes('background')) {
            el.style.setProperty(property, 'rgb(255, 255, 255)', 'important');
          } else if (property.includes('color') && !property.includes('background')) {
            el.style.setProperty(property, 'rgb(0, 0, 0)', 'important');
          } else if (property.includes('border')) {
            el.style.setProperty(property, 'rgb(229, 231, 235)', 'important');
          }
        }
      });
      
      // Clean inline styles
      if (el.style.cssText) {
        el.style.cssText = el.style.cssText.replace(/oklch\([^)]+\)/g, 'transparent');
        el.style.cssText = el.style.cssText.replace(/color-mix\([^)]+\)/g, 'transparent');
      }
      
      // Process children
      Array.from(el.children).forEach(child => {
        if (child instanceof HTMLElement) {
          replaceOklchInComputedStyles(child);
        }
      });
    };

    // Also inject a style that overrides all CSS custom properties with OKLCH
    const overrideOklchVariables = () => {
      const overrideStyle = document.createElement('style');
      overrideStyle.textContent = `
        /* Override OKLCH CSS variables for PDF generation */
        .pdf-generation-override {
          --color-red-50: #fef2f2 !important;
          --color-red-200: #fecaca !important;
          --color-red-300: #fca5a5 !important;
          --color-red-700: #b91c1c !important;
          --color-red-800: #991b1b !important;
          --color-red-900: #7f1d1d !important;
          --color-orange-600: #ea580c !important;
          --color-orange-700: #c2410c !important;
          --color-yellow-50: #fefce8 !important;
          --color-yellow-200: #fef08a !important;
          --color-yellow-300: #fde047 !important;
          --color-yellow-800: #854d0e !important;
          --color-yellow-900: #713f12 !important;
          --color-green-50: #f0fdf4 !important;
          --color-green-100: #dcfce7 !important;
          --color-green-200: #bbf7d0 !important;
          --color-green-300: #86efac !important;
          --color-green-400: #4ade80 !important;
          --color-green-500: #22c55e !important;
          --color-green-600: #16a34a !important;
          --color-green-700: #15803d !important;
          --color-green-800: #166534 !important;
          --color-green-900: #14532d !important;
          --color-blue-50: #eff6ff !important;
          --color-blue-300: #93c5fd !important;
          --color-blue-400: #60a5fa !important;
          --color-blue-500: #3b82f6 !important;
          --color-blue-600: #2563eb !important;
          --color-blue-700: #1d4ed8 !important;
          --color-blue-800: #1e40af !important;
          --color-blue-900: #1e3a8a !important;
          --color-purple-50: #faf5ff !important;
          --color-purple-100: #f3e8ff !important;
          --color-purple-300: #c4b5fd !important;
          --color-purple-400: #a78bfa !important;
          --color-purple-500: #8b5cf6 !important;
          --color-purple-600: #7c3aed !important;
          --color-purple-700: #6d28d9 !important;
          --color-purple-900: #581c87 !important;
          --color-pink-100: #fce7f3 !important;
          --color-pink-200: #fbcfe8 !important;
          --color-pink-300: #f9a8d4 !important;
          --color-pink-700: #be185d !important;
          --color-pink-900: #9d174d !important;
          --color-gray-50: #f9fafb !important;
          --color-gray-100: #f3f4f6 !important;
          --color-gray-200: #e5e7eb !important;
          --color-gray-300: #d1d5db !important;
          --color-gray-400: #9ca3af !important;
          --color-gray-500: #6b7280 !important;
          --color-gray-600: #4b5563 !important;
          --color-gray-700: #374151 !important;
          --color-gray-800: #1f2937 !important;
          --color-gray-900: #111827 !important;
          --color-black: #000000 !important;
          --color-white: #ffffff !important;
        }
      `;
      tempContainer.appendChild(overrideStyle);
    };

    // Apply the class and override styles
    element.classList.add('pdf-generation-override');
    overrideOklchVariables();
    
    replaceOklchInComputedStyles(element);
    
    // 스타일 적용
    applyStylesToElement(element, generateTailwindStyles());
    applyPDFOptimizationStyles(element);

    // 페이지 분할을 위한 추가 처리
    prepareContentForPDF(element);

    // 커스텀 옵션이 있으면 기본 옵션과 병합
    const options = customOptions
      ? { ...PDF_DEFAULT_OPTIONS, ...customOptions }
      : PDF_DEFAULT_OPTIONS;

    // 현재 스크롤 위치 저장 및 초기화
    const currentScrollY = window.scrollY;
    window.scrollTo(0, 0);

    // PDF 생성
    await html2pdf().set(options).from(element).save();
    
    // 스크롤 위치 복원
    window.scrollTo(0, currentScrollY);
    
    // Clean up - remove class and temporary container
    element.classList.remove('pdf-generation-override');
    document.body.removeChild(tempContainer);
  } catch (error) {
    console.error('PDF 생성 중 오류:', error);
    throw error;
  }
};

// PDF를 위한 콘텐츠 준비 함수
const prepareContentForPDF = (element: HTMLElement): void => {
  // 모든 이미지가 로드되었는지 확인
  const images = element.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.complete) {
      img.style.display = 'none';
    }
  });

  // 긴 코드 블록에 대한 처리
  const codeBlocks = element.querySelectorAll('pre');
  codeBlocks.forEach((pre) => {
    // 코드 블록이 너무 길면 페이지 분할 클래스 추가
    if (pre.scrollHeight > 600) {
      pre.classList.add('page-break-before');
    }
  });

  // 테이블에 대한 처리
  const tables = element.querySelectorAll('table');
  tables.forEach((table) => {
    // 테이블이 너무 길면 페이지 분할 클래스 추가
    if (table.scrollHeight > 600) {
      table.classList.add('page-break-before');
    }
  });

  // 제목 요소들에 대한 처리
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    // 페이지 하단에 제목이 위치하지 않도록 처리
    const nextElement = heading.nextElementSibling;
    if (nextElement) {
      const headingRect = heading.getBoundingClientRect();
      const nextRect = nextElement.getBoundingClientRect();
      
      // 제목과 다음 요소 사이의 거리가 너무 크면 함께 유지
      if (nextRect.top - headingRect.bottom > 100) {
        (heading as HTMLElement).style.pageBreakAfter = 'avoid';
        nextElement.classList.add('keep-with-previous');
      }
    }
  });
};