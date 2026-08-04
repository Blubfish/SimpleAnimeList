import DOMPurify, { WindowLike } from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify( window as unknown as WindowLike);

export function sanitizeDescription(html: string): string{
    const normalize = html.replace(/(<br\s*\/?>)+/gi, "").replace(/\(Source:.*?\)/gi, "").trim()
    return purify.sanitize( normalize, {
            ALLOWED_TAGS: ["br", "b", "i", "em", "strong", "a", "p"],
            ALLOWED_ATTR: ["href"],
    })
};