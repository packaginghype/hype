import { z } from "zod";
import type { CSSProperties } from "react";

const idSchema = z.string().min(1);

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

/** Shared visual style for every widget */
export const widgetStyleSchema = z.object({
  bg: z
    .enum(["none", "white", "soft", "teal", "blue", "navy", "coral", "custom"])
    .optional()
    .default("none"),
  bgColor: hexColorSchema,
  textColor: hexColorSchema,
  borderColor: hexColorSchema,
  padding: z
    .enum(["none", "sm", "md", "lg", "xl"])
    .optional()
    .default("md"),
  align: z.enum(["left", "center"]).optional().default("left"),
  radius: z
    .enum(["none", "sm", "md", "lg", "xl", "full"])
    .optional()
    .default("lg"),
  border: z.boolean().optional().default(false),
  borderWidth: z.enum(["1", "2", "4"]).optional().default("1"),
  shadow: z
    .enum(["none", "sm", "md", "lg", "xl"])
    .optional()
    .default("none"),
});

export type WidgetStyle = z.infer<typeof widgetStyleSchema>;

export const DEFAULT_WIDGET_STYLE: WidgetStyle = {
  bg: "none",
  bgColor: "",
  textColor: "",
  borderColor: "",
  padding: "md",
  align: "left",
  radius: "lg",
  border: false,
  borderWidth: "1",
  shadow: "none",
};

export const WIDGET_BG_OPTIONS = [
  { value: "none", label: "Transparent", swatch: "transparent" },
  { value: "white", label: "White", swatch: "#FFFFFF" },
  { value: "soft", label: "Soft gray", swatch: "#F6F8FA" },
  { value: "teal", label: "Teal", swatch: "#E8F5F2" },
  { value: "blue", label: "Blue", swatch: "#EEF6FF" },
  { value: "navy", label: "Navy", swatch: "#172455" },
  { value: "coral", label: "Coral soft", swatch: "#FFF5F4" },
  { value: "custom", label: "Custom", swatch: "conic-gradient(red, yellow, lime, blue, red)" },
] as const;

export const WIDGET_SHADOW_OPTIONS = [
  { value: "none", label: "None" },
  { value: "sm", label: "Soft" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Strong" },
  { value: "xl", label: "Heavy" },
] as const;

export const WIDGET_RADIUS_OPTIONS = [
  { value: "none", label: "0" },
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
  { value: "full", label: "Pill" },
] as const;

export const COLOR_PRESETS = [
  "#172455",
  "#21AAA5",
  "#FF5548",
  "#FFFFFF",
  "#F6F8FA",
  "#E8F5F2",
  "#EEF6FF",
  "#FFF5F4",
  "#0f1839",
  "#111827",
] as const;

const columnSchema = z.object({
  title: z.string().optional().nullable(),
  html: z.string().optional().nullable(),
  imageSrc: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
});

const styleField = widgetStyleSchema.optional().default(DEFAULT_WIDGET_STYLE);

export const pageWidgetSchema = z.discriminatedUnion("type", [
  z.object({
    id: idSchema,
    type: z.literal("richText"),
    style: styleField,
    title: z.string().optional().nullable(),
    html: z.string().optional().nullable(),
  }),
  z.object({
    id: idSchema,
    type: z.literal("image"),
    style: styleField,
    src: z.string().optional().nullable(),
    alt: z.string().optional().nullable(),
    caption: z.string().optional().nullable(),
    aspect: z.enum(["video", "wide", "square", "auto"]).optional().default("video"),
  }),
  z.object({
    id: idSchema,
    type: z.literal("imageText"),
    style: styleField,
    imageSrc: z.string().optional().nullable(),
    imageAlt: z.string().optional().nullable(),
    imageSide: z.enum(["left", "right"]).default("left"),
    title: z.string().optional().nullable(),
    html: z.string().optional().nullable(),
  }),
  z.object({
    id: idSchema,
    type: z.literal("columns2"),
    style: styleField,
    left: columnSchema.default({}),
    right: columnSchema.default({}),
  }),
  z.object({
    id: idSchema,
    type: z.literal("columns3"),
    style: styleField,
    columns: z.tuple([columnSchema, columnSchema, columnSchema]),
  }),
  z.object({
    id: idSchema,
    type: z.literal("cta"),
    style: styleField,
    eyebrow: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    text: z.string().optional().nullable(),
    buttonLabel: z.string().optional().nullable(),
    buttonHref: z.string().optional().nullable(),
    tone: z.enum(["navy", "teal", "coral", "soft"]).optional().default("navy"),
  }),
  z.object({
    id: idSchema,
    type: z.literal("divider"),
    style: styleField,
    dividerStyle: z.enum(["line", "space"]).default("line"),
  }),
  z.object({
    id: idSchema,
    type: z.literal("gallery"),
    style: styleField,
    columns: z.enum(["2", "3", "4"]).optional().default("4"),
    images: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string().optional().nullable(),
        })
      )
      .max(8)
      .default([]),
  }),
  z.object({
    id: idSchema,
    type: z.literal("heroBanner"),
    style: styleField,
    eyebrow: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    text: z.string().optional().nullable(),
    imageSrc: z.string().optional().nullable(),
    imageAlt: z.string().optional().nullable(),
    buttonLabel: z.string().optional().nullable(),
    buttonHref: z.string().optional().nullable(),
    tone: z.enum(["teal", "navy", "blue", "soft"]).optional().default("teal"),
  }),
]);

