"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  ChevronDown,
  UploadCloud,
  X,
  FileCheck,
} from "lucide-react";

interface QuoteRequestFormProps {
  initialProductName?: string;
  className?: string;
}

const QUANTITIES = [
  { value: "100", label: "100 units (MOQ)" },
  { value: "250", label: "250 units" },
  { value: "500", label: "500 units" },
  { value: "1000", label: "1,000 units" },
  { value: "2500", label: "2,500 units" },
  { value: "5000", label: "5,000 units" },
  { value: "10000", label: "10,000+ units (Bulk)" },
];

const BOX_TYPES = [
  "Mailer Boxes",
  "Folding Cartons",
  "Rigid Luxury Boxes",
  "Corrugated Shipping Boxes",
  "Retail Display Boxes",
  "Kraft Paper Boxes",
  "Bakery & Food Boxes",
  "Cosmetics & Beauty Boxes",
  "Apparel & Pillow Boxes",
  "Custom Die-Cut Packaging",
];

const COLORS = [
  "1-Color Simple Print",
  "2-Color Print",
  "4/0 CMYK Full Color Outside",
  "4/4 Full Color Inside & Outside",
  "Plain / No Printing (Unprinted)",
];

function newCaptcha() {
  const a = 2 + Math.floor(Math.random() * 7);
  const b = 2 + Math.floor(Math.random() * 7);
  return { a, b, answer: a + b };
}

const inputClass =
  "h-12 w-full rounded-[6px] border border-[#E2E4E8] bg-white px-3.5 text-sm font-medium text-[#172455] placeholder:text-[#8E95A5] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/15";

const selectClass =
  "h-12 w-full appearance-none rounded-[6px] border border-[#E2E4E8] bg-white px-3.5 pr-9 text-sm font-medium text-[#172455] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/15 cursor-pointer";

