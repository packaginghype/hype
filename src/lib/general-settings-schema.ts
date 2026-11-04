import { z } from "zod";

export const customScriptSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().max(200).default(""),
  placement: z.enum(["header", "footer"]).default("header"),
  enabled: z.boolean().default(true),
  code: z.string().max(50000).default(""),
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
});

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  siteName: "Packaging Hype",
  logoUrl: "/logo.png",
  logoAlt: "Packaging Hype",
  faviconUrl: "/favicon.png",
  faviconAlt: "Packaging Hype",
  headerCode: "",
  footerCode: "",
  customScripts: [],
};

