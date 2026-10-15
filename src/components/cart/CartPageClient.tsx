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
          <div className="mx-auto mt-12 max-w-lg text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F6F8FA] text-[#172455]">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-[#172455]">Your cart is empty</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Browse products and add packaging items to request a custom quote.
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-1.5 rounded-[6px] bg-[#172455] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0f1839]"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Cart" }]} />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#172455] sm:text-4xl">
              MY CART
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
              Review your selected packaging products. Adjust quantities or proceed to
              checkout to submit your order request.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-[6px] bg-[#172455] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0f1839]"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-4 lg:col-span-8">
            {items.map((item) => {
              const line = cartLineTotal(item);
              return (
                <article
                  key={item.id}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link
                      href={item.href || `/products/${item.slug}`}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white sm:h-28 sm:w-28"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="112px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={item.href || `/products/${item.slug}`}
                        className="text-base font-bold text-[#172455] hover:text-[#FF5548] sm:text-lg"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-600">
                        Starting Price{" "}
                        <span className="font-semibold text-[#FF5548]">
                          {formatMoney(item.unitPrice)}
                        </span>{" "}
                        per box
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        <div className="inline-flex items-center overflow-hidden rounded-md border border-[#D7DEE8] bg-white">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="flex h-9 w-9 items-center justify-center bg-[#EEF2F6] text-[#172455] hover:bg-[#E2E8F0]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-10 px-2 text-center text-sm font-semibold text-[#172455]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center bg-[#172455] text-white hover:bg-[#0f1839]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-[#21AAA5]">
                            {formatMoney(line)} in total
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF5548] hover:text-[#e04337]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 overflow-hidden rounded-xl border border-[#21AAA5]/35 bg-white">
              <div className="bg-[#EAF7F6] px-5 py-4">
                <h2 className="text-lg font-bold text-[#172455]">Order Summary</h2>
              </div>
              <div className="space-y-3 px-5 py-5 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#172455]">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#21AAA5]">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#FF5548]">Estimated Total</span>
                    <span className="text-lg font-bold text-[#FF5548]">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#21AAA5] px-4 py-3 text-sm font-bold text-white hover:bg-[#1b8e8a]"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
