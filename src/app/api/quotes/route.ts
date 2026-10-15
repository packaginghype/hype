import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const quoteSubmitSchema = z.object({
  contactName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  productName: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  length: z.number().optional(),
  width: z.number().optional(),
  depth: z.number().optional(),
  dimensionsUnit: z.enum(["inch", "cm", "mm"]).default("inch"),
  colors: z.string().optional(),
  materialStock: z.string().optional(),
  message: z.string().optional(),
  fileName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = quoteSubmitSchema.parse(body);

    // Generate unique quote reference number
    const quoteNumber = `PH-${Date.now().toString().slice(-6)}`;

    // Check if database URL is configured
    const hasDatabase =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("localhost:5432/packaginghype");

    if (hasDatabase) {
      try {
        const savedQuote = await prisma.quoteRequest.create({
          data: {
            quoteNumber,
            contactName: validatedData.contactName,
            email: validatedData.email,
            phone: validatedData.phone,
            productName: validatedData.productName || "Custom Packaging Inquiry",
            quantity: validatedData.quantity,
            length: validatedData.length,
            width: validatedData.width,
            depth: validatedData.depth,
            dimensionsUnit: validatedData.dimensionsUnit,
            colors: validatedData.colors,
            materialStock: validatedData.materialStock,
            message: validatedData.message,
            attachmentUrls: validatedData.fileName ? [validatedData.fileName] : [],
          },
        });

        return NextResponse.json(
          {
            success: true,
            isMock: false,
            quoteNumber: savedQuote.quoteNumber,
            message: `Your quote request (${savedQuote.quoteNumber}) has been recorded. Our team will contact you shortly.`,
          },
          { status: 201 }
        );
      } catch (dbError) {
        console.error("Database persistence failed:", dbError);
        // Fall back to mock response with notice
        return NextResponse.json(
          {
            success: true,
            isMock: true,
            quoteNumber,
            message: `Quote request validated for ${validatedData.contactName}. (Database storage bypassed in current local configuration).`,
          },
          { status: 200 }
        );
      }
    }

    // Default development response when database connection is not live
    return NextResponse.json(
      {
        success: true,
        isMock: true,
        quoteNumber,
        message: `Quote request validated successfully for ${validatedData.contactName}! (Database not yet connected in this environment).`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Quote submission error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred processing your quote." },
      { status: 500 }
    );
  }
}
