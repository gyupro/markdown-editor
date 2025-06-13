declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type: string;
      quality: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      logging?: boolean;
      allowTaint?: boolean;
      windowHeight?: number;
      scrollY?: number;
    };
    jsPDF?: {
      unit: string;
      format: string | number[];
      orientation: string;
    };
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
    enableLinks?: boolean;
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance;
    from(element: Element): Html2PdfInstance;
    save(): Promise<void>;
    save(filename: string): Promise<void>;
    toPdf(): Html2PdfInstance;
    get(type: string): Promise<any>;
  }

  function html2pdf(): Html2PdfInstance;
  function html2pdf(element: Element, options?: Html2PdfOptions): Promise<void>;
  
  export default html2pdf;
} 