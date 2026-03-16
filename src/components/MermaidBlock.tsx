'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MermaidBlockProps {
  code: string;
}

const MermaidBlock: React.FC<MermaidBlockProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'strict',
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
        });

        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, code);
        // Post-process: convert ==text== to highlighted text in SVG
        const processedSvg = renderedSvg.replace(
          /==([^=]+)==/g,
          '<tspan font-weight="bold" fill="#ffd54f">$1</tspan>'
        );
        setSvg(processedSvg);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Mermaid rendering failed');
        setSvg('');
      }
    };

    renderMermaid();
  }, [code]);

  if (error) {
    return (
      <div
        className="my-6 p-4 rounded-lg"
        style={{
          background: 'var(--code-bg)',
          border: '1px solid var(--border)',
          color: '#ff6b6b',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '0.85rem',
        }}
      >
        <div className="text-xs uppercase tracking-wider mb-2 opacity-60">Mermaid Error</div>
        <pre className="whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        className="my-6 p-8 rounded-lg flex items-center justify-center"
        style={{
          background: 'var(--code-bg)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        Loading diagram...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 md:my-8 rounded-lg overflow-hidden flex justify-center p-4"
      style={{
        background: 'var(--code-bg)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 30px var(--shadow-color)',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidBlock;
