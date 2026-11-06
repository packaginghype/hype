/** Convert common YouTube / Vimeo watch URLs into embeddable iframe src. */
export function toVideoEmbedUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const url = raw.trim();

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id =
        parsed.searchParams.get("v") ||
        parsed.pathname.match(/\/embed\/([^/]+)/)?.[1] ||
        parsed.pathname.match(/\/shorts\/([^/]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    if (host === "player.vimeo.com") {
      return url;
    }
  } catch {
    return null;
  }

  return null;
}
