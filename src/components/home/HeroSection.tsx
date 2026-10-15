import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative isolate overflow-hidden bg-[#D8EDE3] rounded-br-[3rem] sm:rounded-br-[4.5rem] lg:rounded-br-[6rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,rgba(255,255,255,0.55),transparent_55%),radial-gradient(ellipse_50%_45%_at_90%_70%,rgba(255,85,72,0.12),transparent_60%),linear-gradient(160deg,#E4F4EB_0%,#D8EDE3_45%,#C9E4D4_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#FF5548]/10 blur-3xl hero-pulse"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -bottom-20 h-64 w-64 rounded-full bg-white/40 blur-2xl"
        />

        <Container className="relative py-12 sm:py-16 lg:py-20 xl:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left hero-fade-up">
              <h1 className="font-heading text-[2rem] leading-[1.12] sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold tracking-tight text-[#0B1220]">
                Custom Packaging Boxes Designed for{" "}
                <span className="text-[#FF5548]">Your Brand</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[#1F2A37]/80 leading-relaxed max-w-xl">
                Create packaging that protects your products and makes your brand
                stand out — tailored sizes, premium materials, custom printing,
                and finishes that match your product.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Button
                  href="/quote"
                  variant="primary"
                  size="lg"
                  className="group shadow-lg shadow-[#FF5548]/25 hover:shadow-xl hover:shadow-[#FF5548]/30 hover:-translate-y-0.5"
                >
                  <span>Get Free Quote</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button
                  href="/products"
                  variant="outline"
                  size="lg"
                  className="border-[#0B1220]/20 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-[#0B1220]"
                >
                  Explore Products
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6 xl:col-span-7 relative hero-fade-up-delay">
              <div className="relative mx-auto w-full max-w-xl lg:max-w-none aspect-[5/4] lg:aspect-[4/3]">
                <div
                  aria-hidden
                  className="absolute inset-x-[8%] bottom-[6%] h-[18%] rounded-[50%] bg-[#0B1220]/10 blur-2xl"
                />
                <Image
                  src="https://packaginghype.com/wp-content/uploads/2025/02/slider-top-brands-1.webp"
                  alt="Custom branded packaging boxes, mailers, and tubs"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain object-bottom drop-shadow-[0_28px_40px_rgba(11,18,32,0.18)] hero-float"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
