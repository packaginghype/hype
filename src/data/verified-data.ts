import { CategoryItem, ProductItem, FAQItem, ValuePropItem } from "@/types";

/**
 * 20 Public Packaging Categories verified from live WordPress sitemaps (product_cat-sitemap.xml)
 */
export const VERIFIED_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Kraft Boxes",
    slug: "kraft-boxes",
    description: "Eco-friendly, biodegradable brown and white kraft packaging suitable for natural, organic, and retail brands.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
  },
  {
    id: "cat-2",
    name: "Corrugated Boxes",
    slug: "corrugated-boxes",
    description: "Heavy-duty fluted corrugated boxes engineered for secure e-commerce shipping, subscription kits, and transit protection.",
    imageUrl: "/images/reliable-packaging-boxes.jpg",
  },
  {
    id: "cat-3",
    name: "Rigid Boxes",
    slug: "rigid-boxes",
    description: "Luxury high-density paperboard presentation boxes with magnetic closures, lift-off lids, and custom foam inserts.",
    imageUrl: "/images/hero-packaging.jpg",
  },
  {
    id: "cat-4",
    name: "Mailer Boxes",
    slug: "mailer-boxes",
    description: "Self-locking roll-end mailers designed for direct-to-consumer unboxing experiences and retail delivery.",
    imageUrl: "/images/reliable-packaging-boxes.jpg",
  },
  {
    id: "cat-5",
    name: "Retail Boxes",
    slug: "retail-boxes",
    description: "Eye-catching folding carton shelf packaging designed with vibrant CMYK printing, hang tabs, and window cut-outs.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
  },
  {
    id: "cat-6",
    name: "Mylar Bags",
    slug: "mylar-bags",
    description: "Barrier film pouches with airtight resealable zippers, tear notches, and smell-proof protection for food and botanical goods.",
    imageUrl: "/images/reliable-packaging-boxes.jpg",
  },
  {
    id: "cat-7",
    name: "Soap Boxes",
    slug: "soap-boxes",
    description: "Moisture-resistant artisan soap packaging featuring cutout windows, embossing, and natural kraft textures.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/soap-packaging.webp",
  },
  {
    id: "cat-8",
    name: "Candle Boxes",
    slug: "candle-boxes",
    description: "Protective luxury candle packaging engineered to hold heavy glass vessels with custom safety crash-lock bottoms.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/04/Candle-Packaging.webp",
  },
  {
    id: "cat-9",
    name: "Cosmetic Boxes",
    slug: "cosmetic-boxes",
    description: "Premium beauty cartons with soft-touch matte lamination, metallic foil stamping, and spot UV details.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/02/cosmetic-packaging.png",
  },
  {
    id: "cat-10",
    name: "Food Boxes",
    slug: "food-boxes",
    description: "FDA-compliant food grade paperboard packaging for bakeries, pizza, takeout, and confectioneries.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
  },
  {
    id: "cat-11",
    name: "CBD Boxes",
    slug: "cbd-boxes",
    description: "Compliant tincture, gummy, and salve packaging with certified child-resistant lock options.",
    imageUrl: "/images/reliable-packaging-boxes.jpg",
  },
  {
    id: "cat-12",
    name: "Vape Boxes",
    slug: "vape-boxes",
    description: "Sleek cartridge, battery, and disposable packaging with precise foam trays and tamper-evident seals.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
  },
  {
    id: "cat-13",
    name: "Bakery Boxes",
    slug: "bakery-boxes",
    description: "Greaseproof pastry and cake cartons with PET clear windows and easy pop-up assembly.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
  },
  {
    id: "cat-14",
    name: "Bottle Boxes",
    slug: "bottle-boxes",
    description: "Custom fitted cartons for 30ml, 60ml, and 120ml dropper bottles, beverage jars, and essential oils.",
    imageUrl: "/images/reliable-packaging-boxes.jpg",
  },
  {
    id: "cat-15",
    name: "Apparel Boxes",
    slug: "apparel-boxes",
    description: "Clothing, garment, and scarf gift packaging with two-piece setup styles and ribbon closures.",
    imageUrl: "/images/hero-packaging.jpg",
  },
  {
    id: "cat-16",
    name: "Display Boxes",
    slug: "display-boxes",
    description: "Countertop POP display boxes with perforated fold-back header cards for retail checkout positioning.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
  },
  {
    id: "cat-17",
    name: "Gift Boxes",
    slug: "gift-boxes",
    description: "Collapsible luxury presentation boxes with hidden magnetic closures and satin ribbon pulls.",
    imageUrl: "/images/hero-packaging.jpg",
  },
  {
    id: "cat-18",
    name: "Medicine Boxes",
    slug: "medicine-boxes",
    description: "Pharmaceutical cartons with Braille embossing, tamper-proof security locks, and regulatory text space.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
  },
  {
    id: "cat-19",
    name: "Toy Boxes",
    slug: "toy-boxes",
    description: "Durable tuck-end cartons with high-clarity PVC windows, vibrant character printing, and hang tabs.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
  },
  {
    id: "cat-20",
    name: "Treat Boxes",
    slug: "treat-boxes",
    description: "Charming gable boxes with integrated carrying handles for candies, party favors, and baked goods.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
  },
];

