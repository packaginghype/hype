export interface CategoryFaqItem {
  question: string;
  answer: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  productCount?: number;
  /** Full CMS payload for single category pages */
  cms?: {
    originalPrice?: number | null;
    discountedPrice?: number | null;
    inStock: boolean;
    bannerEnabled: boolean;
    bannerQuoteEnabled: boolean;
    bannerHeading?: string;
    bannerDescription?: string;
    bannerImageUrl?: string;
    bannerImageAlt?: string;
    bannerImageTitle?: string;
    imageAlt?: string;
    imageTitle?: string;
    widgetsContent?: string | null;
    listingHeading?: string;
    listingText?: string;
    navbarEnabled: boolean;
    featureEnabled: boolean;
    pageScrollEnabled: boolean;
    pageScrollImageUrl?: string;
    pageScrollImageAlt?: string;
    pageScrollImageTitle?: string;
    pageScrollContent?: string;
    faqsHeading?: string;
    faqsSubheading?: string;
    faqsImageUrl?: string;
    faqsImageAlt?: string;
    faqs: CategoryFaqItem[];
    seoEnabled: boolean;
    seoTitle?: string;
    seoKeywords?: string;
    seoDescription?: string;
    seoScript?: string;
    isPublished: boolean;
  };
}

export interface ProductSpecItem {
  heading: string;
  details: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  fullDescription?: string;
  imageUrl: string;
  imageUrls?: string[];
  startingPrice?: number | null;
  discountedPrice?: number | null;
  inStock?: boolean;
  minQuantity: number;
  leadTime: string;
  materials?: string[];
  finishes?: string[];
  breadcrumbs?: { label: string; href?: string }[];
  cms?: {
    thumbnailAlt?: string;
    thumbnailTitle?: string;
    thumbnailSubDescription?: string;
    videoUrl?: string;
    videoThumbnailUrl?: string;
    videoDescription?: string;
    detailHeading?: string;
    detailShortDescription?: string;
    specsHeading?: string;
    specsDescription?: string;
    specsTableHeading?: string;
    specs: ProductSpecItem[];
    widgetsContent?: string;
    relevantProductsHeading?: string;
    relevantProductsDescription?: string;
    relatedBlogsHeading?: string;
    relatedBlogsDescription?: string;
    relatedBlogIds?: string[];
    pageScrollEnabled: boolean;
    pageScrollImageUrl?: string;
    pageScrollImageAlt?: string;
    pageScrollImageTitle?: string;
    pageScrollContent?: string;
    faqsHeading?: string;
    faqsSubheading?: string;
    faqsImageUrl?: string;
    faqsImageAlt?: string;
    faqs: { question: string; answer: string }[];
    merchantImageUrls?: string[];
    navbarEnabled: boolean;
    featureEnabled: boolean;
    seoEnabled: boolean;
    seoTitle?: string;
    seoKeywords?: string;
    seoDescription?: string;
    seoScript?: string;
  };
}

export interface RelatedBlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  thumbnailImageUrl?: string | null;
  publishedDate: string | Date;
  author?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ValuePropItem {
  title: string;
  description: string;
  iconName: string;
}

export interface QuoteFormData {
  contactName: string;
  email: string;
  phone: string;
  productName?: string;
  quantity: number;
  length?: number;
  width?: number;
  depth?: number;
  dimensionsUnit: "inch" | "cm" | "mm";
  colors?: string;
  materialStock?: string;
  message?: string;
  files?: FileList | null;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}
