"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";
import type { HomePageData } from "@/lib/home-page-schema";

const fieldClass =
  "h-12 w-full rounded-[6px] border border-[#E2E4E8] bg-white px-3.5 text-sm font-medium text-[#172455] placeholder:text-[#8E95A5] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/15";

const QUANTITIES = ["100", "250", "500", "1000", "2500", "5000", "10000"];
const BOX_TYPES = [
  "Mailer Boxes",
  "Folding Cartons",
  "Rigid Boxes",
  "Display Boxes",
  "Corrugated Boxes",
  "Kraft Boxes",
  "Custom Boxes",
];
const COLORS = [
  "1-Color",
  "2-Color",
  "4/0 CMYK Outside",
  "4/4 Full Color",
];

const DEFAULT_CAPTCHA = { a: 4, b: 7, answer: 11 };

function newCaptcha() {
  const a = 2 + Math.floor(Math.random() * 7);
  const b = 2 + Math.floor(Math.random() * 7);
  return { a, b, answer: a + b };
}

export function HomeInquirySection({
  inquiryHeading = HOME_PAGE_DEFAULTS.inquiryHeading,
  inquirySubtext = HOME_PAGE_DEFAULTS.inquirySubtext,
}: Partial<Pick<HomePageData, "inquiryHeading" | "inquirySubtext">> = {}) {
  const [captcha, setCaptcha] = useState(DEFAULT_CAPTCHA);

  useEffect(() => {
    setCaptcha(newCaptcha());
  }, []);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    length: "",
    width: "",
    depth: "",
    dimensionsUnit: "inch",
    colors: "",
    expectedDate: "",
    quantity: "",
    boxType: "",
    contactName: "",
    phone: "",
    email: "",
    captcha: "",
    brief: "",
  });

  const year = useMemo(() => new Date().getFullYear(), []);

  function patch(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.contactName.trim()) next.contactName = "Required";
    if (!form.phone.trim()) next.phone = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Valid email required";
    }
    if (!form.quantity) next.quantity = "Required";
    if (Number(form.captcha) !== captcha.answer) next.captcha = "Incorrect";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus("idle");

    const details = [
      form.brief.trim(),
      form.boxType ? `Box type: ${form.boxType}` : "",
      form.expectedDate ? `Expected date: ${form.expectedDate}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: form.contactName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          productName: form.boxType || "Custom Packaging Inquiry",
          quantity: Number(form.quantity) || 100,
          length: form.length ? Number(form.length) : undefined,
          width: form.width ? Number(form.width) : undefined,
          depth: form.depth ? Number(form.depth) : undefined,
          dimensionsUnit: form.dimensionsUnit,
          colors: form.colors || undefined,
          message: details || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Could not send request. Try again.");
        return;
      }
      setStatus("success");
      setMessage(data.message || "Quote request received.");
      setForm({
        length: "",
        width: "",
        depth: "",
        dimensionsUnit: "inch",
        colors: "",
        expectedDate: "",
        quantity: "",
        boxType: "",
        contactName: "",
        phone: "",
        email: "",
        captcha: "",
        brief: "",
      });
      setCaptcha(newCaptcha());
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#F6F8FA] py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
          <form
            onSubmit={onSubmit}
            className="rounded-[16px] border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:p-7"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                name="length"
                value={form.length}
                onChange={(e) => patch("length", e.target.value)}
                placeholder="Length"
                inputMode="decimal"
                className={fieldClass}
              />
              <input
                name="width"
                value={form.width}
                onChange={(e) => patch("width", e.target.value)}
                placeholder="Width"
                inputMode="decimal"
                className={fieldClass}
              />
              <input
                name="depth"
                value={form.depth}
                onChange={(e) => patch("depth", e.target.value)}
                placeholder="Depth"
                inputMode="decimal"
                className={fieldClass}
              />

              <select
                name="dimensionsUnit"
                value={form.dimensionsUnit}
                onChange={(e) => patch("dimensionsUnit", e.target.value)}
                className={`${fieldClass} cursor-pointer`}
              >
                <option value="inch">Unit · Inch</option>
                <option value="cm">Unit · CM</option>
                <option value="mm">Unit · MM</option>
              </select>
              <select
                name="colors"
                value={form.colors}
                onChange={(e) => patch("colors", e.target.value)}
                className={`${fieldClass} cursor-pointer ${!form.colors ? "text-[#9CA3AF]" : ""}`}
              >
                <option value="">Color</option>
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="expectedDate"
                value={form.expectedDate}
                min={`${year}-01-01`}
                onChange={(e) => patch("expectedDate", e.target.value)}
                className={`${fieldClass} cursor-pointer ${!form.expectedDate ? "text-[#9CA3AF]" : ""}`}
                aria-label="Expected date"
              />

              <select
                name="quantity"
                value={form.quantity}
                onChange={(e) => patch("quantity", e.target.value)}
                className={`${fieldClass} cursor-pointer ${errors.quantity ? "border-[#FF5548]" : ""} ${!form.quantity ? "text-[#9CA3AF]" : ""}`}
              >
                <option value="">Quantity</option>
                {QUANTITIES.map((q) => (
                  <option key={q} value={q}>
                    {q}
                    {q === "10000" ? "+" : ""}
                  </option>
                ))}
              </select>
              <select
                name="boxType"
                value={form.boxType}
                onChange={(e) => patch("boxType", e.target.value)}
                className={`${fieldClass} cursor-pointer ${!form.boxType ? "text-[#9CA3AF]" : ""}`}
              >
                <option value="">Select Box Type</option>
                {BOX_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                name="contactName"
                value={form.contactName}
                onChange={(e) => patch("contactName", e.target.value)}
                placeholder="Enter Your Name"
                className={`${fieldClass} ${errors.contactName ? "border-[#FF5548]" : ""}`}
              />

              <input
                name="phone"
                value={form.phone}
                onChange={(e) => patch("phone", e.target.value)}
                placeholder="Phone *"
                className={`${fieldClass} ${errors.phone ? "border-[#FF5548]" : ""}`}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => patch("email", e.target.value)}
                placeholder="Your Email"
                className={`${fieldClass} ${errors.email ? "border-[#FF5548]" : ""}`}
              />
              <input
                name="captcha"
                value={form.captcha}
                onChange={(e) => patch("captcha", e.target.value)}
                placeholder={`Answer ${captcha.a}+${captcha.b}`}
                inputMode="numeric"
                className={`${fieldClass} ${errors.captcha ? "border-[#FF5548]" : ""}`}
              />
            </div>

            <textarea
              name="brief"
              rows={3}
              value={form.brief}
              onChange={(e) => patch("brief", e.target.value)}
              placeholder="Short Brief About your requirement..."
              className="mt-3 w-full resize-y rounded-[6px] border border-[#E2E4E8] bg-white px-3.5 py-3 text-sm font-medium text-[#172455] placeholder:text-[#8E95A5] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/15"
            />

            {status === "success" ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                {message}
              </p>
            ) : null}
            {status === "error" ? (
              <p className="mt-3 text-sm font-semibold text-[#FF5548]">{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-[#FF5548] text-[15px] font-extrabold uppercase tracking-wide text-white transition-all hover:bg-[#e04337] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-[#FF5548]/25"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Request Free Quote
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="max-w-md lg:pl-2">
            <h2 className="font-heading text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#172455] sm:text-[2rem] lg:text-[2.15rem]">
              {inquiryHeading}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#4B5563] sm:text-base">
              {inquirySubtext}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