/**
 * Sample verified products from live catalog inspection
 */
export const VERIFIED_FEATURED_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    name: "Custom Dog Bandana Boxes",
    slug: "dog-bandana-boxes",
    categorySlug: "retail-boxes",
    categoryName: "Retail Boxes",
    description: "Durable branded pet apparel packaging with custom dieline fit, vibrant color printing, and optional display window cutouts.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
    minQuantity: 100,
    leadTime: "8-10 Days",
    startingPrice: null, // Quote-based
    materials: ["14 PT C1S", "16 PT C2S", "Kraft Stock", "Corrugated Stock"],
    finishes: ["Matte Lamination", "Gloss Finish", "Spot UV", "Gold Foil"],
  },
  {
    id: "prod-2",
    name: "Custom Resealable Mylar Bags",
    slug: "custom-resealable-mylar-bags",
    categorySlug: "mylar-bags",
    categoryName: "Mylar Bags",
    description: "Airtight, moisture-proof barrier pouches equipped with heavy-duty zip locks, tear notches, and metallic or matte finishes.",
    imageUrl: "/images/reliable-packaging-boxes.jpg",
    minQuantity: 100,
    leadTime: "10-12 Days",
    startingPrice: null,
    materials: ["Standard Mylar", "Kraft Mylar", "Holographic Film", "Clear Window Mylar"],
    finishes: ["Matte Soft-Touch", "Glossy Finish", "Holographic Foil", "Direct Spot UV"],
  },
  {
    id: "prod-3",
    name: "Domino's Black Pizza Boxes",
    slug: "dominos-black-pizza-box",
    categorySlug: "food-boxes",
    categoryName: "Food Boxes",
    description: "Heavy-duty fluted corrugated pizza cartons designed for heat retention, steam ventilation, and structural stackability.",
    imageUrl: "https://packaginghype.com/wp-content/uploads/2025/03/cardboard-boxes.webp",
    minQuantity: 250,
    leadTime: "8-10 Days",
    startingPrice: null,
    materials: ["E-Flute Corrugated", "B-Flute Corrugated", "Recycled Kraft"],
    finishes: ["Food-Grade Inks", "Flexographic Printing", "Ventilation Die-Cuts"],
  },
  {
    id: "prod-4",
    name: "Magnetic Closure Gift Boxes",
    slug: "magnetic-closure-gift-boxes",
    categorySlug: "rigid-boxes",
    categoryName: "Rigid Boxes",
    description: "Sturdy rigid paperboard boxes with concealed neodymium magnetic closures, luxury ribbon pull tabs, and custom foam inserts.",
    imageUrl: "/images/hero-packaging.jpg",
    minQuantity: 100,
    leadTime: "12-14 Days",
    startingPrice: null,
    materials: ["1000 GSM Greyboard", "1200 GSM Heavy Rigid", "Black Velvet Lining"],
    finishes: ["Hot Foil Stamping", "Embossed Logo", "Anti-Scratch Matte"],
  },
  {
    id: "prod-5",
    name: "CBD Cream Boxes",
    slug: "cbd-cream-boxes",
    categorySlug: "cbd-boxes",
    categoryName: "CBD Boxes",
    description: "Sleek cosmetic-grade cartons tailored for glass jars and plastic tubs with secure tuck bottoms and regulatory text printing.",
    imageUrl: "/images/reliable-packaging-boxes.jpg",
    minQuantity: 100,
    leadTime: "8-10 Days",
    startingPrice: null,
    materials: ["16 PT Cardstock", "18 PT Cardstock", "Recycled Kraft"],
    finishes: ["Spot UV Gloss", "Embossing", "Soft-Touch Coating"],
  },
  {
    id: "prod-6",
    name: "Collapsible Luxury Gift Boxes",
    slug: "collapsible-gift-boxes",
    categorySlug: "rigid-boxes",
    categoryName: "Rigid Boxes",
    description: "Space-saving flat-pack rigid cartons that pop up into sturdy luxury presentation boxes with adhesive corner strips.",
    imageUrl: "/images/hero-packaging.jpg",
    minQuantity: 100,
    leadTime: "12-14 Days",
    startingPrice: null,
    materials: ["1200 GSM Rigid Board", "Art Paper Wrap", "Kraft Paper Wrap"],
    finishes: ["Foil Stamping", "Debossing", "Magnetic Front Flap"],
  },
];

/**
 * Verified B2B Value Propositions from PackagingHype.com
 */
