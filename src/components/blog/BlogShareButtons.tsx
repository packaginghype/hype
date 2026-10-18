"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

export function BlogShareButtons({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (typeof window !== "undefined") {
      const shareUrl = url || window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function shareNative() {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title,
        url: url || window.location.href,
      }).catch(() => {});
    } else {
      copyLink();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#172455] transition-all hover:border-[#172455] hover:bg-gray-50"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-600" />
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-gray-500" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={shareNative}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#172455] transition-all hover:border-[#172455] hover:bg-gray-50"
        title="Share"
      >
        <Share2 className="h-3.5 w-3.5 text-gray-500" />
        <span>Share</span>
      </button>
    </div>
  );
}
