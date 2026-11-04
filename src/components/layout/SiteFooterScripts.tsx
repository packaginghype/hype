"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Footer scripts run in the body. Header tags are server-rendered separately. */
export function SiteFooterScripts({ html }: { html?: string }) {
  const pathname = usePathname() ?? "";

  useEffect(() => {
    if (!html?.trim()) return;
    if (pathname.startsWith("/admin")) return;

    const parent = document.body;
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const inserted: Node[] = [];

    Array.from(template.content.childNodes).forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const source = node as HTMLScriptElement;
        const script = document.createElement("script");
        Array.from(source.attributes).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });
        if (source.textContent) script.textContent = source.textContent;
        parent.appendChild(script);
        inserted.push(script);
        return;
      }
      const cloned = node.cloneNode(true);
      parent.appendChild(cloned);
      inserted.push(cloned);
    });

    return () => {
      inserted.forEach((node) => {
        if (node.parentNode) node.parentNode.removeChild(node);
      });
    };
  }, [html, pathname]);

  return null;
}
