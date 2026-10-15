"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import type { CartAddInput } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  item,
  className,
  label = "Add to Cart ›",
  redirectToCart = true,
  showIcon = true,
}: {
  item: CartAddInput;
  className?: string;
  label?: string;
  redirectToCart?: boolean;
  showIcon?: boolean;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(item);
        setAdded(true);
        if (redirectToCart) {
          router.push("/cart");
          return;
        }
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[4px] bg-[#172455] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0f1839] sm:text-sm",
        className
      )}
    >
      {showIcon ? <ShoppingCart className="h-3.5 w-3.5" /> : null}
      {added && !redirectToCart ? "Added!" : label}
    </button>
  );
}
