import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("src") || "email";
    const emailId = searchParams.get("utm_content") || "unknown";
    const targetUrl = searchParams.get("redirect") || "/pourquoi-gainable";

    // Trace click event in server console / logs for tracking impact
    console.log(`[VIDEO CLICK TRACKING] Date: ${new Date().toISOString()} | Email: ${emailId} | Source: ${source} | Target: ${targetUrl}`);

    // Build destination URL with tracking & autoplay parameters
    const destination = new URL(targetUrl, request.url);
    destination.searchParams.set("autoplay", "1");
    destination.searchParams.set("utm_source", "email");
    destination.searchParams.set("utm_medium", "email_campaign");
    destination.searchParams.set("utm_campaign", "video_presentation");
    destination.searchParams.set("utm_content", emailId);

    return NextResponse.redirect(destination.toString(), 302);
}
