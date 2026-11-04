/** Product detail gallery images. Upload at this size; not cropped. */
export const PRODUCT_IMAGE = {
  recommended: "1200 × 900 px (4:3)",
  hint: "Max 1MB · JPG, PNG, WEBP · upload at 1200×900",
  aspectClass: "aspect-[4/3]",
} as const;

/** Product / category card + slider thumbnails. Upload at this size; not cropped. */
export const CARD_IMAGE = {
  recommended: "900 × 900 px (1:1)",
  hint: "Max 1MB · JPG, PNG, WEBP · upload at 900×900",
  aspectClass: "aspect-square",
} as const;
