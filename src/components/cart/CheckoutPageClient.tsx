"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Package,
  Pencil,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SafeImage } from "@/components/ui/SafeImage";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/cart";

const PAYMENT_OPTIONS = [
  "PayPal",
  "American Express",
  "Discover",
  "Mastercard",
  "Visa",
  "Others",
] as const;

const inputClass =
  "w-full rounded-[6px] border border-[#D9DDE3] bg-white px-3.5 py-2.5 text-sm text-[#172455] outline-none placeholder:text-gray-400 focus:border-[#FF5548]";

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, subtotal, ready, clearCart } = useCart();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    notes: "",
    paymentMethod: "Visa",
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Valid email required";
    }
    if (!form.address.trim()) next.address = "Required";
    if (!form.city.trim()) next.city = "Required";
    if (!form.state.trim()) next.state = "Required";
    if (!form.zip.trim()) next.zip = "Required";
    if (!form.country.trim()) next.country = "Required";
    if (!form.agree) next.agree = "Please accept the terms to continue";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;

    setIsSubmitting(true);
    setSubmitError("");

    const cartLines = items
      .map(
        (item) =>
          `${item.name} × ${item.quantity} @ ${formatMoney(item.unitPrice)} (${item.href || `/product/${item.slug}`})`
      )
      .join("\n");

    const message = [
      "Cart order request",
      `Address: ${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
      form.notes ? `Notes: ${form.notes}` : null,
      `Preferred payment: ${form.paymentMethod}`,
      "",
      "Items:",
      cartLines,
    ]
      .filter(Boolean)
      .join("\n");

    const primary = items[0];
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: `${form.firstName.trim()} ${form.lastName.trim()}`,
          email: form.email.trim(),
          phone: form.phone.trim() || "Not provided",
          productName:
            items.length === 1
              ? primary.name
              : `Cart order (${items.length} items)`,
          quantity: totalQty,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit order request.");
        return;
      }
      clearCart();
      setSuccessMessage(
        data.message ||
          "Your order request was submitted. Our team will contact you shortly."
      );
    } catch {
      setSubmitError("Network error. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-[50vh] bg-white py-10">
        <Container>
          <p className="text-sm text-gray-500">Loading checkout…</p>
        </Container>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="min-h-[60vh] bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-[#F8FAFC] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf7f6] text-[#21AAA5]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-[#172455]">
              Order Request Submitted
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{successMessage}</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/product"
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337]"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => router.push("/quote")}
                className="text-sm font-semibold text-[#172455] hover:text-[#FF5548]"
              >
                Request another quote
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white py-10 sm:py-14">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
          />
          <div className="mx-auto mt-12 max-w-lg text-center">
            <h1 className="text-2xl font-bold text-[#172455]">Your cart is empty</h1>
            <p className="mt-2 text-sm text-gray-500">
              Add packaging products before proceeding to checkout.
            </p>
            <Link
              href="/product"
              className="mt-6 inline-flex items-center gap-1.5 rounded-[6px] bg-[#172455] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0f1839]"
            >
              Browse Products
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
        <Breadcrumbs
          items={[
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />

        <div className="mt-4 max-w-2xl">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#172455] sm:text-4xl">
            CHECKOUT
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
            Complete your order request below. No payment is required at this stage —
            our team will contact you with a final quote.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-[#F0D9D6] bg-[#FFF8F6] p-4 sm:p-6 lg:col-span-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First Name*" error={errors.firstName}>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name*"
                  className={inputClass}
                />
              </Field>
              <Field label="Last Name*" error={errors.lastName}>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name*"
                  className={inputClass}
                />
              </Field>
              <Field label="Email Address*" error={errors.email}>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address*"
                  className={inputClass}
                />
              </Field>
              <Field label="Phone (Optional)">
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone (Optional)"
                  className={inputClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address*" error={errors.address}>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Address*"
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="City*" error={errors.city}>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City*"
                  className={inputClass}
                />
              </Field>
              <Field label="State/Province*" error={errors.state}>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State/Province*"
                  className={inputClass}
                />
              </Field>
              <Field label="ZIP/Postal Code*" error={errors.zip}>
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  placeholder="ZIP/Postal Code*"
                  className={inputClass}
                />
              </Field>
              <Field label="Country/Region*" error={errors.country}>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country/Region*"
                  className={inputClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Order Notes (Optional)">
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Order Notes (Optional)"
                    rows={3}
                    className={`${inputClass} resize-y`}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-[#172455]">
                Preferable Payment Method (Optional)
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#172455]"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option}
                      checked={form.paymentMethod === option}
                      onChange={handleChange}
                      className="accent-[#FF5548]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-[#FF5548]/40 bg-[#FFF1EF] px-4 py-3.5">
              <div className="flex gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5548]" />
                <div>
                  <p className="text-sm font-bold text-[#FF5548]">
                    Important Pricing Notice!
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#7A3A34] sm:text-sm">
                    The displayed total price is based on the starting price and selected
                    quantity. Final price may vary depending on size, material, printing,
                    finishing, artwork and other custom requirements.
                  </p>
                </div>
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm text-[#172455]">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="mt-0.5 accent-[#FF5548]"
              />
              <span>
                I have read and agree to the{" "}
                <Link
                  href="/terms-and-conditions"
                  className="font-semibold text-[#FF5548] hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-[#FF5548] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.agree && (
              <p className="mt-1 text-xs text-[#FF5548]">{errors.agree}</p>
            )}

            <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
              <Lock className="h-3.5 w-3.5" />
              No payment is required at this stage.
            </p>

            {submitError && (
              <div className="mt-4 flex items-start gap-2 rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#FF5548] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#e04337] disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Order Request
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 overflow-hidden rounded-xl border border-[#BFD9E8] bg-white">
              <div className="flex items-center justify-between bg-[#E8F4FA] px-5 py-4">
                <h2 className="text-lg font-bold text-[#172455]">Order Summary</h2>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#172455] hover:text-[#FF5548]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Cart
                </Link>
              </div>

              <div className="space-y-4 px-5 py-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#F6F8FA]">
                      {item.imageUrl ? (
                        <SafeImage
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <Package className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#172455]">{item.name}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Quantity: {item.quantity} Box{item.quantity === 1 ? "" : "es"}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-600">
                        Starting from {formatMoney(item.unitPrice)} per box
                      </p>
                    </div>
                  </div>
                ))}

                <div className="space-y-2 border-t border-gray-200 pt-3 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#21AAA5]">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="font-bold text-[#FF5548]">Estimated Total</span>
                    <span className="font-bold text-[#FF5548]">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="sr-only">{label}</label>
      {children}
      {error ? <p className="mt-1 text-[11px] text-[#FF5548]">{error}</p> : null}
    </div>
  );
}
