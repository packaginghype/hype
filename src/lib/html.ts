export function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function looksLikeHtml(value = "") {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function isEmptyHtml(html = "") {
  return !stripHtml(html);
}
