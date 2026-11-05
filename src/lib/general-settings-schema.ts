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
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().min(1).max(500),
});

export const footerMenuColumnSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(60),
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
  label: z.string().trim().min(1).max(60),
  href: z.string().trim().min(1).max(500),
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
  return { id: newFooterId("fl"), label: "", href: "/" };
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

export function normalizeFooterColumns(
  raw: unknown
): FooterMenuColumn[] {
  const parsed = z.array(footerMenuColumnSchema).safeParse(raw);
  if (!parsed.success || !parsed.data.length) {
    return DEFAULT_FOOTER_COLUMNS;
  }
  return parsed.data.slice(0, 5).map((col) => ({
    ...col,
    links: (col.links || []).filter((l) => l.label.trim() && l.href.trim()),
  }));
}

export function normalizeFooterLegalLinks(
  raw: unknown
): FooterLegalLink[] {
  const parsed = z.array(footerLegalLinkSchema).safeParse(raw);
  if (!parsed.success || !parsed.data.length) {
    return DEFAULT_FOOTER_LEGAL_LINKS;
  }
  return parsed.data.filter((l) => l.label.trim() && l.href.trim());
}
