import type { NextRequest } from "next/server";

export function getClientIp(req: NextRequest): string | undefined {
  const netlifyIp = req.headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp;

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return undefined;
}
