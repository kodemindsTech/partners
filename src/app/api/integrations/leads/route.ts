import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const leadIngestionSchema = z.object({
  ref: z.string(),
  clickId: z.string().optional(),
  brandName: z.string().min(2),
  website: z.string().min(3),
  contact: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
  }),
  monthlyRevenueRange: z.string().optional().default("₹10L – ₹25L"),
  sourceType: z.enum(["cal_com_demo", "shopify_install", "landing_signup"]).default("cal_com_demo"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = leadIngestionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;
    const now = new Date().toISOString();
    const expiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    // Simulated lead record output
    const leadRecord = {
      id: `lead-${Date.now()}`,
      partnerReferralCode: data.ref,
      brandName: data.brandName,
      website: data.website,
      contact: data.contact,
      status: "new",
      source: "link",
      clickId: data.clickId,
      attributedAt: now,
      protectionExpiresAt: expiry,
      conflictStatus: "none",
    };

    return NextResponse.json({
      success: true,
      message: "Lead successfully attributed and protected for 90 days",
      lead: leadRecord,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
