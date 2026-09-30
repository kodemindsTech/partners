import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const searchParams = request.nextUrl.searchParams;
  const campaign = searchParams.get("c") || "direct";

  // Generate anonymous click ID
  const clickId = `rclid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Redirect target URL on Retner landing page
  const destinationUrl = new URL("https://retner.ai");
  destinationUrl.searchParams.set("ref", code);
  destinationUrl.searchParams.set("rclid", clickId);
  destinationUrl.searchParams.set("utm_campaign", campaign);

  const response = NextResponse.redirect(destinationUrl.toString(), {
    status: 307,
  });

  // Set first-party tracking cookie with 60-day expiry
  response.cookies.set("retner_ref", code, {
    maxAge: 60 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set("retner_rclid", clickId, {
    maxAge: 60 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
