import React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquareQuote } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function FooterQuoteCta() {
  return (
    <section className="border-t border-[#FFE0DC] bg-[#FFF5F4]">
      <Container className="py-7 sm:py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[#FF5548] text-white">
              <MessageSquareQuote className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="text-[1.05rem] font-extrabold tracking-tight text-[#172455] sm:text-lg">
                Need a custom packaging quote?
              </h2>
              <p className="mt-0.5 text-[13px] leading-snug text-[#555] sm:text-[13.5px]">
                Share your size, quantity, and artwork — we reply with pricing and
                free design support.
              </p>
            </div>
          </div>

          <Link
            href="/quote"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[5px] bg-[#FF5548] px-5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#e04337]"
          >
            Get a Quote
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
