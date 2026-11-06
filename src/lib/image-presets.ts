/**
 * Canonical image dimensions & aspect ratio definitions
 * for Product and Category pages.
 */

/** No 1: Product detail gallery images — 900 × 900 px (1:1) */
export const PRODUCT_IMAGE = {
  recommended: "900 × 900 px (1:1)",
  hint: "Max 1.5MB · JPG, PNG, WEBP · upload at 900×900",
  aspectClass: "aspect-square",
  width: 900,
  height: 900,
} as const;

/** No 2: Product & Category card + slider thumbnails — 900 × 900 px (1:1) */
export const CARD_IMAGE = {
  recommended: "900 × 900 px (1:1)",
  hint: "Max 1MB · JPG, PNG, WEBP · upload at 900×900",
  aspectClass: "aspect-square",
  width: 900,
  height: 900,
} as const;

/** No 3: Product page content section image — 1200 × 900 px (4:3) */
export const PRODUCT_CONTENT_IMAGE = {
  recommended: "1200 × 900 px (4:3)",
  hint: "Max 2MB · JPG, PNG, WEBP · upload at 1200×900",
  aspectClass: "aspect-[4/3]",
  width: 1200,
  height: 900,
} as const;

/** No 4: Product page FAQs side image — 800 × 800 or 1200 × 900 px */
export const PRODUCT_FAQ_IMAGE = {
  recommended: "800 × 800 (1:1) or 1200 × 900 px (4:3)",
  hint: "Max 2MB · JPG, PNG, WEBP",
  aspectClass: "aspect-square sm:aspect-[4/3]",
} as const;

/** No 5: Product page merchant section image — 900 × 900 px (1:1) */
export const PRODUCT_MERCHANT_IMAGE = {
  recommended: "900 × 900 px (1:1)",
  hint: "Max 1.5MB · JPG, PNG, WEBP · upload at 900×900",
  aspectClass: "aspect-square",
  width: 900,
  height: 900,
} as const;

/** Category banner image — 1200 × 840 px (10:7) */
export const CATEGORY_BANNER_IMAGE = {
  recommended: "1200 × 840 px (10:7)",
  hint: "Max 2MB · JPG, PNG, WEBP · upload at 1200×840",
  aspectClass: "aspect-[10/7]",
  width: 1200,
  height: 840,
} as const;

/** Category thumbnail — 900 × 900 px (1:1) */
export const CATEGORY_THUMBNAIL_IMAGE = {
  recommended: "900 × 900 px (1:1)",
  hint: "Max 1MB · JPG, PNG, WEBP · upload at 900×900",
  aspectClass: "aspect-square",
  width: 900,
  height: 900,
} as const;

/** Category content section image — 1200 × 900 px (4:3) */
export const CATEGORY_CONTENT_IMAGE = {
  recommended: "1200 × 900 px (4:3)",
  hint: "Max 2MB · JPG, PNG, WEBP · upload at 1200×900",
  aspectClass: "aspect-[4/3]",
  width: 1200,
  height: 900,
} as const;

/** Category FAQs side image — 800 × 800 or 1200 × 900 px */
export const CATEGORY_FAQ_IMAGE = {
  recommended: "800 × 800 (1:1) or 1200 × 900 px (4:3)",
  hint: "Max 2MB · JPG, PNG, WEBP",
  aspectClass: "aspect-square sm:aspect-[4/3]",
} as const;