export function QuoteRequestForm({
  initialProductName = "",
  className = "",
}: QuoteRequestFormProps) {
  const [captcha, setCaptcha] = useState({ a: 4, b: 7, answer: 11 });

  useEffect(() => {
    setCaptcha(newCaptcha());
  }, []);

  const [formData, setFormData] = useState({
    length: "",
    width: "",
    depth: "",
    dimensionsUnit: "inch",
    colors: "",
    expectedDate: "",
    quantity: "",
    boxType: initialProductName || "",
    contactName: "",
    phone: "",
    email: "",
    captchaInput: "",
    brief: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [quoteRefNumber, setQuoteRefNumber] = useState("");

  const minDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  }, []);

  function patch(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: "Max file size is 25 MB" }));
        setSelectedFile(null);
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.file;
          return next;
        });
        setSelectedFile(file);
      }
    }
  };

  function validate() {
    const next: Record<string, string> = {};
    if (!formData.contactName.trim()) next.contactName = "Name is required";
    if (!formData.phone.trim()) next.phone = "Phone number is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Valid business email required";
    }
    if (!formData.quantity) next.quantity = "Please select a quantity";
    if (Number(formData.captchaInput) !== captcha.answer) {
      next.captchaInput = "Incorrect answer";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    const messageDetails = [
      formData.brief.trim(),
      formData.boxType ? `Selected Box Type: ${formData.boxType}` : "",
      formData.expectedDate ? `Expected Delivery Date: ${formData.expectedDate}` : "",
      formData.colors ? `Color Specs: ${formData.colors}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: formData.contactName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          productName: formData.boxType || initialProductName || "Custom Box Quote",
          quantity: Number(formData.quantity) || 100,
          length: formData.length ? Number(formData.length) : undefined,
          width: formData.width ? Number(formData.width) : undefined,
          depth: formData.depth ? Number(formData.depth) : undefined,
          dimensionsUnit: formData.dimensionsUnit,
          colors: formData.colors || undefined,
          message: messageDetails || undefined,
          fileName: selectedFile?.name || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus("success");
        setQuoteRefNumber(data.quoteNumber || `PH-${Date.now().toString().slice(-6)}`);
        setStatusMessage(
          data.message ||
            "Your custom quote request has been received. Our engineering team is reviewing your specifications and will respond with wholesale pricing and complimentary 3D digital proof within 24 hours."
        );
      } else {
        setSubmitStatus("error");
        setStatusMessage(data.error || "Failed to submit quote request. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setStatusMessage("A network error occurred. Please try again or reach us by phone.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFormData({
      length: "",
      width: "",
      depth: "",
      dimensionsUnit: "inch",
      colors: "",
      expectedDate: "",
      quantity: "",
      boxType: initialProductName || "",
      contactName: "",
      phone: "",
      email: "",
      captchaInput: "",
      brief: "",
    });
    setSelectedFile(null);
    setCaptcha(newCaptcha());
    setSubmitStatus("idle");
    setQuoteRefNumber("");
  }

  if (submitStatus === "success") {
    return (
      <div className={`overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white p-6 sm:p-10 ${className}`}>
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#21AAA5]">
            Quote Request Confirmed
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172455]">
            Thank You, {formData.contactName}!
          </h3>
          {quoteRefNumber && (
            <div className="mt-3 inline-block rounded-[6px] border border-[#E5E7EB] bg-[#F6F8FA] px-3 py-1 font-mono text-xs font-semibold text-[#FF5548]">
              Reference ID: {quoteRefNumber}
            </div>
          )}
          <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">
            {statusMessage}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[#FF5548] px-6 text-sm font-bold text-white transition-colors hover:bg-[#e04337]"
            >
              Request Another Quote
            </button>
            <a
              href="/categories"
              className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white px-6 text-sm font-bold text-[#172455] transition-colors hover:bg-[#F6F8FA]"
            >
              Browse Packaging Catalog
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:p-8 ${className}`}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4">
        {/* Row 1: Dimensions (Length, Width, Depth) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <input
              name="length"
              value={formData.length}
              onChange={(e) => patch("length", e.target.value)}
              placeholder="Length"
              inputMode="decimal"
              className={inputClass}
              aria-label="Length"
            />
          </div>
          <div>
            <input
              name="width"
              value={formData.width}
              onChange={(e) => patch("width", e.target.value)}
              placeholder="Width"
              inputMode="decimal"
              className={inputClass}
              aria-label="Width"
            />
          </div>
          <div>
            <input
              name="depth"
              value={formData.depth}
              onChange={(e) => patch("depth", e.target.value)}
              placeholder="Depth"
              inputMode="decimal"
              className={inputClass}
              aria-label="Depth"
            />
          </div>
        </div>

        {/* Row 2: Unit, Color, Expected Date */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <select
              name="dimensionsUnit"
              value={formData.dimensionsUnit}
              onChange={(e) => patch("dimensionsUnit", e.target.value)}
              className={selectClass}
              aria-label="Unit"
            >
              <option value="inch">Unit · Inch</option>
              <option value="cm">Unit · CM</option>
              <option value="mm">Unit · MM</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E95A5]" />
          </div>

          <div className="relative">
            <select
              name="colors"
              value={formData.colors}
              onChange={(e) => patch("colors", e.target.value)}
              className={`${selectClass} ${!formData.colors ? "text-[#8E95A5]" : ""}`}
              aria-label="Color"
            >
              <option value="">Color</option>
              {COLORS.map((c) => (
                <option key={c} value={c} className="text-[#172455]">
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E95A5]" />
          </div>

          <div className="relative">
            <input
              type="date"
              name="expectedDate"
              value={formData.expectedDate}
              min={minDate}
              onChange={(e) => patch("expectedDate", e.target.value)}
              className={`${inputClass} cursor-pointer ${!formData.expectedDate ? "text-[#8E95A5]" : ""}`}
              aria-label="Expected Date"
            />
          </div>
        </div>

        {/* Row 3: Quantity Range, Box Type, Enter Your Name */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <select
              name="quantity"
              value={formData.quantity}
              onChange={(e) => patch("quantity", e.target.value)}
              className={`${selectClass} ${errors.quantity ? "border-[#FF5548]" : ""} ${!formData.quantity ? "text-[#8E95A5]" : ""}`}
              aria-label="Select Quantity Range"
            >
              <option value="">Select Quantity Range</option>
              {QUANTITIES.map((q) => (
                <option key={q.value} value={q.value} className="text-[#172455]">
                  {q.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E95A5]" />
            {errors.quantity && (
              <p className="mt-1 text-[11px] font-medium text-[#FF5548]">{errors.quantity}</p>
            )}
          </div>

          <div className="relative">
            <select
              name="boxType"
              value={formData.boxType}
              onChange={(e) => patch("boxType", e.target.value)}
              className={`${selectClass} ${!formData.boxType ? "text-[#8E95A5]" : ""}`}
              aria-label="Select Box Type"
            >
              <option value="">Select Box Type</option>
              {BOX_TYPES.map((type) => (
                <option key={type} value={type} className="text-[#172455]">
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E95A5]" />
          </div>

          <div>
            <input
              name="contactName"
              value={formData.contactName}
              onChange={(e) => patch("contactName", e.target.value)}
              placeholder="Enter Your Name"
              className={`${inputClass} ${errors.contactName ? "border-[#FF5548]" : ""}`}
              aria-label="Enter Your Name"
            />
            {errors.contactName && (
              <p className="mt-1 text-[11px] font-medium text-[#FF5548]">{errors.contactName}</p>
            )}
          </div>
        </div>

        {/* Row 4: Phone *, Your Email, Answer X+Y (Captcha) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => patch("phone", e.target.value)}
              placeholder="Phone *"
              className={`${inputClass} ${errors.phone ? "border-[#FF5548]" : ""}`}
              aria-label="Phone"
            />
            {errors.phone && (
              <p className="mt-1 text-[11px] font-medium text-[#FF5548]">{errors.phone}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => patch("email", e.target.value)}
              placeholder="Your Email"
              className={`${inputClass} ${errors.email ? "border-[#FF5548]" : ""}`}
              aria-label="Your Email"
            />
            {errors.email && (
              <p className="mt-1 text-[11px] font-medium text-[#FF5548]">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              name="captchaInput"
              value={formData.captchaInput}
              onChange={(e) => patch("captchaInput", e.target.value)}
              placeholder={`Answer ${captcha.a}+${captcha.b}`}
              inputMode="numeric"
              className={`${inputClass} ${errors.captchaInput ? "border-[#FF5548]" : ""}`}
              aria-label={`Answer ${captcha.a}+${captcha.b}`}
            />
            {errors.captchaInput && (
              <p className="mt-1 text-[11px] font-medium text-[#FF5548]">
                {errors.captchaInput}
              </p>
            )}
          </div>
        </div>

        {/* Row 5: Short Brief textarea */}
        <div>
          <textarea
            name="brief"
            rows={3}
            value={formData.brief}
            onChange={(e) => patch("brief", e.target.value)}
            placeholder="Short Brief About your requirement..."
            className="w-full resize-y rounded-[6px] border border-[#E2E4E8] bg-white px-3.5 py-3 text-sm font-medium text-[#172455] placeholder:text-[#8E95A5] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/15"
          />
        </div>

        {/* Optional Artwork / File Attachment Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {!showFileUpload && !selectedFile ? (
            <button
              type="button"
              onClick={() => setShowFileUpload(true)}
              className="inline-flex items-center gap-1.5 font-semibold text-[#21AAA5] hover:text-[#147A76] transition-colors"
            >
              <UploadCloud className="h-4 w-4" />
              + Attach Artwork or Dieline (Optional)
            </button>
          ) : (
            <div className="flex w-full items-center justify-between gap-3 rounded-[6px] border border-[#E2E4E8] bg-[#F6F8FA] px-3 py-2">
              <label className="flex flex-1 cursor-pointer items-center gap-2 text-xs">
                <FileCheck className="h-4 w-4 text-[#21AAA5]" />
                <span className="truncate text-[#4B5563]">
                  {selectedFile
                    ? `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`
                    : "Upload file (.ai, .pdf, .psd, .png, .jpg up to 25 MB)"}
                </span>
                <input
                  type="file"
                  accept=".ai,.pdf,.psd,.eps,.png,.jpg,.jpeg,.zip"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile ? (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-[#6B7280] hover:text-[#172455]"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowFileUpload(false)}
                  className="text-[#6B7280] hover:text-[#172455]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          {errors.file && <p className="text-[11px] text-[#FF5548]">{errors.file}</p>}
        </div>

        {/* Error banner */}
        {submitStatus === "error" && (
          <div className="flex items-start gap-2 rounded-[6px] border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Row 6: Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-[#FF5548] px-6 text-[15px] font-extrabold uppercase tracking-wide text-white transition-all hover:bg-[#e04337] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-[#FF5548]/25"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Quote Request...
              </>
            ) : (
              <>
                Request Free Quote
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] font-medium text-[#6B7280]">
          ✓ Free 3D digital proofing included · Wholesale direct manufacturer · Fast 8-10 business day turnaround
        </p>
      </form>
    </div>
  );
}
