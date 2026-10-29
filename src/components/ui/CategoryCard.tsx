import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryItem } from "@/types";
import { SafeImage } from "@/components/ui/SafeImage";
import { CATALOG_TILE } from "@/components/ui/CatalogTile";

interface CategoryCardProps {
  category: CategoryItem;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const href =
    category.group === "industries"
      ? `/industry/${category.slug}`
      : `/category/${category.slug}`;

  return (
    <Link href={href} className={CATALOG_TILE.shell}>
      <div className={CATALOG_TILE.media}>
        <SafeImage
          src={category.imageUrl || ""}
          alt={`${category.name} custom packaging`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={CATALOG_TILE.mediaImage}
          loading="lazy"
        />
        <div className="absolute right-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-[#172455] shadow-xs backdrop-blur-xs">
          Custom Made
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-lg font-bold text-[#172455] transition-colors duration-200 group-hover:text-[#FF5548]">
          {category.name}
        </h3>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-500 line-clamp-2 sm:text-sm">
          {category.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#21AAA5] transition-colors group-hover:text-[#172455]">
          <span>Explore Options</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
