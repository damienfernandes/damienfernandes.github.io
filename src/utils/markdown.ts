// src/utils/markdown.ts

/**
 * Échappe les caractères HTML puis convertit le Markdown inline (**gras**, *italique*, `code`)
 * en balises HTML sûres pour les templates Astro (via set:html).
 */
export function renderInlineMarkdownHtml(input: unknown): string {
  if (input === undefined || input === null) return '';
  const escaped = String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
}

/**
 * Parse une chaîne Markdown inline (**gras**, *italique*, `code`) et ajoute
 * des nœuds DOM sûrs (strong, em, code, textNode) dans l'élément parent côté client.
 */
export function appendInlineMarkdown(parent: HTMLElement, text: string): void {
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const strong = document.createElement('strong');
      strong.textContent = part.slice(2, -2);
      parent.append(strong);
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const em = document.createElement('em');
      em.textContent = part.slice(1, -1);
      parent.append(em);
    } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const code = document.createElement('code');
      code.textContent = part.slice(1, -1);
      parent.append(code);
    } else {
      parent.append(document.createTextNode(part));
    }
  }
}