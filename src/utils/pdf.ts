import { PDFOptions } from '@/types/markdown';

// PDF 옵션 상수화 및 타입 강화
export const PDF_DEFAULT_OPTIONS: PDFOptions = {
  margin: [10, 10, 10, 10],
  filename: 'markdown-document.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    logging: false,
    allowTaint: true,
    windowHeight: 1080,
    scrollY: 0,
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

// OKLCH to Hex 변환 함수
// 브라우저의 CSS 색상 파싱을 사용하여 OKLCH를 RGB로 변환
const oklchToHex = (oklchString: string): string | null => {
  try {
    // 임시 요소를 사용해 브라우저가 색상을 파싱하도록 함
    const temp = document.createElement('div');
    temp.style.color = oklchString;
    document.body.appendChild(temp);
    const computedColor = getComputedStyle(temp).color;
    document.body.removeChild(temp);

    // rgb(r, g, b) 형식을 hex로 변환
    const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return null;
  } catch {
    return null;
  }
};

// CSS 내의 모든 OKLCH 색상을 hex로 변환
const convertOklchInCss = (css: string): string => {
  // oklch(...) 패턴 찾기 및 변환
  return css.replace(/oklch\([^)]+\)/gi, (match) => {
    const hex = oklchToHex(match);
    return hex || 'transparent';
  }).replace(/oklab\([^)]+\)/gi, (match) => {
    const hex = oklchToHex(match);
    return hex || 'transparent';
  }).replace(/color-mix\([^)]+\)/gi, 'transparent')
    .replace(/lch\([^)]+\)/gi, 'transparent')
    .replace(/lab\([^)]+\)/gi, 'transparent');
};

// 스타일 적용 유틸리티 함수
export const applyStylesToElement = (element: HTMLElement, styles: string): void => {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  element.insertBefore(styleElement, element.firstChild);
};

// PDF 내보내기 함수
export const exportToPDF = async (
  previewRef: React.RefObject<HTMLDivElement | null>,
  customOptions?: Partial<PDFOptions>,
): Promise<void> => {
  if (!previewRef.current) {
    throw new Error('Preview element not found');
  }

  try {
    // 현재 테마 감지
    const isDarkMode = document.documentElement.classList.contains('dark');

    // html2pdf 동적 임포트
    const html2pdf = (await import('html2pdf.js')).default;

    // 프리뷰 내용을 복제
    const element = previewRef.current.cloneNode(true) as HTMLElement;

    // 임시 컨테이너 생성
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '190mm';
    document.body.appendChild(tempContainer);
    tempContainer.appendChild(element);

    // html2canvas onclone 콜백에서 OKLCH 색상 변환
    const html2canvasOptions = {
      ...PDF_DEFAULT_OPTIONS.html2canvas,
      onclone: (clonedDoc: Document) => {
        // 모든 스타일시트의 OKLCH 색상을 hex로 변환
        clonedDoc.querySelectorAll('style').forEach((style) => {
          if (style.textContent) {
            style.textContent = convertOklchInCss(style.textContent);
          }
        });

        // 인라인 스타일의 OKLCH 색상 변환
        clonedDoc.querySelectorAll('*').forEach((elem) => {
          const el = elem as HTMLElement;
          const inlineStyle = el.getAttribute('style');
          if (inlineStyle && (inlineStyle.includes('oklch') || inlineStyle.includes('oklab'))) {
            el.setAttribute('style', convertOklchInCss(inlineStyle));
          }
        });

        // PDF 전용 스타일 추가
        const pdfStyle = clonedDoc.createElement('style');
        pdfStyle.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            margin: 0.5in;
            size: a4;
          }

          /* 페이지 나눔 방지 */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            break-after: avoid;
          }

          pre, blockquote, table, ul, ol, figure {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* 앵커 링크 숨기기 */
          h1 > a, h2 > a, h3 > a {
            display: none !important;
          }
        `;
        clonedDoc.head.appendChild(pdfStyle);
      }
    };

    const options = {
      ...(customOptions ? { ...PDF_DEFAULT_OPTIONS, ...customOptions } : PDF_DEFAULT_OPTIONS),
      html2canvas: html2canvasOptions
    };

    // 현재 스크롤 위치 저장
    const currentScrollY = window.scrollY;
    window.scrollTo(0, 0);

    // PDF 생성
    await html2pdf().set(options).from(element).save();

    // 스크롤 위치 복원 및 정리
    window.scrollTo(0, currentScrollY);
    document.body.removeChild(tempContainer);

  } catch (error) {
    console.error('PDF 생성 중 오류:', error);
    throw error;
  }
};
