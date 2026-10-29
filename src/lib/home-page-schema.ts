import { z } from "zod";

const optionalText = z.string().optional().nullable();

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const stringIdArray = z.preprocess((value) => {
  if (value == null) return [];
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string" && id.length > 0);
}, z.array(z.string()));

const faqArray = z.preprocess((value) => {
  if (value == null) return [];
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (!item || typeof item !== "object") return { question: "", answer: "" };
    const row = item as Record<string, unknown>;
    return {
      question: row.question == null ? "" : String(row.question),
      answer: row.answer == null ? "" : String(row.answer),
    };
  });
}, z.array(faqItemSchema));

export const homePageSchema = z.object({
  // ── Hero Section ──────────────────────────────────────────────────────────
  heroHeading: optionalText,
  heroHighlight: optionalText, // colored span text
  heroSubtext: optionalText,
  heroBtnLabel: optionalText,
  heroBtnHref: optionalText,
  heroImageUrl: optionalText,
  heroImageAlt: optionalText,

  // ── About / Who We Are ───────────────────────────────────────────────────
  aboutEyebrow: optionalText,
  aboutHeading: optionalText,
  aboutBody: optionalText, // rich text HTML
  aboutBtnLabel: optionalText,
  aboutBtnHref: optionalText,
  aboutImageUrl: optionalText,
  aboutImageAlt: optionalText,

  // ── Industry Solutions Section ────────────────────────────────────────────
  industryHeading: optionalText,
  industrySubtext: optionalText,

  // ── Trending & Popular Products ───────────────────────────────────────────
  trendingHeading: optionalText,
  trendingSubtext: optionalText,
  trendingProductIds: stringIdArray,

  // ── Customer Reviews ──────────────────────────────────────────────────────
  reviewsEyebrow: optionalText,
  reviewsHeading: optionalText,
  reviewsSubtext: optionalText,

  // ── Reliable Packaging Section ────────────────────────────────────────────
  reliableImageUrl: optionalText,
  reliableImageAlt: optionalText,
  reliableHeading: optionalText,
  reliableBody: optionalText, // rich text HTML
  reliableBtnLabel: optionalText,
  reliableBtnHref: optionalText,

  // ── Inquiry / Contact Form Section ────────────────────────────────────────
  inquiryHeading: optionalText,
  inquirySubtext: optionalText,

  // ── Detailed content (immediately above FAQs) ─────────────────────────────
  seoContentHeading: optionalText,
  seoContentHtml: optionalText,
  seoContentImageUrl: optionalText,
  seoContentImageAlt: optionalText,

  // ── FAQ Section ───────────────────────────────────────────────────────────
  faqEyebrow: optionalText,
  faqHeading: optionalText,
  faqSubtext: optionalText,
  faqImageUrl: optionalText,
  faqImageAlt: optionalText,
  faqs: faqArray,

  // ── Latest News / Blog preview ────────────────────────────────────────────
  blogsHeading: optionalText,
  blogsSubtext: optionalText,
  blogIds: stringIdArray,

  // ── SEO ───────────────────────────────────────────────────────────────────
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  seoCanonical: optionalText, // canonical URL for homepage
  seoScript: optionalText, // JSON-LD / schema markup
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

  aboutEyebrow: "",
  aboutHeading: "About Packaging Hype",
  aboutBody:
    "<p>Packaging Hype is a US-based custom packaging manufacturer helping brands ship smarter and look sharper. From kraft and corrugated to rigid and specialty structures, we build boxes around your product — not the other way around.</p><p>Low minimums, free design support, and clear quotes keep the process simple. Whether you need retail-ready cartons or e-commerce mailers, our team delivers packaging that protects, presents, and performs.</p>",
  aboutBtnLabel: "Learn More About Us",
  aboutBtnHref: "/about-us",
  aboutImageUrl: "/images/reliable-packaging-boxes.jpg",
  aboutImageAlt: "Packaging Hype custom packaging team and production",

  industryHeading: "Packaging Solutions by Industry Needs",
  industrySubtext:
    "From beauty and food to retail and e-commerce — explore custom packaging built for how your products ship, sell, and get unboxed.",

  trendingHeading: "Trending & Popular Products",
  trendingSubtext:
    "Explore packaging formats brands reorder most — from retail cartons to e-commerce mailers.",
  trendingProductIds: [],

  reviewsEyebrow: "Trusted by Growing Brands",
  reviewsHeading: "What Our Customers Say",
  reviewsSubtext: "Real feedback from brands that ship with Packaging Hype.",

  reliableImageUrl: "/images/reliable-packaging-boxes.jpg",
  reliableImageAlt: "Custom packaging boxes for growing businesses",
  reliableHeading: "Reliable Packaging for Growing Businesses",
  reliableBody:
    "<p>Does your packaging reflect the quality of your brand? At Packaging Hype, we understand that businesses move quickly and need packaging they can depend on. That is why we create reliable, well-designed boxes that protect your products while helping your brand make a strong impression.</p><p>Every shipment matters. Your products should arrive safely and look professional when they reach your customers. Our focus is simple: protect your products, present your brand clearly, and make shipping easier for your business.</p>",
  reliableBtnLabel: "Get a Free Quote",
  reliableBtnHref: "/quote",

  inquiryHeading: "Looking for other Custom Boxes and Packaging?",
  inquirySubtext:
    "Have a question or need a custom packaging quote? Fill out the inquiry form and our packaging experts will get back to you with tailored solutions, competitive pricing, and fast turnaround times. At Packaging Hype, we make your packaging ideas a reality.",

  seoContentHeading: "Custom Packaging Designed Around Your Product",
  seoContentHtml: `<p>We manufacture custom boxes in the size, material, and print your brand actually needs — mailers, folding cartons, kraft packs, and rigid structures. You are not forced into a stock carton that wastes space or weakens the unboxing.</p>
<p>Most printed folding cartons and corrugated mailers start at a 100-unit MOQ. Share your dimensions, quantity, and artwork; we send pricing, a digital proof, and free design support before anything goes to press.</p>
<p>Choose kraft, corrugated, carton board, or rigid chipboard, with 1-color through full CMYK printing and finishes such as soft-touch, spot UV, or foil. After proof approval, typical turnaround is 8–10 business days, with free shipping across the United States.</p>`,
  seoContentImageUrl: "/images/reliable-packaging-boxes.jpg",
  seoContentImageAlt: "Custom packaging boxes designed for branded products",

  faqEyebrow: "Answers to Common Questions",
  faqHeading: "Frequently Asked Questions",
  faqSubtext:
    "Everything about MOQs, proofs, turnaround, and free USA shipping — answered clearly before you request a quote.",
  faqImageUrl: "/images/reliable-packaging-boxes.jpg",
  faqImageAlt: "Custom kraft packaging boxes from Packaging Hype",
  faqs: [],

  blogsHeading: "Latest News",
  blogsSubtext:
    "Keep up with the latest packaging design tips, industry guides, material insights, and unboxing innovations for modern brands.",
  blogIds: [],

  seoTitle: "Custom Packaging Boxes | Packaging Hype",
  seoDescription:
    "Premium custom packaging boxes — tailored sizes, free USA shipping, 8-10 day turnaround. Get a free quote today.",
  seoKeywords: "custom packaging, custom boxes, wholesale packaging",
  seoCanonical: "https://packaginghype.com/",
  seoScript: "",
};

/** Canonical used on the homepage when CMS value is empty */
export const HOME_PAGE_CANONICAL_DEFAULT = "https://packaginghype.com/";

function fillEmptySeoContent(data: HomePageData): HomePageData {
  return {
    ...HOME_PAGE_DEFAULTS,
    ...data,
    trendingProductIds: data.trendingProductIds ?? [],
    faqs: data.faqs ?? [],
    blogIds: data.blogIds ?? [],
    seoContentHeading:
      data.seoContentHeading ?? HOME_PAGE_DEFAULTS.seoContentHeading,
    seoContentHtml: data.seoContentHtml ?? HOME_PAGE_DEFAULTS.seoContentHtml,
    seoContentImageUrl:
      data.seoContentImageUrl ?? HOME_PAGE_DEFAULTS.seoContentImageUrl,
    seoContentImageAlt:
      data.seoContentImageAlt ?? HOME_PAGE_DEFAULTS.seoContentImageAlt,
  };
}

/** Parse raw DB JSON into typed HomePageData, filling in defaults */
export function parseHomePageData(raw: unknown): HomePageData {
  const parsed = homePageSchema.safeParse(raw ?? {});
  if (!parsed.success) {
    const loose =
      raw && typeof raw === "object" && !Array.isArray(raw)
        ? (raw as Record<string, unknown>)
        : {};
    return fillEmptySeoContent({
      ...HOME_PAGE_DEFAULTS,
      ...loose,
    } as HomePageData);
  }
  return fillEmptySeoContent(parsed.data);
}

export function formatHomePageZodError(error: z.ZodError): string {
  const first = error.issues[0];
  if (!first) return "Invalid home page data.";
  const path = first.path.length ? first.path.join(".") : "form";
  return `${path}: ${first.message}`;
}
