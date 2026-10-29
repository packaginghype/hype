type QuoteEmailInput = {
  quoteNumber: string;
  contactName: string;
  email: string;
  phone: string;
  productName?: string | null;
  quantity: number;
  length?: number | null;
  width?: number | null;
  depth?: number | null;
  dimensionsUnit?: string | null;
  colors?: string | null;
  message?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sizeLine(input: QuoteEmailInput) {
  if (input.length == null && input.width == null && input.depth == null) {
    return "Not specified";
  }
  return `${input.length ?? "—"} × ${input.width ?? "—"} × ${input.depth ?? "—"} ${input.dimensionsUnit || "inch"}`;
}

async function sendResendEmail(payload: {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; quote emails were not sent.");
    return { sent: false as const, reason: "missing_api_key" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("Resend email failed:", res.status, body);
    return { sent: false as const, reason: "provider_error" };
  }

  return { sent: true as const };
}

export async function sendQuoteEmails(input: QuoteEmailInput) {
  const notifyTo =
    process.env.QUOTE_NOTIFICATION_EMAIL?.trim() || "info@packaginghype.com";
  const from =
    process.env.QUOTE_FROM_EMAIL?.trim() ||
    "Packaging Hype <onboarding@resend.dev>";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://packaginghype.com";

  const details = [
    ["Reference", input.quoteNumber],
    ["Name", input.contactName],
    ["Email", input.email],
    ["Phone", input.phone],
    ["Product / box type", input.productName || "Custom packaging"],
    ["Quantity", String(input.quantity)],
    ["Size", sizeLine(input)],
    ["Colors", input.colors || "Not specified"],
    ["Notes", input.message || "—"],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#6B7280;width:160px">${escapeHtml(
          label
        )}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#172455">${escapeHtml(
          value
        ).replace(/\n/g, "<br/>")}</td></tr>`
    )
    .join("");

  const table = `<table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">${details}</table>`;

  const admin = await sendResendEmail({
    from,
    to: [notifyTo],
    reply_to: input.email,
    subject: `New quote request ${input.quoteNumber} — ${input.contactName}`,
    html: `<p>A new packaging inquiry was submitted on ${escapeHtml(site)}.</p>${table}`,
  });

  const customer = await sendResendEmail({
    from,
    to: [input.email],
    subject: `We received your quote request ${input.quoteNumber}`,
    html: `<p>Hi ${escapeHtml(input.contactName.split(" ")[0] || "there")},</p>
      <p>Thanks for requesting a custom packaging quote. Your reference number is <strong>${escapeHtml(
        input.quoteNumber
      )}</strong>.</p>
      <p>Our team will review your specs and get back to you shortly.</p>
      ${table}
      <p>— Packaging Hype</p>`,
  });

  return {
    adminSent: admin.sent,
    customerSent: customer.sent,
    reason: admin.sent ? undefined : admin.reason,
  };
}
