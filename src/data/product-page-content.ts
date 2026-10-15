import type { FAQItem, ProductItem } from "@/types";

function cleanName(name: string) {
  return name.replace(/^Custom\s+/i, "").trim();
}

export function getProductAboutContent(product: ProductItem) {
  const name = cleanName(product.name);
  const category = product.categoryName;

  return {
    intro:
      product.fullDescription ||
      `At Packaging Hype, every customization option we offer — from structure and material through to print and finish — is there to make sure your ${name.toLowerCase()} reflects exactly what is inside. You choose what fits your product and brand. We execute it to a standard your customer feels before they read a single word.`,
    heading: `Custom ${name} Styles for Every Format and Price Point`,
    body: `The structure of the box changes how the product feels before it is even opened. The right style depends on where the product is sold, who is buying it, and what kind of opening experience you want to create. Box styles we offer for ${category.toLowerCase()}:`,
    styles: [
      "Tuck-end boxes",
      "Reverse tuck-end boxes",
      "Two-piece lid and base boxes",
      "Sleeve boxes",
      "Mailer-style boxes",
    ],
  };
}

export function getProductFaqs(product: ProductItem): FAQItem[] {
  const name = cleanName(product.name);
  return [
    {
      question: `What is included with ${name}?`,
      answer: `Each order includes custom-sized ${name.toLowerCase()}, free dieline support, and print-ready guidance. Finishes, inserts, and window options can be added based on your brief.`,
    },
    {
      question: `Can I customize my ${name.toLowerCase()}?`,
      answer:
        "Yes. Size, material thickness, print colors, finishes, and structural style can all be customized. Share your artwork or let our design team help refine the mockup.",
    },
    {
      question: "Are eco-friendly materials available?",
      answer:
        "We offer kraft, recycled board, and other sustainable stock options without sacrificing durability or print quality.",
    },
    {
      question: "What is the minimum order quantity and turnaround?",
      answer: `MOQ starts at ${product.minQuantity} units. Typical turnaround is ${product.leadTime} after artwork approval, with free USA shipping on qualifying orders.`,
    },
  ];
}

export const PRODUCT_TRUST_BADGES = [
  {
    title: "Premium Print Quality",
    description: "Sharp, professional results.",
    icon: "badge" as const,
  },
  {
    title: "Eco-Friendly Options",
    description: "Sustainable materials available.",
    icon: "leaf" as const,
  },
  {
    title: "Free Design Support",
    description: "Packaging experts ready to help.",
    icon: "headset" as const,
  },
  {
    title: "Free Shipping",
    description: "Delivered without extra cost.",
    icon: "truck" as const,
  },
  {
    title: "Made to Your Specs",
    description: "Custom sizes, styles & finishes.",
    icon: "box" as const,
  },
];
