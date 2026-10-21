import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import {
  CATEGORY_GROUP_META,
  type CategoryGroupKey,
} from "@/lib/category-groups";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      faqs: { orderBy: { sortOrder: "asc" } },
      products: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" } },
            },
          },
        },
      },
    },
  });
  if (!category) notFound();

  const group = category.group as CategoryGroupKey;
  const meta = CATEGORY_GROUP_META[group] || CATEGORY_GROUP_META.categories;

  const productImages = (category.products || [])
    .flatMap((cp) => [
      cp.product.images.find((img) => img.isPrimary)?.imageUrl,
      ...cp.product.images.map((img) => img.imageUrl),
    ])
    .filter((url): url is string => Boolean(url));

  const candidateImages = Array.from(
    new Set(
      [
        ...productImages,
        category.imageUrl,
        category.bannerImageUrl,
        category.pageScrollImageUrl,
      ].filter(Boolean) as string[]
    )
  );

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href={meta.adminHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5548] hover:text-[#e04337]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {meta.label}
          </Link>
          <h2 className="mt-1 text-2xl font-bold text-[#172455]">
            Edit {meta.singularLabel}: {category.name}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {meta.label} · Slug: <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-[#172455]">{category.slug}</code>
          </p>
        </div>

        <Link
          href={
            category.group === "industries"
              ? `/industry/${category.slug}`
              : `/category/${category.slug}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#172455] bg-white px-3.5 py-2 text-xs font-bold text-[#172455] hover:bg-[#172455] hover:text-white transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Live Page
        </Link>
      </div>
      <CategoryForm
        categoryId={category.id}
        defaultGroup={group}
        defaultImages={candidateImages}
        initial={{
          name: category.name,
          slug: category.slug,
          description: category.description,
          imageUrl: category.imageUrl,
          seoTitle: category.seoTitle,
          seoDescription: category.seoDescription,
          sortOrder: category.sortOrder,
          group,
          originalPrice: category.originalPrice
            ? Number(category.originalPrice)
            : null,
          discountedPrice: category.discountedPrice
            ? Number(category.discountedPrice)
            : null,
          inStock: category.inStock,
          bannerEnabled: category.bannerEnabled,
          bannerQuoteEnabled: category.bannerQuoteEnabled,
          bannerHeading: category.bannerHeading,
          bannerDescription: category.bannerDescription,
          bannerImageUrl: category.bannerImageUrl,
          bannerImageAlt: category.bannerImageAlt,
          bannerImageTitle: category.bannerImageTitle,
          imageAlt: category.imageAlt,
          imageTitle: category.imageTitle,
          widgetsContent: category.widgetsContent,
          listingHeading: category.listingHeading,
          listingText: category.listingText,
          navbarEnabled: category.navbarEnabled,
          featureEnabled: category.featureEnabled,
          pageScrollEnabled: category.pageScrollEnabled,
          pageScrollImageUrl: category.pageScrollImageUrl,
          pageScrollImageAlt: category.pageScrollImageAlt,
          pageScrollImageTitle: category.pageScrollImageTitle,
          pageScrollContent: category.pageScrollContent,
          faqsHeading: category.faqsHeading,
          faqsSubheading: category.faqsSubheading,
          faqsImageUrl: (category as { faqsImageUrl?: string | null }).faqsImageUrl || "",
          faqsImageAlt: (category as { faqsImageAlt?: string | null }).faqsImageAlt || "",
          faqs: category.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          })),
          seoEnabled: category.seoEnabled,
          seoKeywords: category.seoKeywords,
          seoScript: category.seoScript,
          isPublished: category.isPublished,
        }}
      />
    </div>
  );
}
