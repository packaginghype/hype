import { faviconResponse } from "@/lib/favicon-response";

export const dynamic = "force-dynamic";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return faviconResponse();
}