export const pageWidgetsSchema = z.array(pageWidgetSchema);

export type PageWidget = z.infer<typeof pageWidgetSchema>;
export type PageWidgetType = PageWidget["type"];

export const WIDGET_CATALOG: {
  type: PageWidgetType;
  label: string;
  description: string;
}[] = [
  {
    type: "heroBanner",
    label: "Hero banner",
    description: "Big banner with optional image + CTA",
  },
  {
    type: "richText",
    label: "Text block",
    description: "Heading + rich HTML content",
  },
  {
    type: "image",
    label: "Image",
    description: "Full-width image with caption",
  },
  {
    type: "imageText",
    label: "Image + text",
    description: "Two-column image and copy",
  },
  {
    type: "columns2",
    label: "2 columns",
    description: "Side-by-side cards",
  },
  {
    type: "columns3",
    label: "3 columns",
    description: "Three feature columns",
  },
  {
    type: "gallery",
    label: "Image gallery",
    description: "Responsive image grid",
  },
  {
    type: "cta",
    label: "Call to action",
    description: "Colored banner with button",
  },
  {
    type: "divider",
    label: "Divider",
    description: "Line or vertical space",
  },
];

let widgetIdCounter = 0;

/** Client-only id helper — call after mount / user actions, never during SSR init. */
export function newWidgetId() {
  widgetIdCounter += 1;
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `w_${widgetIdCounter}_${Date.now().toString(36)}`;
}

export function createEmptyWidget(type: PageWidgetType): PageWidget {
  const id = newWidgetId();
  const style = { ...DEFAULT_WIDGET_STYLE };
  switch (type) {
    case "richText":
      return { id, type, style, title: "", html: "" };
    case "image":
      return { id, type, style, src: "", alt: "", caption: "", aspect: "video" };
    case "imageText":
      return {
        id,
        type,
        style,
        imageSrc: "",
        imageAlt: "",
        imageSide: "left",
        title: "",
        html: "",
      };
    case "columns2":
      return {
        id,
        type,
        style,
        left: { title: "", html: "", imageSrc: "", imageAlt: "" },
        right: { title: "", html: "", imageSrc: "", imageAlt: "" },
      };
    case "columns3":
      return {
        id,
        type,
        style,
        columns: [
          { title: "", html: "", imageSrc: "", imageAlt: "" },
          { title: "", html: "", imageSrc: "", imageAlt: "" },
          { title: "", html: "", imageSrc: "", imageAlt: "" },
        ],
      };
    case "cta":
      return {
        id,
        type,
        style: { ...style, padding: "lg", shadow: "md" },
        eyebrow: "",
        title: "Ready to get started?",
        text: "",
        buttonLabel: "Get a Quote",
        buttonHref: "/quote",
        tone: "navy",
      };
    case "divider":
      return { id, type, style: { ...style, padding: "none" }, dividerStyle: "line" };
    case "gallery":
      return { id, type, style, columns: "4", images: [] };
    case "heroBanner":
      return {
        id,
        type,
        style: { ...style, padding: "lg", align: "center", shadow: "sm" },
        eyebrow: "",
        title: "",
        text: "",
        imageSrc: "",
        imageAlt: "",
        buttonLabel: "",
        buttonHref: "",
        tone: "teal",
      };
  }
}

