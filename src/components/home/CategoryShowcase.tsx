import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VERIFIED_CATEGORIES } from "@/data/verified-data";

export function CategoryShowcase() {
  const styles = VERIFIED_CATEGORIES.slice(0, 8);

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
              Box Styles
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
              Trending & Popular Custom Box Styles
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-[15px]">
              Pick a structure that fits your product weight, shelf look, and unboxing
              experience.
            </p>
          </div>
          <Link
            href="/shapes-styles"
            className="inline-flex h-11 items-center gap-2 rounded-[5px] bg-[#172455] px-5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#0f1839]"
          >
            View All Styles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {styles.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5] focus-visible:ring-offset-2"
            >
              <div className="relative aspect-square overflow-hidden bg-[#F0EBE3]">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <Package className="h-10 w-10" />
                  </div>
                )}
              </div>
              <p className="mt-3 text-center text-sm font-semibold leading-snug text-[#172455] transition-colors group-hover:text-[#FF5548] sm:text-[15px]">
                Custom {category.name.replace(/^Custom\s+/i, "")}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
