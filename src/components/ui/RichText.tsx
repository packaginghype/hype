import { looksLikeHtml } from "@/lib/html";
import { cn } from "@/lib/utils";

function cleanHtmlContent(raw: string): string {
  if (!raw) return "";
  // Strip empty paragraphs or linebreaks at the beginning of the content block
  return raw.replace(/^(?:\s*<(?:p|div)[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/(?:p|div)>)+/gi, "").trim();
}

export function RichText({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  if (!html?.trim()) return null;

  if (!looksLikeHtml(html)) {
    return (
      <div className={cn("rich-text", className)}>
        {html.split(/\n+/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    );
  }

  const cleaned = cleanHtmlContent(html);

  return (
    <div
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}
