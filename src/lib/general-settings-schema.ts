import { z } from "zod";

export const generalSettingsSchema = z.object({
  siteName: z.string().trim().min(1).default("Packaging Hype"),
  logoUrl: z.string().trim().default("/logo.png"),
  logoAlt: z.string().trim().default("Packaging Hype"),
  faviconUrl: z.string().trim().default("/favicon.png"),
});

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  siteName: "Packaging Hype",
  logoUrl: "/logo.png",
  logoAlt: "Packaging Hype",
  faviconUrl: "/favicon.png",
};

