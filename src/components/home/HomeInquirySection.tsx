"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";
import { openDatePicker } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";
import type { HomePageData } from "@/lib/home-page-schema";
import {
  SSR_CAPTCHA,
  createMathCaptcha,
  createSessionCaptcha,
  type MathCaptcha,
} from "@/lib/captcha";
import {
  validateContactName,
  validateDimension,
  validateEmail,
  validatePhone,
  validateQuantity,
} from "@/lib/quote-form-validation";

const homeCaptchaSlot: { current: MathCaptcha | null } = { current: null };

const fieldClass =
  "h-12 w-full rounded-[6px] border border-[#E2E4E8] bg-white px-3.5 text-sm font-medium text-[#172455] placeholder:text-[#8E95A5] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/15";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] font-medium text-[#FF5548]">{message}</p>;
}

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

export function HomeInquirySection({
  inquiryHeading = HOME_PAGE_DEFAULTS.inquiryHeading,
  inquirySubtext = HOME_PAGE_DEFAULTS.inquirySubtext,
}: Partial<Pick<HomePageData, "inquiryHeading" | "inquirySubtext">> = {}) {
  const router = useRouter();
  const [captcha, setCaptcha] = useState(SSR_CAPTCHA);
  const [captchaReady, setCaptchaReady] = useState(false);

  useEffect(() => {
    setCaptcha(createSessionCaptcha(homeCaptchaSlot));
    setCaptchaReady(true);
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

  function fieldError(name: string, value: string) {
    if (name === "length") return validateDimension("Length", value);
    if (name === "width") return validateDimension("Width", value);
    if (name === "depth") return validateDimension("Depth", value);
    if (name === "quantity") return validateQuantity(value);
    if (name === "contactName") return validateContactName(value);
    if (name === "phone") return validatePhone(value);
    if (name === "email") return validateEmail(value);
    if (name === "captcha") {
      if (!captchaReady || Number(value) !== captcha.answer) {
        return `Enter ${captcha.a} + ${captcha.b}`;
      }
      return null;
    }
    return null;
  }

  function patch(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const message = fieldError(name, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (message) next[name] = message;
        else delete next[name];
        return next;
      });
    }
  }

  function validateField(name: string, value: string) {
    const message = fieldError(name, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  }

  function validate() {
    const next: Record<string, string> = {};
    const lengthError = validateDimension("Length", form.length);
    const widthError = validateDimension("Width", form.width);
    const depthError = validateDimension("Depth", form.depth);
    const quantityError = validateQuantity(form.quantity);
    const nameError = validateContactName(form.contactName);
    const phoneError = validatePhone(form.phone);
    const emailError = validateEmail(form.email);
    if (lengthError) next.length = lengthError;
    if (widthError) next.width = widthError;
    if (depthError) next.depth = depthError;
    if (quantityError) next.quantity = quantityError;
    if (nameError) next.contactName = nameError;
    if (phoneError) next.phone = phoneError;
    if (emailError) next.email = emailError;
    if (!captchaReady || Number(form.captcha) !== captcha.answer) {
      next.captcha = `Enter ${captcha.a} + ${captcha.b}`;
    }
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
      form.length || form.width || form.depth
        ? `Size: ${form.length || "—"} × ${form.width || "—"} × ${form.depth || "—"} ${form.dimensionsUnit}`
        : "",
      form.colors ? `Colors: ${form.colors}` : "",
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
      homeCaptchaSlot.current = createMathCaptcha();
      setCaptcha(homeCaptchaSlot.current);
      const refNum = data.quoteNumber || `PH-${Date.now().toString().slice(-6)}`;
      const params = new URLSearchParams({ ref: refNum });
      if (form.contactName.trim()) params.set("name", form.contactName.trim().split(" ")[0]);
      router.push(`/thank-you?${params.toString()}`);
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
            noValidate
            className="rounded-[16px] border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:p-7"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <input
                  name="length"
                  value={form.length}
                  onChange={(e) => patch("length", e.target.value)}
                  onBlur={(e) => validateField("length", e.target.value)}
                  placeholder="Length"
                  inputMode="decimal"
                  aria-invalid={Boolean(errors.length)}
                  className={`${fieldClass} ${errors.length ? "border-[#FF5548]" : ""}`}
                />
                <FieldError message={errors.length} />
              </div>
              <div>
                <input
                  name="width"
                  value={form.width}
                  onChange={(e) => patch("width", e.target.value)}
                  onBlur={(e) => validateField("width", e.target.value)}
                  placeholder="Width"
                  inputMode="decimal"
                  aria-invalid={Boolean(errors.width)}
                  className={`${fieldClass} ${errors.width ? "border-[#FF5548]" : ""}`}
                />
                <FieldError message={errors.width} />
              </div>
              <div>
                <input
                  name="depth"
                  value={form.depth}
                  onChange={(e) => patch("depth", e.target.value)}
                  onBlur={(e) => validateField("depth", e.target.value)}
                  placeholder="Depth"
                  inputMode="decimal"
                  aria-invalid={Boolean(errors.depth)}
                  className={`${fieldClass} ${errors.depth ? "border-[#FF5548]" : ""}`}
                />
                <FieldError message={errors.depth} />
              </div>

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
              <div className="relative">
                <input
                  type="date"
                  name="expectedDate"
                  value={form.expectedDate}
                  min={`${year}-01-01`}
                  onChange={(e) => patch("expectedDate", e.target.value)}
                  onClick={openDatePicker}
                  className={`${fieldClass} date-input-clickable pr-10 ${!form.expectedDate ? "text-[#9CA3AF]" : ""}`}
                  aria-label="Expected date"
                />
                <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E95A5]" />
              </div>

              <div>
                <select
                  name="quantity"
                  value={form.quantity}
                  onChange={(e) => patch("quantity", e.target.value)}
                  onBlur={(e) => validateField("quantity", e.target.value)}
                  aria-invalid={Boolean(errors.quantity)}
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
                <FieldError message={errors.quantity} />
              </div>
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
              <div>
                <input
                  name="contactName"
                  value={form.contactName}
                  onChange={(e) => patch("contactName", e.target.value)}
                  onBlur={(e) => validateField("contactName", e.target.value)}
                  placeholder="Enter Your Name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.contactName)}
                  className={`${fieldClass} ${errors.contactName ? "border-[#FF5548]" : ""}`}
                />
                <FieldError message={errors.contactName} />
              </div>

              <div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={(e) => patch("phone", e.target.value)}
                  onBlur={(e) => validateField("phone", e.target.value)}
                  placeholder="Phone *"
                  autoComplete="tel"
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.phone)}
                  className={`${fieldClass} ${errors.phone ? "border-[#FF5548]" : ""}`}
                />
                <FieldError message={errors.phone} />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => patch("email", e.target.value)}
                  onBlur={(e) => validateField("email", e.target.value)}
                  placeholder="Your Email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className={`${fieldClass} ${errors.email ? "border-[#FF5548]" : ""}`}
                />
                <FieldError message={errors.email} />
              </div>
              <div>
                <input
                  name="captcha"
                  value={form.captcha}
                  onChange={(e) => patch("captcha", e.target.value)}
                  onBlur={(e) => validateField("captcha", e.target.value)}
                  placeholder={
                    captchaReady
                      ? `Answer ${captcha.a}+${captcha.b}`
                      : "Answer the sum"
                  }
                  inputMode="numeric"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.captcha)}
                  className={`${fieldClass} ${errors.captcha ? "border-[#FF5548]" : ""}`}
                />
                <FieldError message={errors.captcha} />
              </div>
            </div>

            <textarea
              name="brief"
              rows={3}
              value={form.brief}
              onChange={(e) => patch("brief", e.target.value)}
              placeholder="Short Brief About your requirement..."
              className="mt-3 w-full resize-y rounded-[6px] border border-[#E2E4E8] bg-white px-3.5 py-3 text-sm font-medium text-[#172455] placeholder:text-[#8E95A5] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/15"
            />

            {Object.keys(errors).length > 0 ? (
              <p className="mt-3 text-sm font-semibold text-[#FF5548]">
                Please fix the highlighted fields.
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
