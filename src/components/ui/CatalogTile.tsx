import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

/** Shared catalog tile — matches Erixum-style proportions across categories, industries, and products. */
export const CATALOG_TILE = {
  media:
    "relative w-full overflow-hidden bg-[#F5F3EF] aspect-[4/5] sm:aspect-square",
  mediaImage:
    "object-contain p-4 sm:p-5 transition-transform duration-500 ease-out group-hover:scale-[1.03]",
  title:
    "mt-0 px-3 py-3.5 text-center text-sm font-semibold leading-snug text-[#172455] transition-colors duration-200 group-hover:text-[#FF5548] sm:text-[15px] line-clamp-2",
  shell:
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5] focus-visible:ring-offset-2",
  grid: "grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10",
} as const;

type CatalogTileProps = {
  href: string;
  title: string;
  imageUrl?: string | null;
  imageAlt?: string;
  subtitle?: string | null;
  className?: string;
  sizes?: string;
};

export function CatalogTile({
  href,
  title,
  imageUrl,
  imageAlt,
  subtitle,
  className,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: CatalogTileProps) {
  return (
    <Link href={href} className={cn(CATALOG_TILE.shell, className)}>
      <div className={CATALOG_TILE.media}>
        <SafeImage
          src={imageUrl || ""}
          alt={imageAlt || title}
          fill
          sizes={sizes}
          className={CATALOG_TILE.mediaImage}
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <p className={CATALOG_TILE.title}>{title}</p>
        {subtitle ? (
          <p className="-mt-2 mb-3 px-3 text-center text-xs text-[#9CA3AF]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
