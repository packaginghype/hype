import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendQuoteEmails } from "@/lib/send-quote-email";
import { logAdminActivity } from "@/lib/admin-activity";
import {
  validateContactName,
  validateDimension,
  validateEmail,
  validatePhone,
  validateQuantity,
} from "@/lib/quote-form-validation";

function optionalDimension(label: string) {
  return z.any().optional().superRefine((value, ctx) => {
    if (value === null || value === undefined || value === "") return;
    const message = validateDimension(label, String(value));
    if (message) ctx.addIssue({ code: "custom", message });
  }).transform((value) => {
    if (value === null || value === undefined || value === "") return undefined;
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  });
}

const quoteSubmitSchema = z.object({
  contactName: z.string().superRefine((value, ctx) => {
    const message = validateContactName(value);
    if (message) ctx.addIssue({ code: "custom", message });
  }),
  email: z.string().superRefine((value, ctx) => {
    const message = validateEmail(value);
    if (message) ctx.addIssue({ code: "custom", message });
  }),
  phone: z.string().superRefine((value, ctx) => {
    const message = validatePhone(value);
    if (message) ctx.addIssue({ code: "custom", message });
  }),
  productName: z.string().optional(),
  quantity: z.any().superRefine((value, ctx) => {
    const message = validateQuantity(value as string | number);
    if (message) ctx.addIssue({ code: "custom", message });
  }).transform((value) => Number(value)),
  length: optionalDimension("Length"),
  width: optionalDimension("Width"),
  depth: optionalDimension("Depth"),
  dimensionsUnit: z.enum(["inch", "cm", "mm"]).default("inch"),
  colors: z.string().optional(),
  materialStock: z.string().optional(),
  message: z.string().optional(),
  fileName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = quoteSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form fields and try again.", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const quoteNumber = `PH-${Date.now().toString().slice(-6)}`;

    const savedQuote = await prisma.quoteRequest.create({
      data: {
        quoteNumber,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        productName: data.productName || "Custom Packaging Inquiry",
        quantity: Math.round(data.quantity),
        length: data.length,
        width: data.width,
        depth: data.depth,
        dimensionsUnit: data.dimensionsUnit,
        colors: data.colors,
        materialStock: data.materialStock,
        message: data.message,
        attachmentUrls: data.fileName ? [data.fileName] : [],
      },
    });

    const emailResult = await sendQuoteEmails({
      quoteNumber: savedQuote.quoteNumber || quoteNumber,
      contactName: savedQuote.contactName,
      email: savedQuote.email,
      phone: savedQuote.phone,
      productName: savedQuote.productName,
      quantity: savedQuote.quantity,
      length: savedQuote.length,
      width: savedQuote.width,
      depth: savedQuote.depth,
      dimensionsUnit: savedQuote.dimensionsUnit,
      colors: savedQuote.colors,
      message: savedQuote.message,
    });

    await logAdminActivity(null, {
      action: "CREATE",
      entityType: "quote",
      entityId: savedQuote.id,
      entityLabel: savedQuote.quoteNumber,
      summary: `New quote request ${savedQuote.quoteNumber} from ${savedQuote.contactName}`,
    });

    return NextResponse.json(
      {
        success: true,
        quoteNumber: savedQuote.quoteNumber,
        emailSent: emailResult.adminSent,
        message: `Your quote request (${savedQuote.quoteNumber}) has been recorded. Our team will contact you shortly.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quote submission error:", error);
    return NextResponse.json(
      { error: "Could not submit your inquiry. Please try again." },
      { status: 500 }
    );
  }
}
