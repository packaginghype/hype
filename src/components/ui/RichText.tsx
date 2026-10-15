import { looksLikeHtml } from "@/lib/html";
import { cn } from "@/lib/utils";

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

  return (
    <div
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
