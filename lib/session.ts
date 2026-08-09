import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
};

export const sessionOptions: SessionOptions = {
  cookieName: "monserine_session",
  password: process.env.SESSION_SECRET ?? "",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

export async function getSession() {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not set");
  }
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
