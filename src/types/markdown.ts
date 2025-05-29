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
  };
  jsPDF: {
    unit: string;
    format: string;
    orientation: string;
  };
} 