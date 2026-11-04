import { getGeneralSettings } from "@/lib/general-settings";

function absoluteFaviconUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(url || "/favicon.png", site).toString();
}

/** Streams the favicon saved in General Settings so the browser tab uses the upload. */
export async function faviconResponse() {
  const settings = await getGeneralSettings();
  const target = absoluteFaviconUrl(settings.faviconUrl);

  try {
    const upstream = await fetch(target, { cache: "no-store" });
    if (!upstream.ok) {
      return new Response(null, { status: 404 });
    }
    const bytes = await upstream.arrayBuffer();
    const type = upstream.headers.get("content-type") || "image/png";
    return new Response(bytes, {
      headers: {
        "Content-Type": type.split(";")[0] || "image/png",
        "Cache-Control": "public, max-age=300, must-revalidate",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
