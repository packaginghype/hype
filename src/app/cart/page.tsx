import { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "My Cart | Packaging Hype",
  description:
    "Review your selected packaging products and proceed to checkout to submit your order request.",
};

export default function CartPage() {
  return <CartPageClient />;
}
