import { z } from "zod";

const faqItemSchema = z.object({
  question: z.string().default(""),
  answer: z.string().default(""),
});

export const homePageSchema = z.object({
  // ── Hero Section ──────────────────────────────────────────────────────────
  heroHeading: z.string().optional().nullable(),
  heroHighlight: z.string().optional().nullable(), // colored span text
  heroSubtext: z.string().optional().nullable(),
  heroBtnLabel: z.string().optional().nullable(),
  heroBtnHref: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
  heroImageAlt: z.string().optional().nullable(),

  // ── About / Who We Are ───────────────────────────────────────────────────
  aboutEyebrow: z.string().optional().nullable(),
  aboutHeading: z.string().optional().nullable(),
  aboutBody: z.string().optional().nullable(), // rich text HTML
  aboutBtnLabel: z.string().optional().nullable(),
  aboutBtnHref: z.string().optional().nullable(),
  aboutImageUrl: z.string().optional().nullable(),
  aboutImageAlt: z.string().optional().nullable(),

  // ── Reliable Packaging Section ────────────────────────────────────────────
  reliableImageUrl: z.string().optional().nullable(),
  reliableImageAlt: z.string().optional().nullable(),
  reliableHeading: z.string().optional().nullable(),
  reliableBody: z.string().optional().nullable(), // rich text HTML

  // ── Inquiry / Contact Form Section ────────────────────────────────────────
  inquiryHeading: z.string().optional().nullable(),
  inquirySubtext: z.string().optional().nullable(),

  // ── FAQ Section ───────────────────────────────────────────────────────────
  faqEyebrow: z.string().optional().nullable(),
  faqHeading: z.string().optional().nullable(),
  faqSubtext: z.string().optional().nullable(),
  faqImageUrl: z.string().optional().nullable(),
  faqImageAlt: z.string().optional().nullable(),
  faqs: z.array(faqItemSchema).optional().default([]),

  // ── SEO ───────────────────────────────────────────────────────────────────
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
});

export type HomePageData = z.infer<typeof homePageSchema>;

/** Default values used when the DB has no home page record yet */
export const HOME_PAGE_DEFAULTS: HomePageData = {
  heroHeading: "Custom Packaging Boxes Designed for",
  heroHighlight: "Your Brand",
  heroSubtext:
    "Create packaging that protects your products and makes your brand stand out — tailored sizes, premium materials, custom printing, and finishes that match your product.",
  heroBtnLabel: "Get Free Quote",
  heroBtnHref: "/quote",
  heroImageUrl: "/images/hero-brands-collage.webp",
  heroImageAlt: "Custom branded packaging boxes for leading brands",

  aboutEyebrow: "Who We Are",
  aboutHeading: "About Packaging Hype",
  aboutBody:
    "<p>Packaging Hype is a US-based custom packaging manufacturer helping brands ship smarter and look sharper. From kraft and corrugated to rigid and specialty structures, we build boxes around your product — not the other way around.</p><p>Low minimums, free design support, and clear quotes keep the process simple. Whether you need retail-ready cartons or e-commerce mailers, our team delivers packaging that protects, presents, and performs.</p>",
  aboutBtnLabel: "Learn More About Us",
  aboutBtnHref: "/about-us",
  aboutImageUrl: "/images/reliable-packaging-boxes.jpg",
  aboutImageAlt: "Packaging Hype custom packaging team and production",

  reliableImageUrl: "/images/reliable-packaging-boxes.jpg",
  reliableImageAlt: "Custom packaging boxes for growing businesses",
  reliableHeading: "Reliable Packaging for Growing Businesses",
  reliableBody:
    "<p>Does your packaging reflect the quality of your brand? At Packaging Hype, we understand that businesses move quickly and need packaging they can depend on. That is why we create reliable, well-designed boxes that protect your products while helping your brand make a strong impression.</p><p>Every shipment matters. Your products should arrive safely and look professional when they reach your customers. Our focus is simple: protect your products, present your brand clearly, and make shipping easier for your business.</p>",

  inquiryHeading: "Looking for other Custom Boxes and Packaging?",
  inquirySubtext:
    "Have a question or need a custom packaging quote? Fill out the inquiry form and our packaging experts will get back to you with tailored solutions, competitive pricing, and fast turnaround times. At Packaging Hype, we make your packaging ideas a reality.",

  faqEyebrow: "Answers to Common Questions",
  faqHeading: "Frequently Asked Questions",
  faqSubtext:
    "Everything about MOQs, proofs, turnaround, and free USA shipping — answered clearly before you request a quote.",
  faqImageUrl: "/images/reliable-packaging-boxes.jpg",
  faqImageAlt: "Custom kraft packaging boxes from Packaging Hype",
  faqs: [],

  seoTitle: "Custom Packaging Boxes | Packaging Hype",
  seoDescription:
    "Premium custom packaging boxes — tailored sizes, free USA shipping, 8-10 day turnaround. Get a free quote today.",
  seoKeywords: "custom packaging, custom boxes, wholesale packaging",
};

/** Parse raw DB JSON into typed HomePageData, filling in defaults */
export function parseHomePageData(raw: unknown): HomePageData {
  const parsed = homePageSchema.safeParse(raw ?? {});
  if (!parsed.success) return HOME_PAGE_DEFAULTS;
  return { ...HOME_PAGE_DEFAULTS, ...parsed.data };
}
