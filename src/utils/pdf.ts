import { PDFOptions } from '@/types/markdown';

// PDF 옵션 상수화 및 타입 강화 (레거시 호환용)
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

// 스타일 적용 유틸리티 함수
export const applyStylesToElement = (element: HTMLElement, styles: string): void => {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  element.insertBefore(styleElement, element.firstChild);
};

// PDF 내보내기 함수 - 브라우저 네이티브 print 사용
// window.print()는 브라우저의 동일한 CSS 렌더링 엔진을 사용하므로
// 미리보기와 100% 동일한 출력을 생성합니다.
export const exportToPDF = async (
  previewRef: React.RefObject<HTMLDivElement | null>,
  _customOptions?: Partial<PDFOptions>,
): Promise<void> => {
  if (!previewRef.current) {
    throw new Error('Preview element not found');
  }

  try {
    // pdf-printing 클래스를 html과 body 모두에 추가하여 print CSS 활성화
    // html 요소도 overflow/height 리셋이 필요하므로 반드시 둘 다 추가
    document.documentElement.classList.add('pdf-printing');
    document.body.classList.add('pdf-printing');

    // beforeprint/afterprint 이벤트로 클래스 정리 보장
    const cleanup = () => {
      document.documentElement.classList.remove('pdf-printing');
      document.body.classList.remove('pdf-printing');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    // 브라우저의 기본 인쇄 기능을 사용하여 PDF 생성
    // @media print + .pdf-printing CSS가 globals.css에 정의되어 있어
    // 미리보기 영역만 출력되고 에디터/헤더는 숨겨집니다.
    window.print();

    // 사용자가 인쇄 대화상자를 취소한 경우를 위한 폴백 정리
    // afterprint 이벤트가 발생하지 않는 브라우저를 위해
    setTimeout(() => {
      document.documentElement.classList.remove('pdf-printing');
      document.body.classList.remove('pdf-printing');
    }, 1000);
  } catch (error) {
    document.documentElement.classList.remove('pdf-printing');
    document.body.classList.remove('pdf-printing');
    console.error('PDF 생성 중 오류:', error);
    throw error;
  }
};
