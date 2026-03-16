/**
 * Markdown preprocessing for extended syntax that rehype-raw can handle.
 * Protects math blocks ($$..$$, $..$) and code blocks (```...```, `...`) from transformation.
 */

/**
 * Preprocess markdown to support extended syntax:
 * - ==highlight== → <mark>highlight</mark>
 *
 * Note: ^superscript^ and ~subscript~ are NOT preprocessed because they
 * conflict with LaTeX math (^) and strikethrough (~~). Use <sup>/<sub> HTML instead.
 */
export const preprocessMarkdown = (markdown: string): string => {
  if (!markdown) return markdown;

  // Protect code blocks and inline code/math from transformation
  const preserved: Array<{ placeholder: string; original: string }> = [];
  let counter = 0;

  const protect = (match: string): string => {
    const placeholder = `\x00PROTECT${counter++}\x00`;
    preserved.push({ placeholder, original: match });
    return placeholder;
  };

  let result = markdown
    // Protect fenced code blocks (```...```)
    .replace(/```[\s\S]*?```/g, protect)
    // Protect inline code (`...`)
    .replace(/`[^`\n]+`/g, protect)
    // Protect block math ($$...$$)
    .replace(/\$\$[\s\S]*?\$\$/g, protect)
    // Protect inline math ($...$)
    .replace(/\$[^$\n]+\$/g, protect);

  // Apply transformations on unpreserved text
  result = result
    // **bold** → <strong> (handles CJK edge cases where CommonMark
    // right-flanking delimiter rules fail, e.g. **52주(1년)**까지)
    .replace(/\*\*((?:(?!\*\*).)+?)\*\*/g, '<strong>$1</strong>')
    // ==highlight== → <mark>
    .replace(/==((?:(?!==).)+)==/g, '<mark>$1</mark>');

  // Restore preserved content
  for (const { placeholder, original } of preserved) {
    result = result.replace(placeholder, original);
  }

  return result;
};