function expandHex(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }
  return `#${h.slice(0, 6)}`;
}

export function isHexDark(hex?: string | null): boolean {
  if (!hex || !hex.startsWith("#")) return false;
  try {
    const full = expandHex(hex).slice(1);
    const r = Number.parseInt(full.slice(0, 2), 16);
    const g = Number.parseInt(full.slice(2, 4), 16);
    const b = Number.parseInt(full.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 145;
  } catch {
    return false;
  }
}

export function isDarkWidgetStyle(style?: WidgetStyle | null): boolean {
  if (!style) return false;
  if (style.bg === "navy") return true;
  if (style.bg === "custom" && isHexDark(style.bgColor)) return true;
  if (style.bgColor && style.bg === "custom") return isHexDark(style.bgColor);
  if (style.bgColor && !["none", "white", "soft", "teal", "blue", "coral"].includes(style.bg || "none")) {
    return isHexDark(style.bgColor);
  }
  return false;
}

/** Normalize older widgets that used `style` key on divider as the divider kind. */
function normalizeLegacyWidget(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const w = raw as Record<string, unknown>;
  if (w.type === "divider" && (w.style === "line" || w.style === "space")) {
    return {
      ...w,
      dividerStyle: w.style,
      style: DEFAULT_WIDGET_STYLE,
    };
  }
  const incoming =
    typeof w.style === "object" && w.style ? (w.style as Record<string, unknown>) : {};
  const radius =
    typeof incoming.radius === "string"
      ? incoming.radius
      : incoming.rounded === false
        ? "none"
        : "lg";
  return {
    ...w,
    style: {
      ...DEFAULT_WIDGET_STYLE,
      ...incoming,
      radius,
    },
  };
}

export function parsePageWidgets(raw: unknown): PageWidget[] {
  if (!raw) return [];
  if (!Array.isArray(raw)) return [];
  const normalized = raw.map(normalizeLegacyWidget);
  const parsed = pageWidgetsSchema.safeParse(normalized);
  return parsed.success ? parsed.data : [];
}

const SHADOW_CLASS: Record<NonNullable<WidgetStyle["shadow"]>, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

const RADIUS_CLASS: Record<NonNullable<WidgetStyle["radius"]>, string> = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
  full: "rounded-[2rem]",
};

const PRESET_BG: Record<string, string> = {
  white: "bg-white",
  soft: "bg-[#F6F8FA]",
  teal: "bg-[#E8F5F2]",
  blue: "bg-[#EEF6FF]",
  navy: "bg-[#172455] text-white",
  coral: "bg-[#FFF5F4]",
};

export function widgetShellClass(style?: WidgetStyle | null): string {
  const s = { ...DEFAULT_WIDGET_STYLE, ...style };
  const useCustomBg = s.bg === "custom" && Boolean(s.bgColor);
  const bg = useCustomBg ? "" : PRESET_BG[s.bg || "none"] || "";
  const pad =
    s.padding === "sm"
      ? "p-4"
      : s.padding === "md"
        ? "p-5 sm:p-6"
        : s.padding === "lg"
          ? "p-6 sm:p-8 lg:p-10"
          : s.padding === "xl"
            ? "p-8 sm:p-10 lg:p-14"
            : "";
  const radius = RADIUS_CLASS[s.radius || "lg"] || "";
  const border = s.border
    ? s.borderWidth === "4"
      ? "border-4"
      : s.borderWidth === "2"
        ? "border-2"
        : "border"
    : "";
  const borderTone = s.border && !s.borderColor ? "border-[#E8EAEF]" : "";
  const shadow = SHADOW_CLASS[s.shadow || "none"] || "";
  const align = s.align === "center" ? "text-center" : "text-left";
  return [bg, pad, radius, border, borderTone, shadow, align]
    .filter(Boolean)
    .join(" ");
}

export function widgetShellInlineStyle(
  style?: WidgetStyle | null
): CSSProperties | undefined {
  const s = { ...DEFAULT_WIDGET_STYLE, ...style };
  const out: CSSProperties = {};
  if (s.bg === "custom" && s.bgColor) {
    out.backgroundColor = s.bgColor;
    if (isHexDark(s.bgColor) && !s.textColor) {
      out.color = "#ffffff";
    }
  }
  if (s.textColor) out.color = s.textColor;
  if (s.border && s.borderColor) out.borderColor = s.borderColor;
  return Object.keys(out).length ? out : undefined;
}
