/**
 * Markdown preprocessing for extended syntax that rehype-raw can handle.
 * Transforms custom syntax into HTML tags before ReactMarkdown processes them.
 */

/**
 * Preprocess markdown to support extended syntax:
 * - ==highlight== → <mark>highlight</mark>
 * - ^superscript^ → <sup>superscript</sup>  (but not ^^)
 * - ~subscript~ → <sub>subscript</sub>  (but not ~~strikethrough~~)
 */
export const preprocessMarkdown = (markdown: string): string => {
  if (!markdown) return markdown;

  return markdown
    // ==highlight== → <mark>
    .replace(/==((?:(?!==).)+)==/g, '<mark>$1</mark>')
    // ^superscript^ → <sup> (single carets only, not inside code blocks)
    .replace(/\^((?:(?!\^).)+)\^/g, '<sup>$1</sup>')
    // ~single subscript~ → <sub> (only single tildes, avoid ~~strikethrough~~)
    .replace(/(?<![~])~(?!~)((?:(?!~).)+)~(?!~)/g, '<sub>$1</sub>');
};
