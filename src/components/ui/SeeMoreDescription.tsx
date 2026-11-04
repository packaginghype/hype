"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { RichText } from "@/components/ui/RichText";

type Props = {
  title: string;
  html?: string | null;
  paragraphs?: string[];
  /** Approx visible lines before See More. Default 6. */
  lines?: number;
  lineHeight?: number;
  className?: string;
  /** Fade/button background — match the section behind the text. */
  fadeFrom?: string;
};

export function SeeMoreDescription({
  title,
  html,
  paragraphs,
  lines = 6,
  lineHeight = 1.65,
  className = "",
  fadeFrom = "#E8F5F2",
}: Props) {
  const [open, setOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const maxHeight = `${lines * lineHeight}em`;
  const hasHtml = Boolean(html?.trim());
  const hasParagraphs = Boolean(paragraphs?.length);

  useEffect(() => {
    const check = () => {
      const el = ref.current;
      if (!el) return;
      setIsOverflowing(el.scrollHeight - el.clientHeight > 1);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [html, paragraphs, lines, lineHeight]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!hasHtml && !hasParagraphs) return null;

  return (
    <>
      <div className={`relative mt-3 ${className}`}>
        <div
          ref={ref}
          style={{ maxHeight }}
          className="overflow-hidden text-left text-[13.5px] leading-[1.65] text-[#2a2a2a] sm:text-[14px] [&_p]:mb-2.5 [&_p:last-child]:mb-0"
        >
          {hasHtml ? (
            <RichText html={html!} className="text-left" />
          ) : (
            paragraphs!.map((p, i) => (
              <p key={i} className="text-left">
                {p}
              </p>
            ))
          )}
        </div>

        {isOverflowing ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute bottom-0 right-0 cursor-pointer pl-1 text-[13px] font-semibold leading-[1.65] text-[#FF5548] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5548]/40"
            style={{ backgroundColor: fadeFrom }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-full w-10"
              style={{
                background: `linear-gradient(to right, transparent, ${fadeFrom})`,
              }}
            />
            … See More
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="Close description"
            className="absolute inset-0 bg-[#0F1839]/55 backdrop-blur-[3px]"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex max-h-[min(78vh,640px)] w-full max-w-2xl flex-col overflow-hidden rounded-[14px] border border-white/20 bg-white shadow-[0_24px_80px_-20px_rgba(15,24,57,0.55)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#EEF1F6] px-5 py-4">
              <h2
                id={titleId}
                className="text-lg font-extrabold leading-snug text-[#172455]"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-md p-2 text-[#6B7280] transition-colors hover:bg-[#F6F8FA] hover:text-[#172455]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 text-left text-[14.5px] leading-[1.75] text-[#444] [&>p]:mb-3 [&>p:last-child]:mb-0">
              {hasHtml ? (
                <RichText html={html!} />
              ) : (
                paragraphs!.map((p, i) => <p key={i}>{p}</p>)
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
