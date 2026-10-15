import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function ReliablePackagingSection() {
  return (
    <section className="py-14 sm:py-18 lg:py-20 bg-white">
      <Container>
        {/* Shared height row on desktop — both columns fill the exact same box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:h-[500px] xl:h-[540px]">
          <div className="relative aspect-[5/4] lg:aspect-auto lg:h-full min-h-0 overflow-hidden rounded-[16px] bg-[#F3F1EE]">
            <Image
              src="/images/reliable-packaging-boxes.jpg"
              alt="Custom packaging boxes for growing businesses"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority={false}
            />
          </div>

          <div className="h-[420px] sm:h-[460px] lg:h-full min-h-0 overflow-y-auto pr-3 reliable-scroll">
            <h2 className="text-[1.65rem] sm:text-[1.85rem] lg:text-[2rem] font-semibold tracking-tight text-[#172455] leading-snug">
              Reliable Packaging for Growing Businesses
            </h2>

            <div className="mt-5 space-y-4 text-[15px] sm:text-base text-[#555555] leading-[1.7]">
              <p>
                Does your packaging reflect the quality of your brand? At Packaging
                Hype, we understand that businesses move quickly and need packaging
                they can depend on. That is why we create reliable, well-designed
                boxes that protect your products while helping your brand make a
                strong impression.
              </p>
              <p>
                Every shipment matters. Your products should arrive safely and look
                professional when they reach your customers. Our focus is simple:
                protect your products, present your brand clearly, and make shipping
                easier for your business.
              </p>
              <p>
                Based in the United States, we produce practical packaging solutions
                that businesses rely on every day. No matter what you sell, our
                custom boxes are designed to keep your products secure and ensure
                they arrive looking just as good as when they left your facility.
              </p>
            </div>

            <h3 className="mt-8 text-[1.45rem] sm:text-[1.65rem] lg:text-[1.75rem] font-semibold tracking-tight text-[#172455] leading-snug">
              Custom Boxes Built Strong for Every Product
            </h3>

            <div className="mt-5 space-y-4 text-[15px] sm:text-base text-[#555555] leading-[1.7]">
              <p>
                No two products are the same, so why should your boxes be? From the
                shelf to the back of a delivery truck, your products need a home that
                fits. At Packaging Hype, we build custom boxes around your exact
                dimensions, materials, and brand presentation — so every order ships
                secure, consistent, and ready to impress.
              </p>
              <p>
                Choose from folding cartons, rigid boxes, mailers, and specialty
                structures with custom printing and finishes that match your product
                line. Low minimums, clear quotes, and free design support keep your
                packaging process simple from first mockup to final delivery.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
