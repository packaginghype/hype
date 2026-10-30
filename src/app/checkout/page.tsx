import { Metadata } from "next";
import { CheckoutPageClient } from "@/components/cart/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your packaging order request. No payment is required at this stage — our team will contact you with a final quote.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
