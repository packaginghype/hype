"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

interface CategoryQuoteFormProps {
  productName: string;
  startingFrom?: string;
  fullWidthSubmit?: boolean;
  cartItem: {
    id: string;
    slug: string;
    name: string;
    imageUrl?: string;
    unitPrice?: number | null;
    href?: string;
  };
}

const fieldClass =
  "h-10 w-full rounded-[4px] border border-[#D9DDE3] bg-white px-3 text-[13px] text-[#222] outline-none transition-colors placeholder:text-[#9AA3AF] focus:border-[#FF5548] sm:h-11";

const selectClass =
  "h-10 w-full appearance-none rounded-[4px] border border-[#D9DDE3] bg-white px-3 pr-9 text-[13px] text-[#222] outline-none transition-colors focus:border-[#FF5548] sm:h-11";

export function CategoryQuoteForm({
  productName,
  cartItem,
  startingFrom = "Contact",
  fullWidthSubmit = false,
}: CategoryQuoteFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
    phone: "",
    quantity: "",
    length: "",
    width: "",
    depth: "",
    colors: "1-Color",
    materialStock: "12 PT",
    message: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.contactName.trim()) next.contactName = "Required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Valid email required";
    }
    if (!formData.phone.trim()) next.phone = "Required";
    const qty = Number(formData.quantity);
    if (!formData.quantity || qty < 100) next.quantity = "Min 100";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          productName,
          quantity: Number(formData.quantity),
          length: formData.length ? Number(formData.length) : undefined,
          width: formData.width ? Number(formData.width) : undefined,
          depth: formData.depth ? Number(formData.depth) : undefined,
          dimensionsUnit: "inch",
          colors: formData.colors,
          materialStock: formData.materialStock,
          message: formData.message,
          fileName: selectedFile?.name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const refNum = data.quoteNumber || `PH-${Date.now().toString().slice(-6)}`;
        const params = new URLSearchParams({ ref: refNum });
        if (formData.contactName.trim()) params.set("name", formData.contactName.trim().split(" ")[0]);
        router.push(`/thank-you?${params.toString()}`);
      } else {
        setSubmitStatus("error");
        setStatusMessage(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setStatusMessage("Network error. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div
      style={{ maxWidth: "900px" }}
      className="mx-auto w-full max-w-[900px] overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_12px_36px_-12px_rgba(15,23,42,0.14)]"
    >
      {/* Top coral header bar */}
      <div className="flex flex-col gap-3 bg-[#FF5548] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <h2
          style={{ color: "#ffffff", fontWeight: 800 }}
          className="text-[18px] tracking-tight sm:text-[19px]"
        >
          Get Custom Quote
        </h2>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Starting from + price */}
          <div className="flex flex-col text-white">
            <span className="text-[9px] font-medium uppercase leading-none tracking-wide text-white/80">
              Starting from
            </span>
            <div className="flex items-baseline gap-1 leading-none mt-0.5">
              <span className="text-[22px] font-extrabold leading-none sm:text-[24px]">
                {startingFrom}
              </span>
              <span className="text-[9px] text-white/80 leading-none">per box</span>
            </div>
          </div>

          <div className="h-8 w-px bg-white/30" />

          {/* Availability */}
          <div className="flex flex-col text-white">
            <span className="text-[9px] font-medium uppercase leading-none tracking-wide text-white/80">
              Availability
            </span>
            <span className="mt-0.5 text-[13px] font-bold leading-none sm:text-[14px]">
              In Stock
            </span>
          </div>

          <AddToCartButton
            item={{
              ...cartItem,
              quantity: Math.max(1, Number(formData.quantity) || 1),
            }}
            showIcon={true}
            label="Add to Cart"
            className="h-9 shrink-0 rounded-[5px] bg-[#172455] px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-[#0f1839]"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-5 lg:p-6"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <input
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Name"
              className={fieldClass}
              aria-label="Name"
            />
            {errors.contactName && (
              <p className="mt-1 text-[11px] text-[#FF5548]">{errors.contactName}</p>
            )}
          </div>
          <div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={fieldClass}
              aria-label="Email"
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-[#FF5548]">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 123-123-1234"
              className={fieldClass}
              aria-label="Phone"
            />
            {errors.phone && (
              <p className="mt-1 text-[11px] text-[#FF5548]">{errors.phone}</p>
            )}
          </div>
          <div>
            <input
              name="quantity"
              type="number"
              min={100}
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className={fieldClass}
              aria-label="Quantity"
            />
            {errors.quantity && (
              <p className="mt-1 text-[11px] text-[#FF5548]">{errors.quantity}</p>
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            name="length"
            type="number"
            step="0.01"
            value={formData.length}
            onChange={handleChange}
            placeholder="Length"
            className={fieldClass}
            aria-label="Length"
          />
          <input
            name="width"
            type="number"
            step="0.01"
            value={formData.width}
            onChange={handleChange}
            placeholder="Width"
            className={fieldClass}
            aria-label="Width"
          />
          <input
            name="depth"
            type="number"
            step="0.01"
            value={formData.depth}
            onChange={handleChange}
            placeholder="Depth"
            className={fieldClass}
            aria-label="Depth"
          />
          <div className="relative">
            <select
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              className={selectClass}
              aria-label="Colors"
            >
              <option>1-Color</option>
              <option>2-Color</option>
              <option>4/0 CMYK Outside</option>
              <option>4/4 Full Color Both Sides</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
          </div>
        </div>

        {/* Row 3 — file + material + message + submit (inline) */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex h-10 cursor-pointer items-center gap-2.5 rounded-[4px] border border-[#D9DDE3] bg-white px-2.5 sm:h-11">
            <span className="inline-flex h-7 shrink-0 items-center rounded-[3px] border border-[#D1D5DB] bg-[#F3F4F6] px-3 text-[12px] font-medium text-[#172455]">
              Choose File
            </span>
            <span className="min-w-0 truncate text-[12px] text-[#6B7280]">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.ai,.psd,.png,.jpg,.jpeg,.zip"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file && file.size > 25 * 1024 * 1024) {
                  setErrors((prev) => ({ ...prev, file: "Max 25 MB" }));
                  setSelectedFile(null);
                  return;
                }
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.file;
                  return next;
                });
                setSelectedFile(file);
              }}
            />
          </label>

          <div className="relative">
            <select
              name="materialStock"
              value={formData.materialStock}
              onChange={handleChange}
              className={selectClass}
              aria-label="Material"
            >
              <option>12 PT</option>
              <option>14 PT</option>
              <option>16 PT</option>
              <option>18 PT</option>
              <option>Corrugated E-Flute</option>
              <option>Corrugated B-Flute</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
          </div>

          {/* Message takes remaining space + submit button shares the last cell */}
          <input
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Type a message"
            className={fieldClass}
            aria-label="Message"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            data-quote-submit
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#FF5548] px-6 text-[13.5px] font-bold text-white transition-colors hover:bg-[#e04337] disabled:opacity-60 sm:h-11"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Get A Quote
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {errors.file && (
          <p className="mt-2 text-[11px] text-[#FF5548]">{errors.file}</p>
        )}

        {submitStatus === "error" && (
          <div className="mt-3 flex items-start gap-2 rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}
