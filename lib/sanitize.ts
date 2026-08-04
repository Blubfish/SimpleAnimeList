// lib/sanitize.ts
import sanitizeHtml from "sanitize-html";

export function sanitizeDescription(html: string): string {
  const normalized = html
    .replace(/(<br\s*\/?>)+/gi, "")
    .replace(/\(Source:.*?\)/gi, "")
    .trim();
  return sanitizeHtml(normalized, {
    allowedTags: ["br", "b", "i", "em", "strong", "a", "p"],
    allowedAttributes: {
      a: ["href"],
    },
  });
}
