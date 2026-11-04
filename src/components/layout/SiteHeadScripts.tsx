import {
  attrsToReactProps,
  parseHeadHtml,
  type ParsedHeadNode,
} from "@/lib/parse-site-scripts";

function renderNode(node: ParsedHeadNode, index: number) {
  const key = `site-head-${node.kind}-${index}`;

  if (node.kind === "meta") {
    return <meta key={key} {...attrsToReactProps(node.attrs)} />;
  }
  if (node.kind === "link") {
    return <link key={key} {...attrsToReactProps(node.attrs)} />;
  }
  if (node.kind === "style") {
    return (
      <style
        key={key}
        {...attrsToReactProps(node.attrs)}
        dangerouslySetInnerHTML={{ __html: node.content }}
      />
    );
  }
  if (node.kind === "noscript") {
    return (
      <noscript
        key={key}
        dangerouslySetInnerHTML={{ __html: node.content }}
      />
    );
  }
  if (node.kind === "script") {
    const props = attrsToReactProps(node.attrs);
    const { src, ...rest } = props;
    if (src) {
      return <script key={key} src={src} {...rest} />;
    }
    return (
      <script
        key={key}
        {...rest}
        dangerouslySetInnerHTML={{ __html: node.content }}
      />
    );
  }
  return null;
}

/** Server-renders enabled header scripts into the real HTML head. */
export function SiteHeadScripts({ html }: { html: string }) {
  const nodes = parseHeadHtml(html);
  if (nodes.length === 0) return null;
  return <>{nodes.map((node, index) => renderNode(node, index))}</>;
}
