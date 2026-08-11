import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/shopify/queries";
import { getClientIp } from "@/lib/request";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const result = await subscribeToNewsletter(email, getClientIp(req));
    if (result === "error") {
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ result });
  } catch (err) {
    console.error("Newsletter subscribe failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
