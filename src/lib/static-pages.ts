import { z } from "zod";

export const staticPageSchema = z.object({
  heading: z.string().optional().nullable(),
  eyebrow: z.string().optional().nullable(),
  intro: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
});

export type StaticPageData = z.infer<typeof staticPageSchema>;

export type StaticPageKind = "home" | "content" | "contact" | "quote";

export type StaticPageDef = {
  key: string;
  title: string;
  path: string;
  description: string;
  kind: StaticPageKind;
  defaults: StaticPageData;
};

export const STATIC_PAGES: StaticPageDef[] = [
  {
    key: "home",
    title: "Home Page",
    path: "/",
    description:
      "Edit hero, about, reliable packaging, FAQ, inquiry form and SEO for the home page.",
    kind: "home",
    defaults: {},
  },
  {
    key: "about-us",
    title: "About Us",
    path: "/about-us",
    description: "Company story, commitments, and About Us SEO.",
    kind: "content",
    defaults: {
      eyebrow: "Packaging Manufacturer",
      heading: "About Packaging Hype",
      intro:
        "At Packaging Hype, we believe exceptional packaging does more than just protect your goods — it builds lasting brand equity, tells your story, and creates memorable unboxing moments.",
      content: `<h2>State-of-the-Art Manufacturing</h2>
<p>Equipped with high-precision Heidelberg offset presses, digital short-run printers, and automated die-cutters to produce consistent packaging tolerances.</p>
<h2>Dedicated Prepress Engineering</h2>
<p>Our in-house packaging structural designers review your dielines, inspect resolution, and provide complimentary 3D digital mockups before printing.</p>
<h2>Our Commitments to You</h2>
<ul>
<li><strong>Zero Hidden Setup Fees:</strong> We do not charge separate plate or die-cutting fees on custom orders.</li>
<li><strong>Flexible Low Minimums:</strong> Low MOQ starting at 100 units empowers early-stage startups and rapid testing.</li>
<li><strong>Free Doorstep Freight:</strong> 100% free ground delivery anywhere in the continental USA.</li>
</ul>`,
      seoTitle: "About Us",
      seoDescription:
        "Learn about Packaging Hype — a premier custom packaging box manufacturer helping emerging and enterprise brands elevate retail and e-commerce unboxing.",
      seoKeywords: "about packaging hype, custom box manufacturer usa",
    },
  },
  {
    key: "contact-us",
    title: "Contact Us",
    path: "/contact-us",
    description: "Contact heading, intro copy, extra content, and SEO.",
    kind: "contact",
    defaults: {
      eyebrow: "Direct Prepress & Sales",
      heading: "Get in Touch with Our Team",
      intro:
        "Have questions about box dimensions, printing plates, paperboard stocks, or custom dielines? Contact our dedicated packaging engineers.",
      content: `<p>Need a formal commercial quote? Use our quotation builder to input custom dimensions and upload artwork. Phone and email details stay in sync with site settings.</p>`,
      seoTitle: "Contact Us",
      seoDescription:
        "Contact Packaging Hype for custom box orders, dieline templates, and prepress support.",
      seoKeywords: "contact packaging hype, custom box quote",
    },
  },
  {
    key: "privacy-policy",
    title: "Privacy Policy",
    path: "/privacy-policy",
    description: "Privacy policy content and SEO.",
    kind: "content",
    defaults: {
      heading: "Privacy Policy",
      intro: "Effective Date: October 2026",
      content: `<h2>1. Collection of Commercial Information</h2>
<p>We collect information provided directly through quote requests, including contact names, company details, email addresses, phone numbers, and custom packaging specifications.</p>
<h2>2. Artwork Confidentiality &amp; Security</h2>
<p>Your proprietary brand assets, logos, and vector dieline designs submitted for quoting or manufacturing are treated with strict confidentiality. We do not sell, rent, or share your proprietary design files with third-party marketers.</p>`,
      seoTitle: "Privacy Policy",
      seoDescription:
        "Packaging Hype privacy policy detailing how your commercial information and uploaded dieline artwork are protected.",
      seoKeywords: "privacy policy, packaging hype",
    },
  },
  {
    key: "shipping-delivery-policy",
    title: "Shipping & Delivery Policy",
    path: "/shipping-delivery-policy",
    description: "Shipping and delivery policy content and SEO.",
    kind: "content",
    defaults: {
      heading: "Shipping & Delivery Policy",
      intro: "",
      content: `<h2>1. Free USA Ground Shipping</h2>
<p>Standard ground freight shipping is 100% complimentary on all custom packaging orders delivered within the contiguous United States.</p>
<h2>2. Packaging and Freight Handling</h2>
<p>All folding cartons, rigid boxes, and corrugated mailers are packed flat in heavy-duty corrugated master cartons and palletized with shrink wrap to protect corners and avoid transit damage.</p>`,
      seoTitle: "Shipping & Delivery Policy",
      seoDescription:
        "Packaging Hype free USA delivery terms, freight palletizing, and turnaround policies.",
      seoKeywords: "shipping policy, free usa shipping, packaging hype",
    },
  },
  {
    key: "terms-and-conditions",
    title: "Terms and Conditions",
    path: "/terms-and-conditions",
    description: "Terms and conditions content and SEO.",
    kind: "content",
    defaults: {
      heading: "Terms & Conditions",
      intro: "Effective Date: October 2026",
      content: `<h2>1. Proof Approval and Production</h2>
<p>All custom packaging manufacturing begins only after the client provides written sign-off or digital approval on the final 2D dieline proof and 3D digital rendering. Packaging Hype is not liable for errors in spelling, graphics placement, or sizing once a proof has been approved.</p>
<h2>2. Color Matching &amp; Print Tolerances</h2>
<p>Due to variations between computer monitor color spaces (RGB) and commercial printing presses (CMYK / Pantone spot colors), minor color shifts are standard in paperboard printing. Critical color matches must specify exact Pantone (PMS) formulas.</p>
<h2>3. Order Quantities &amp; Tolerances</h2>
<p>Standard commercial manufacturing tolerances may include a ±5% over-run or under-run variance due to setup sheets and die-cutting calibration.</p>`,
      seoTitle: "Terms & Conditions",
      seoDescription:
        "Packaging Hype standard terms and conditions for custom box manufacturing, proof approval, and commercial orders.",
      seoKeywords: "terms and conditions, packaging hype",
    },
  },
  {
    key: "refund-return-policy",
    title: "Refund & Return Policy",
    path: "/refund-return-policy",
    description: "Refund and return policy content and SEO.",
    kind: "content",
    defaults: {
      heading: "Refund & Return Policy",
      intro: "",
      content: `<h2>1. Custom Manufactured Goods</h2>
<p>Because each packaging order is custom printed, die-cut, and manufactured to individual client specifications, orders cannot be returned for buyer remorse or resale.</p>
<h2>2. Manufacturing Defect Guarantee</h2>
<p>If your received packaging exhibits manufacturing defects or deviates substantially from your approved digital proof, contact our quality assurance team within 7 business days of delivery. Upon verification, Packaging Hype will reprint the defective units at zero cost.</p>`,
      seoTitle: "Refund & Return Policy",
      seoDescription:
        "Packaging Hype custom manufacturing defect inspection, reprints, and refund policy.",
      seoKeywords: "refund policy, return policy, packaging hype",
    },
  },
  {
    key: "quote",
    title: "Get a Quote",
    path: "/quote",
    description: "Quote page heading, intro copy, and SEO. Form fields stay the same.",
    kind: "quote",
    defaults: {
      heading: "Request a Custom Packaging Quote",
      intro:
        "Get instant wholesale manufacturing pricing on custom printed boxes, mailers, and folding cartons. Free 3D digital proofs, fast 8-10 days turnaround, and free USA delivery.",
      content: "",
      seoTitle: "Request a Custom Packaging Quote",
      seoDescription:
        "Get instant wholesale manufacturing pricing on custom printed boxes, mailers, and folding cartons. Free 3D digital proofs, fast 8-10 days turnaround, and free USA delivery.",
      seoKeywords: "custom packaging quote, wholesale boxes",
    },
  },
];

export function getStaticPageDef(key: string) {
  return STATIC_PAGES.find((p) => p.key === key) || null;
}

export function parseStaticPageData(
  raw: unknown,
  defaults: StaticPageData
): StaticPageData {
  const parsed = staticPageSchema.safeParse(raw);
  if (!parsed.success) return defaults;
  return { ...defaults, ...parsed.data };
}
