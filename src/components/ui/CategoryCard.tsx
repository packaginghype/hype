import React from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { CategoryItem } from "@/types";
import { SafeImage } from "@/components/ui/SafeImage";

interface CategoryCardProps {
  category: CategoryItem;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col bg-white border border-[#E7E7E7] rounded-[5px] overflow-hidden card-hover-effect focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
    >
      <div className="relative w-full aspect-square bg-[#F6F8FA] overflow-hidden flex items-center justify-center p-4">
        <SafeImage
          src={category.imageUrl || "/images/designs/mailer-box.jpg"}
          alt={`${category.name} custom packaging`}
          fallbackSrc="/images/designs/mailer-box.jpg"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-semibold text-[#172455] shadow-xs">
          Custom Made
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-[#172455] group-hover:text-[#FF5548] transition-colors duration-200">
          {category.name}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {category.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#21AAA5] group-hover:text-[#172455] transition-colors">
          <span>Explore Options</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
