export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  productCount?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  imageUrl: string;
  startingPrice?: number | null;
  minQuantity: number;
  leadTime: string;
  materials?: string[];
  finishes?: string[];
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
