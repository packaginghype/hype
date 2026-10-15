"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useCart } from "@/components/cart/CartProvider";
import { cartLineTotal, formatMoney } from "@/lib/cart";

export function CartPageClient() {
  const { items, subtotal, ready, removeItem, updateQuantity } = useCart();

  if (!ready) {
    return (
      <div className="min-h-[50vh] bg-white py-10 sm:py-14">
        <Container>
          <p className="text-sm text-gray-500">Loading cart…</p>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs items={[{ label: "Cart" }]} />
          <div className="mx-auto mt-14 max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F6F8FA] text-[#172455]">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[#172455]">
              Your cart is empty
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Add packaging products, then proceed to checkout to submit your
              order request.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[5px] bg-[#FF5548] px-5 text-sm font-bold text-white transition-colors hover:bg-[#e04337]"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex h-11 items-center justify-center rounded-[5px] border border-[#D9DDE3] bg-white px-5 text-sm font-bold text-[#172455] transition-colors hover:border-[#172455]"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const itemLabel = items.length === 1 ? "1 item" : `${items.length} items`;

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Cart" }]} />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#172455] sm:text-[2.15rem]">
              Your Cart
            </h1>
            <p className="mt-1.5 text-sm text-gray-600">
              {itemLabel} ready for checkout · Free USA shipping
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#172455] transition-colors hover:text-[#FF5548]"
          >
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-3 lg:col-span-8">
            {items.map((item) => {
              const line = cartLineTotal(item);
              return (
                <article
                  key={item.id}
                  className="rounded-[8px] border border-[#E8EAEF] bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-4 sm:items-center">
                    <Link
                      href={item.href || `/products/${item.slug}`}
                      className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[6px] bg-[#F6F8FA] sm:h-24 sm:w-24"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={item.href || `/products/${item.slug}`}
                            className="block text-[15px] font-bold leading-snug text-[#172455] transition-colors hover:text-[#FF5548] sm:text-base"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-[13px] text-gray-500">
                            From{" "}
                            <span className="font-semibold text-[#FF5548]">
                              {formatMoney(item.unitPrice)}
                            </span>{" "}
                            / box
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-gray-400 transition-colors hover:bg-[#FFF5F4] hover:text-[#FF5548]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center overflow-hidden rounded-[5px] border border-[#E2E4E8] bg-[#F7F8FA]">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="flex h-9 w-9 items-center justify-center text-[#172455] transition-colors hover:bg-[#EDEFF2]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-10 px-1 text-center text-sm font-bold text-[#172455]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center text-[#172455] transition-colors hover:bg-[#EDEFF2]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="text-sm font-bold text-[#172455]">
                          {formatMoney(line)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
              <div className="border-b border-[#E8EAEF] px-5 py-4">
                <h2 className="text-base font-extrabold text-[#172455]">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-3 px-5 py-5 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal ({itemLabel})</span>
                  <span className="font-semibold text-[#172455]">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-[#21AAA5]" aria-hidden />
                    Shipping
                  </span>
                  <span className="font-semibold text-[#21AAA5]">Free</span>
                </div>

                <div className="border-t border-[#E8EAEF] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172455]">Estimated Total</span>
                    <span className="text-lg font-extrabold text-[#FF5548]">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-snug text-gray-400">
                    Final pricing confirmed after artwork review.
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF5548] text-[14px] font-bold text-white transition-colors hover:bg-[#e04337]"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/quote"
                  className="flex h-11 w-full items-center justify-center rounded-[5px] border border-[#D9DDE3] text-[13.5px] font-semibold text-[#172455] transition-colors hover:border-[#172455]"
                >
                  Request a Quote Instead
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
