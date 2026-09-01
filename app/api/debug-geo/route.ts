import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const headers = Object.fromEntries(req.headers.entries());
  const geo = (req as NextRequest & { geo?: unknown }).geo ?? null;
  return NextResponse.json({ headers, geo });
}
