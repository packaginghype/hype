import { extractJsonLdBlocks } from "@/lib/json-ld";

export function JsonLdScript({ source }: { source?: string | null }) {
  const blocks = extractJsonLdBlocks(source);
  if (blocks.length === 0) return null;

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
