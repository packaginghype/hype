"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";

const fieldClass =
  "h-11 w-full rounded-[6px] border border-[#E6E8EC] bg-white px-3.5 text-[13.5px] text-[#172455] outline-none placeholder:text-[#9AA3AF] focus:border-[#FF5548]";

const selectClass =
  "h-11 w-full appearance-none rounded-[6px] border border-[#E6E8EC] bg-white px-3.5 pr-9 text-[13.5px] text-[#172455] outline-none focus:border-[#FF5548]";

export default function ProductQuoteForm({ productName }: { productName: string }) {
  const captchaA = useMemo(() => 7, []);
  const captchaB = useMemo(() => 2, []);
  const [form, setForm] = useState({
    length: "",
    width: "",
    depth: "",
    unit: "inch",
    colors: "1-Color",
    quantity: "100",
    boxType: "Tuck End",
    date: "",
    contactName: "",
    phone: "",
    email: "",
    captcha: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    if (!form.contactName.trim()) next.contactName = "Required";
    if (!form.phone.trim()) next.phone = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Valid email required";
    }
    const qty = Number(form.quantity);
    if (!qty || qty < 100) next.quantity = "Min 100";
    if (Number(form.captcha) !== captchaA + captchaB) {
      next.captcha = "Incorrect answer";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setStatus("idle");

    const brief = [
      form.message.trim() || null,
      `Box type: ${form.boxType}`,
      form.date ? `Preferred date: ${form.date}` : null,
      form.length || form.width || form.depth
        ? `Size: ${form.length || "-"} x ${form.width || "-"} x ${form.depth || "-"} ${form.unit}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          productName,
          quantity: Number(form.quantity),
          length: form.length ? Number(form.length) : undefined,
          width: form.width ? Number(form.width) : undefined,
          depth: form.depth ? Number(form.depth) : undefined,
          dimensionsUnit: form.unit,
          colors: form.colors,
          message: brief,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setStatusMessage(data.message || "Quote request received!");
      } else {
        setStatus("error");
        setStatusMessage(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-[#F3D0CB] bg-[#FFF8F6] px-5 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf7f6] text-[#21AAA5]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-3 text-lg font-bold text-[#172455]">Quote Request Received!</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{statusMessage}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 h-10 rounded-[6px] border border-[#172455] px-4 text-sm font-semibold text-[#172455] hover:bg-[#172455] hover:text-white"
        >
          Submit Another Quote
        </button>
      </div>
    );
  }

  return (
    <form
      id="product-quote"
      onSubmit={onSubmit}
      className="rounded-xl border border-[#F3D0CB] bg-[#FFF8F6] p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          name="length"
          value={form.length}
          onChange={onChange}
          placeholder="Length"
          className={fieldClass}
          aria-label="Length"
        />
        <input
          name="width"
          value={form.width}
          onChange={onChange}
          placeholder="Width"
          className={fieldClass}
          aria-label="Width"
        />
        <input
          name="depth"
          value={form.depth}
          onChange={onChange}
          placeholder="Depth"
          className={fieldClass}
          aria-label="Depth"
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative">
          <select
            name="unit"
            value={form.unit}
            onChange={onChange}
            className={selectClass}
            aria-label="Unit"
          >
            <option value="inch">Unit (inch)</option>
            <option value="cm">Unit (cm)</option>
            <option value="mm">Unit (mm)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
        </div>
        <div className="relative">
          <select
            name="colors"
            value={form.colors}
            onChange={onChange}
            className={selectClass}
            aria-label="Color"
          >
            <option>1-Color</option>
            <option>2-Color</option>
            <option>4/0 Full Color</option>
            <option>4/4 Full Color Both Sides</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
        </div>
        <div>
          <input
            name="quantity"
            type="number"
            min={100}
            value={form.quantity}
            onChange={onChange}
            placeholder="Quantity"
            className={fieldClass}
            aria-label="Quantity"
          />
          {errors.quantity ? (
            <p className="mt-1 text-[11px] text-[#FF5548]">{errors.quantity}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative">
          <select
            name="boxType"
            value={form.boxType}
            onChange={onChange}
            className={selectClass}
            aria-label="Box Type"
          >
            <option>Tuck End</option>
            <option>Reverse Tuck End</option>
            <option>Mailer</option>
            <option>Two-Piece Lid & Base</option>
            <option>Sleeve</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
        </div>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={onChange}
          className={fieldClass}
          aria-label="Date"
        />
        <div>
          <input
            name="contactName"
            value={form.contactName}
            onChange={onChange}
            placeholder="Enter Name"
            className={fieldClass}
            aria-label="Name"
          />
          {errors.contactName ? (
            <p className="mt-1 text-[11px] text-[#FF5548]">{errors.contactName}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder="Phone *"
            className={fieldClass}
            aria-label="Phone"
          />
          {errors.phone ? (
            <p className="mt-1 text-[11px] text-[#FF5548]">{errors.phone}</p>
          ) : null}
        </div>
        <div>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="Your Email"
            className={fieldClass}
            aria-label="Email"
          />
          {errors.email ? (
            <p className="mt-1 text-[11px] text-[#FF5548]">{errors.email}</p>
          ) : null}
        </div>
        <div>
          <input
            name="captcha"
            value={form.captcha}
            onChange={onChange}
            placeholder={`Answer ${captchaA}+${captchaB}`}
            className={fieldClass}
            aria-label="Captcha"
          />
          {errors.captcha ? (
            <p className="mt-1 text-[11px] text-[#FF5548]">{errors.captcha}</p>
          ) : null}
        </div>
      </div>

      <textarea
        name="message"
        value={form.message}
        onChange={onChange}
        placeholder="Short Brief About your requirement..."
        rows={4}
        className="mt-3 w-full resize-y rounded-[6px] border border-[#E6E8EC] bg-white px-3.5 py-2.5 text-[13.5px] text-[#172455] outline-none placeholder:text-[#9AA3AF] focus:border-[#FF5548]"
        aria-label="Message"
      />

      {status === "error" ? (
        <div className="mt-3 flex items-start gap-2 rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-[6px] bg-[#FF5548] text-sm font-bold text-white transition-colors hover:bg-[#e04337] disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request Free Quote ›"
        )}
      </button>
    </form>
  );
}
