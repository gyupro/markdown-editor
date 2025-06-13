export interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface MarkdownComponents {
  [key: string]: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
}

export interface PDFOptions {
  margin: number[];
  filename: string;
  image: {
    type: string;
    quality: number;
  };
  html2canvas: {
    scale: number;
    useCORS: boolean;
    letterRendering: boolean;
    logging?: boolean;
    allowTaint?: boolean;
    windowHeight?: number;
    scrollY?: number;
  };
  jsPDF: {
    unit: string;
    format: string;
    orientation: string;
  };
  pagebreak?: {
    mode: string | string[];
    before?: string | string[];
    after?: string | string[];
    avoid?: string | string[];
  };
  enableLinks?: boolean;
}

export type MobileTab = 'editor' | 'preview';

export interface ToolbarHandlers {
  onHeading: (level: number) => void;
  onBold: () => void;
  onItalic: () => void;
  onStrikethrough: () => void;
  onInlineCode: () => void;
  onLink: () => void;
  onImage: () => void;
  onBulletList: () => void;
  onNumberedList: () => void;
  onQuote: () => void;
  onTable: () => void;
  onCodeBlock: () => void;
  onCopy: () => void;
  onExportPDF: () => void;
  onSelectAll: () => void;
  onAI: () => void;
} 