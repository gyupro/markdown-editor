'use client';

import React, { useEffect, useRef, useState } from 'react';

// Check if a CSS color is "light" (high luminance) so we need dark text
const isLightColor = (color: string): boolean => {
  let r = 0, g = 0, b = 0;
  const hex = color.replace(/\s/g, '');
  if (hex.startsWith('#')) {
    const h = hex.slice(1);
    if (h.length === 3) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
    } else if (h.length >= 6) {
      r = parseInt(h.slice(0, 2), 16);
      g = parseInt(h.slice(2, 4), 16);
      b = parseInt(h.slice(4, 6), 16);
    }
  } else if (hex.startsWith('rgb')) {
    const match = hex.match(/(\d+)/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0]); g = parseInt(match[1]); b = parseInt(match[2]);
    }
  } else {
    return false;
  }
  // Relative luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
};

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
        // Post-process SVG
        let processedSvg = renderedSvg
          // ==text== → highlighted text
          .replace(/==([^=]+)==/g, '<tspan font-weight="bold" fill="#ffd54f">$1</tspan>');

        // Fix contrast: inject CSS into SVG to make text dark on light backgrounds
        // Parse the SVG as HTML (handles br tags) to find light fills, then inject a style fix
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedSvg;
        const svgEl = tempDiv.querySelector('svg');
        if (svgEl) {
          // Find all rects/paths with light fill colors and collect their parent class/ids
          const lightParents = new Set<string>();
          svgEl.querySelectorAll('rect, path, polygon').forEach((el) => {
            const fill = el.getAttribute('fill') || '';
            const styleFill = (el.getAttribute('style') || '').match(/fill:\s*([^;]+)/)?.[1]?.trim() || '';
            const effectiveFill = styleFill || fill;
            if (effectiveFill && isLightColor(effectiveFill)) {
              // Mark parent g/cluster for dark text
              const parent = el.closest('.cluster, .node, .label');
              if (parent) {
                const cls = parent.getAttribute('id') || parent.getAttribute('class') || '';
                lightParents.add(cls);
                // Directly fix text elements within this group
                parent.querySelectorAll('span, p, text, tspan, div, .nodeLabel').forEach((t) => {
                  const htmlEl = t as HTMLElement;
                  htmlEl.style.color = '#1a1a1a';
                  if (t.tagName === 'text' || t.tagName === 'tspan') {
                    t.setAttribute('fill', '#1a1a1a');
                  }
                });
              }
            }
          });
          processedSvg = tempDiv.innerHTML;
        }
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
