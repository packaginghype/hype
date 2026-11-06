import { z } from "zod";

export const customScriptSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().max(200).default(""),
  placement: z.enum(["header", "footer"]).default("header"),
  enabled: z.boolean().default(true),
  code: z.string().max(50000).default(""),
});

export const footerMenuLinkSchema = z.object({
  id: z.string().trim().min(1).max(80),
  // Allow empty while editing in admin; empty rows are stripped on save/normalize
  label: z.string().max(80).default(""),
  href: z.string().max(500).default("/"),
});

export const footerMenuColumnSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().max(60).default("Column"),
  /** Manual links, or auto-fill from published categories */
  mode: z.enum(["links", "categories"]).default("links"),
  enabled: z.boolean().default(true),
  links: z.array(footerMenuLinkSchema).max(20).default([]),
  categoriesLimit: z.coerce.number().int().min(1).max(12).optional().default(7),
  /** Append CMS custom pages that have “Show in footer” enabled */
  includeCustomPages: z.boolean().optional().default(false),
});

export const footerLegalLinkSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().max(60).default(""),
  href: z.string().max(500).default("/"),
});

export const generalSettingsSchema = z.object({
  siteName: z.string().trim().min(1).default("Packaging Hype"),
  logoUrl: z.string().trim().default("/logo.png"),
  logoAlt: z.string().trim().default("Packaging Hype"),
  faviconUrl: z.string().trim().default("/favicon.png"),
  faviconAlt: z.string().trim().default("Packaging Hype"),
  headerCode: z.string().max(50000).default(""),
  footerCode: z.string().max(50000).default(""),
  customScripts: z.array(customScriptSchema).max(40).default([]),
  /** Up to 5 footer menu columns (brand column stays fixed) */
  footerColumns: z.array(footerMenuColumnSchema).max(5).default([]),
  footerLegalLinks: z.array(footerLegalLinkSchema).max(12).default([]),
});

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type FooterMenuColumn = z.infer<typeof footerMenuColumnSchema>;
export type FooterMenuLink = z.infer<typeof footerMenuLinkSchema>;
export type FooterLegalLink = z.infer<typeof footerLegalLinkSchema>;

let footerIdCounter = 0;

export function newFooterId(prefix = "fc") {
  footerIdCounter += 1;
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}_${footerIdCounter}_${Date.now().toString(36)}`;
}

export function createEmptyFooterLink(): FooterMenuLink {
  return { id: newFooterId("fl"), label: "New link", href: "/" };
}

export function createEmptyFooterColumn(
  mode: FooterMenuColumn["mode"] = "links"
): FooterMenuColumn {
  return {
    id: newFooterId("fc"),
    title: mode === "categories" ? "Popular Categories" : "New Column",
    mode,
    enabled: true,
    links: mode === "links" ? [createEmptyFooterLink()] : [],
    categoriesLimit: 7,
    includeCustomPages: false,
  };
}

export const DEFAULT_FOOTER_COLUMNS: FooterMenuColumn[] = [
  {
    id: "shop",
    title: "Shop",
    mode: "links",
    enabled: true,
    includeCustomPages: false,
    categoriesLimit: 7,
    links: [
      { id: "shop-1", label: "Industries", href: "/industries" },
      { id: "shop-2", label: "Box by Material", href: "/box-by-material" },
      { id: "shop-3", label: "Shapes & Styles", href: "/shapes-styles" },
      { id: "shop-4", label: "All Products", href: "/products" },
      { id: "shop-5", label: "All Categories", href: "/categories" },
    ],
  },
  {
    id: "popular-categories",
    title: "Popular Categories",
    mode: "categories",
    enabled: true,
    includeCustomPages: false,
    categoriesLimit: 7,
    links: [],
  },
  {
    id: "company",
    title: "Company",
    mode: "links",
    enabled: true,
    includeCustomPages: true,
    categoriesLimit: 7,
    links: [
      { id: "co-1", label: "About Us", href: "/about-us" },
      { id: "co-2", label: "Blog & Guides", href: "/blog" },
      { id: "co-3", label: "Contact Us", href: "/contact-us" },
      { id: "co-4", label: "Get a Quote", href: "/quote" },
      { id: "co-5", label: "Cart", href: "/cart" },
    ],
  },
];

export const DEFAULT_FOOTER_LEGAL_LINKS: FooterLegalLink[] = [
  { id: "legal-1", label: "Terms", href: "/terms-and-conditions" },
  { id: "legal-2", label: "Privacy", href: "/privacy-policy" },
  { id: "legal-3", label: "Shipping", href: "/shipping-delivery-policy" },
  { id: "legal-4", label: "Returns", href: "/refund-return-policy" },
  { id: "legal-5", label: "Sitemap", href: "/sitemap" },
];

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  siteName: "Packaging Hype",
  logoUrl: "/logo.png",
  logoAlt: "Packaging Hype",
  faviconUrl: "/favicon.png",
  faviconAlt: "Packaging Hype",
  headerCode: "",
  footerCode: "",
  customScripts: [],
  footerColumns: DEFAULT_FOOTER_COLUMNS,
  footerLegalLinks: DEFAULT_FOOTER_LEGAL_LINKS,
};

/** Sanitize columns for DB write / live footer (drop blank link rows). */
export function sanitizeFooterColumns(
  columns: FooterMenuColumn[]
): FooterMenuColumn[] {
  return columns.slice(0, 5).map((col, index) => ({
    ...col,
    title: col.title.trim() || `Column ${index + 1}`,
    mode: col.mode === "categories" ? "categories" : "links",
    enabled: col.enabled !== false,
    includeCustomPages: Boolean(col.includeCustomPages),
    categoriesLimit: Math.min(12, Math.max(1, col.categoriesLimit || 7)),
    links: (col.links || [])
      .filter((l) => l.label.trim() && l.href.trim())
      .map((l) => ({
        id: l.id,
        label: l.label.trim(),
        href: l.href.trim(),
      })),
  }));
}

export function sanitizeFooterLegalLinks(
  links: FooterLegalLink[]
): FooterLegalLink[] {
  return links
    .filter((l) => l.label.trim() && l.href.trim())
    .slice(0, 12)
    .map((l) => ({
      id: l.id,
      label: l.label.trim(),
      href: l.href.trim(),
    }));
}

export function normalizeFooterColumns(
  raw: unknown
): FooterMenuColumn[] {
  // Only fall back to defaults when the field was never saved
  if (raw === undefined || raw === null) {
    return DEFAULT_FOOTER_COLUMNS;
  }
  const parsed = z.array(footerMenuColumnSchema).safeParse(raw);
  if (!parsed.success) {
    return DEFAULT_FOOTER_COLUMNS;
  }
  // Allow intentional empty array (admin cleared all columns)
  return sanitizeFooterColumns(parsed.data);
}

export function normalizeFooterLegalLinks(
  raw: unknown
): FooterLegalLink[] {
  if (raw === undefined || raw === null) {
    return DEFAULT_FOOTER_LEGAL_LINKS;
  }
  const parsed = z.array(footerLegalLinkSchema).safeParse(raw);
  if (!parsed.success) {
    return DEFAULT_FOOTER_LEGAL_LINKS;
  }
  return sanitizeFooterLegalLinks(parsed.data);
}
