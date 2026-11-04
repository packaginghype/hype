import {
  splitScriptsByPlacement,
  type CustomScript,
} from "@/lib/custom-scripts";

export type ParsedAttrMap = Record<string, string>;

export type ParsedHeadNode =
  | { kind: "meta"; attrs: ParsedAttrMap }
  | { kind: "link"; attrs: ParsedAttrMap }
  | { kind: "style"; attrs: ParsedAttrMap; content: string }
  | { kind: "noscript"; content: string }
  | { kind: "script"; attrs: ParsedAttrMap; content: string };

function parseAttributes(attrString: string): ParsedAttrMap {
  const attrs: ParsedAttrMap = {};
  const attrRegex =
    /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(attrString)) !== null) {
    const name = match[1].toLowerCase();
    if (!name || name === "/") continue;
    attrs[name] = match[2] ?? match[3] ?? match[4] ?? "true";
  }
  return attrs;
}

export function attrsToReactProps(attrs: ParsedAttrMap): ParsedAttrMap {
  const props: ParsedAttrMap = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") props.className = value;
    else if (key === "for") props.htmlFor = value;
    else if (key === "http-equiv") props.httpEquiv = value;
    else if (key === "crossorigin") props.crossOrigin = value;
    else if (key === "charset") props.charSet = value;
    else props[key] = value;
  }
  return props;
}

/** Parse pasted head HTML so tags can be server-rendered inside <head>. */
export function parseHeadHtml(html: string): ParsedHeadNode[] {
  if (!html?.trim()) return [];

  const nodes: ParsedHeadNode[] = [];
  const cleaned = html.replace(/<!--[\s\S]*?-->/g, "").trim();
  const tagRegex =
    /<(meta|link|script|style|noscript)(\s[^>]*)?\s*(?:\/>|>[\s\S]*?<\/\1\s*>|>)/gi;

  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(cleaned)) !== null) {
    const full = match[0];
    const tag = match[1].toLowerCase();
    const openMatch = full.match(new RegExp(`^<${tag}([^>]*)>`, "i"));
    const attrRaw = openMatch?.[1]?.replace(/\/\s*$/, "") || "";
    const attrs = parseAttributes(attrRaw);

    if (tag === "meta") {
      nodes.push({ kind: "meta", attrs });
      continue;
    }
    if (tag === "link") {
      nodes.push({ kind: "link", attrs });
      continue;
    }
    if (tag === "script") {
      const contentMatch = full.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      nodes.push({
        kind: "script",
        attrs,
        content: contentMatch?.[1] ?? "",
      });
      continue;
    }
    if (tag === "style") {
      const contentMatch = full.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      nodes.push({
        kind: "style",
        attrs,
        content: contentMatch?.[1] ?? "",
      });
      continue;
    }
    if (tag === "noscript") {
      const contentMatch = full.match(/<noscript[^>]*>([\s\S]*?)<\/noscript>/i);
      nodes.push({
        kind: "noscript",
        content: contentMatch?.[1] ?? "",
      });
    }
  }

  if (nodes.length === 0 && /google-site-verification/i.test(cleaned)) {
    const content =
      cleaned.match(/content=["']([^"']+)["']/i)?.[1] ||
      cleaned.match(/content=([^\s>]+)/i)?.[1];
    if (content) {
      nodes.push({
        kind: "meta",
        attrs: { name: "google-site-verification", content },
      });
    }
  }

  return nodes;
}

export function getEnabledHeadHtml(scripts: CustomScript[]): string {
  return splitScriptsByPlacement(scripts).header;
}

export function getEnabledFooterHtml(scripts: CustomScript[]): string {
  return splitScriptsByPlacement(scripts).footer;
}

export function extractGoogleSiteVerification(
  html: string
): string | undefined {
  const nodes = parseHeadHtml(html);
  for (const node of nodes) {
    if (
      node.kind === "meta" &&
      (node.attrs.name || "").toLowerCase() === "google-site-verification" &&
      node.attrs.content
    ) {
      return node.attrs.content;
    }
  }
  return undefined;
}
