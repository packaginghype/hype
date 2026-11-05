import { z } from "zod";
import type { CSSProperties } from "react";
import { isHexDark } from "@/lib/page-widgets";

const hexColorSchema = z
  .string()
  .optional()
  .nullable()
  .transform((v) => {
    if (!v || !v.trim()) return "";
    const t = v.trim();
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(t)
      ? t
      : "";
  });

export const PAGE_BG_OPTIONS = [
  { value: "soft", label: "Soft gray", swatch: "#F6F8FA" },
  { value: "white", label: "White", swatch: "#FFFFFF" },
  { value: "teal", label: "Soft teal", swatch: "#E8F5F2" },
  { value: "blue", label: "Soft blue", swatch: "#EEF6FF" },
  { value: "navy", label: "Navy", swatch: "#172455" },
  { value: "custom", label: "Custom", swatch: "conic-gradient(red, yellow, lime, blue, red)" },
] as const;

export const CONTENT_WIDTH_OPTIONS = [
  { value: "narrow", label: "Narrow", className: "max-w-3xl" },
  { value: "normal", label: "Normal", className: "max-w-4xl" },
  { value: "wide", label: "Wide", className: "max-w-5xl" },
  { value: "full", label: "Full", className: "max-w-6xl" },
] as const;

export const HERO_STYLE_OPTIONS = [
  { value: "card", label: "Inside card" },
  { value: "banner", label: "Teal banner" },
  { value: "navy", label: "Navy banner" },
  { value: "minimal", label: "Minimal (no card)" },
  { value: "hidden", label: "Hide hero" },
] as const;

export const CARD_SHADOW_OPTIONS = [
  { value: "none", label: "None" },
  { value: "sm", label: "Soft" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Strong" },
] as const;

export const CARD_RADIUS_OPTIONS = [
  { value: "none", label: "0" },
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
] as const;

export const SECTION_GAP_OPTIONS = [
  { value: "sm", label: "Tight", className: "space-y-4 sm:space-y-5" },
  { value: "md", label: "Normal", className: "space-y-6 sm:space-y-8" },
  { value: "lg", label: "Roomy", className: "space-y-8 sm:space-y-12" },
] as const;

export const pageLayoutSchema = z.object({
  pageBg: z
    .enum(["soft", "white", "teal", "blue", "navy", "custom"])
    .optional()
    .default("soft"),
  pageBgColor: hexColorSchema,
  contentWidth: z
    .enum(["narrow", "normal", "wide", "full"])
    .optional()
    .default("wide"),
  showBreadcrumbs: z.boolean().optional().default(true),
  heroStyle: z
    .enum(["card", "banner", "navy", "minimal", "hidden"])
    .optional()
    .default("card"),
  heroAlign: z.enum(["left", "center"]).optional().default("left"),
  showCard: z.boolean().optional().default(true),
  cardBgColor: hexColorSchema,
  cardShadow: z.enum(["none", "sm", "md", "lg"]).optional().default("sm"),
  cardRadius: z
    .enum(["none", "sm", "md", "lg", "xl"])
    .optional()
    .default("lg"),
  sectionGap: z.enum(["sm", "md", "lg"]).optional().default("md"),
});

export type PageLayout = z.infer<typeof pageLayoutSchema>;

export const DEFAULT_PAGE_LAYOUT: PageLayout = {
  pageBg: "soft",
  pageBgColor: "",
  contentWidth: "wide",
  showBreadcrumbs: true,
  heroStyle: "card",
  heroAlign: "left",
  showCard: true,
  cardBgColor: "",
  cardShadow: "sm",
  cardRadius: "lg",
  sectionGap: "md",
};

export function parsePageLayout(raw: unknown): PageLayout {
  const parsed = pageLayoutSchema.safeParse(raw ?? {});
  return parsed.success
    ? { ...DEFAULT_PAGE_LAYOUT, ...parsed.data }
    : DEFAULT_PAGE_LAYOUT;
}

export function pageBgClass(bg: PageLayout["pageBg"]): string {
  switch (bg) {
    case "white":
      return "bg-white";
    case "teal":
      return "bg-[#E8F5F2]";
    case "blue":
      return "bg-[#EEF6FF]";
    case "navy":
      return "bg-[#172455]";
    case "custom":
      return "";
    default:
      return "bg-[#F6F8FA]";
  }
}

export function pageBgInlineStyle(layout: PageLayout): CSSProperties | undefined {
  if (layout.pageBg === "custom" && layout.pageBgColor) {
    return { backgroundColor: layout.pageBgColor };
  }
  return undefined;
}

export function isDarkPageBg(layout: PageLayout): boolean {
  if (layout.pageBg === "navy") return true;
  if (layout.pageBg === "custom") return isHexDark(layout.pageBgColor);
  return false;
}

export function contentWidthClass(width: PageLayout["contentWidth"]): string {
  return (
    CONTENT_WIDTH_OPTIONS.find((o) => o.value === width)?.className ||
    "max-w-5xl"
  );
}

export function cardShadowClass(shadow: PageLayout["cardShadow"]): string {
  switch (shadow) {
    case "none":
      return "";
    case "md":
      return "shadow-md";
    case "lg":
      return "shadow-lg";
    default:
      return "shadow-sm";
  }
}

export function cardRadiusClass(radius: PageLayout["cardRadius"]): string {
  switch (radius) {
    case "none":
      return "rounded-none";
    case "sm":
      return "rounded-lg";
    case "md":
      return "rounded-xl";
    case "xl":
      return "rounded-3xl";
    default:
      return "rounded-2xl";
  }
}

export function sectionGapClass(gap: PageLayout["sectionGap"]): string {
  return (
    SECTION_GAP_OPTIONS.find((o) => o.value === gap)?.className ||
    "space-y-6 sm:space-y-8"
  );
}

export function cardInlineStyle(layout: PageLayout): CSSProperties | undefined {
  if (layout.cardBgColor) {
    return { backgroundColor: layout.cardBgColor };
  }
  return undefined;
}
