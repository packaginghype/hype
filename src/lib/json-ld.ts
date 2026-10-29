/** Pull JSON-LD payloads from raw JSON or <script type="application/ld+json"> tags. */
export function extractJsonLdBlocks(raw: string | null | undefined): string[] {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return [];

  const tagged = [
    ...trimmed.matchAll(
      /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ].map((match) => match[1].trim());

  const chunks = tagged.length > 0 ? tagged : [trimmed];
  const blocks: string[] = [];

  for (const chunk of chunks) {
    if (!chunk) continue;
    try {
      const parsed = JSON.parse(chunk) as unknown;
      if (parsed && typeof parsed === "object") {
        blocks.push(JSON.stringify(parsed).replace(/</g, "\\u003c"));
      }
    } catch {
      // Invalid JSON is ignored on the public page but still stored in CMS.
    }
  }

  return blocks;
}

export function jsonLdInputStatus(
  raw: string | null | undefined
): "empty" | "valid" | "invalid" {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "empty";
  return extractJsonLdBlocks(trimmed).length > 0 ? "valid" : "invalid";
}
