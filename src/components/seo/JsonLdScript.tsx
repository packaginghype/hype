import { extractJsonLdBlocks } from "@/lib/json-ld";

export function JsonLdScript({ source }: { source?: string | null }) {
  const trimmed = (source ?? "").trim();
  if (!trimmed) return null;

  const blocks = extractJsonLdBlocks(trimmed);
  if (blocks.length > 0) {
    return (
      <>
        {blocks.map((json, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
          />
        ))}
      </>
    );
  }

  // Fallback 1: If it's already wrapped in <script> tags, render directly
  if (/<script\b/i.test(trimmed)) {
    return <div dangerouslySetInnerHTML={{ __html: trimmed }} />;
  }

  // Fallback 2: If it looks like raw JSON ({...} or [...]), wrap it in a JSON-LD script tag
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }

  return null;
}