export const VERIFIED_VALUE_PROPS: ValuePropItem[] = [
  {
    title: "Free Design Support & 3D Proofs",
    description: "Our dedicated packaging engineers inspect your artwork, provide free dieline templates, and deliver interactive 3D digital mockups before production.",
    iconName: "Palette",
  },
  {
    title: "Low Minimum Order (MOQ 100)",
    description: "Scale your business with flexible production runs starting as low as 100 units. Test new product variations without overwhelming capital commitment.",
    iconName: "Layers",
  },
  {
    title: "Fast 8-10 Day Turnaround",
    description: "Industry-leading production speeds ensure your custom boxes are printed, die-cut, and finished on tight commercial schedules.",
    iconName: "Clock",
  },
  {
    title: "Free USA Delivery",
    description: "Enjoy zero shipping fees across the United States. Your boxes arrive securely packed, palletized, and ready for retail distribution.",
    iconName: "Truck",
  },
  {
    title: "No Die or Plate Charges",
    description: "Eliminate expensive setup costs. We do not charge separate die-cutting or printing plate setup fees on custom orders.",
    iconName: "ShieldCheck",
  },
  {
    title: "Eco-Friendly Sustainable Materials",
    description: "Choose from 100% recyclable, biodegradable FSC-certified kraft paperboards and soy-based non-toxic inks.",
    iconName: "Leaf",
  },
];

/**
 * 4-Step Packaging Workflow
 */
export const VERIFIED_WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Request Custom Quote",
    description: "Select your preferred box style, provide exact dimensions (Length × Width × Depth), specify quantity, and upload your branding artwork.",
  },
  {
    step: "02",
    title: "Approve 3D Digital Proof",
    description: "Our prepress team generates an accurate 2D dieline layout and 3D digital rendering for you to review and approve color placement.",
  },
  {
    step: "03",
    title: "Precision Manufacturing",
    description: "Your packaging enters production utilizing high-speed offset or digital presses, custom die-cutting, folding, and optional luxury foil finishes.",
  },
  {
    step: "04",
    title: "Fast Doorstep Delivery",
    description: "Orders undergo comprehensive QC inspection and are shipped flat with free door-to-door ground shipping across the United States.",
  },
];

/**
 * Verified FAQs from PackagingHype.com
 */
export const VERIFIED_FAQS: FAQItem[] = [
  {
    question: "What is your minimum order quantity (MOQ)?",
    answer: "Our minimum order quantity starts at just 100 boxes for most custom printed folding cartons and corrugated mailers, allowing emerging brands and enterprises alike to order what they need.",
  },
  {
    question: "Do you offer free digital 3D design proofs before printing?",
    answer: "Yes! Every quote includes complimentary dieline layout assistance and a 3D digital proof. Production begins only after you have reviewed and signed off on your final artwork approval.",
  },
  {
    question: "What is the standard turnaround time?",
    answer: "Our standard manufacturing turnaround is 8 to 10 business days after final artwork approval. Expedited production runs are also available upon request.",
  },
  {
    question: "Are there any hidden die or plate setup charges?",
    answer: "No. Unlike traditional packaging suppliers, PackagingHype does not charge separate die or plate fees. The quote you receive is all-inclusive.",
  },
  {
    question: "What file formats should I submit for artwork?",
    answer: "We prefer print-ready vector files: Adobe Illustrator (.AI), PDF, or EPS with fonts outlined and colors configured in CMYK. High-resolution raster files (.PSD, TIFF, PNG at 300+ DPI) are also accepted.",
  },
  {
    question: "Is shipping free across the United States?",
    answer: "Yes, standard ground shipping is 100% free anywhere within the continental United States on all custom packaging orders.",
  },
];

/**
 * Verified Contact and Business Details
 */
export const VERIFIED_BUSINESS_INFO = {
  name: "Packaging Hype",
  phone: "+1(332) 252 9988",
  phoneRaw: "+13322529988",
  email: "info@packaginghype.com",
  turnaround: "8-10 Business Days",
  moq: 100,
  shipping: "Free across the USA",
};

/** Header navigation structure */
export const NAV_INDUSTRIES = [
  { name: "Cosmetic Boxes", slug: "cosmetic-boxes" },
  { name: "Food Boxes", slug: "food-boxes" },
  { name: "CBD Boxes", slug: "cbd-boxes" },
  { name: "Candle Boxes", slug: "candle-boxes" },
  { name: "Soap Boxes", slug: "soap-boxes" },
  { name: "Apparel Boxes", slug: "apparel-boxes" },
  { name: "Bakery Boxes", slug: "bakery-boxes" },
  { name: "Bottle Boxes", slug: "bottle-boxes" },
  { name: "Medicine Boxes", slug: "medicine-boxes" },
  { name: "Toy Boxes", slug: "toy-boxes" },
  { name: "Gift Boxes", slug: "gift-boxes" },
  { name: "Retail Boxes", slug: "retail-boxes" },
] as const;

export const NAV_BOX_BY_MATERIAL = [
  { name: "Kraft Boxes", slug: "kraft-boxes" },
  { name: "Corrugated Boxes", slug: "corrugated-boxes" },
  { name: "Rigid Boxes", slug: "rigid-boxes" },
  { name: "Mailer Boxes", slug: "mailer-boxes" },
  { name: "Mylar Bags", slug: "mylar-bags" },
  { name: "Display Boxes", slug: "display-boxes" },
] as const;

