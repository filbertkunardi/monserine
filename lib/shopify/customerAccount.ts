import crypto from "crypto";

const API_VERSION = "2025-01";

function shopId(): string {
  const id = process.env.SHOPIFY_SHOP_ID;
  if (!id) throw new Error("SHOPIFY_SHOP_ID is not set");
  return id;
}

function clientId(): string {
  const id = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;
  if (!id) throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID is not set");
  return id;
}

function redirectUri(): string {
  const uri = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_REDIRECT_URI;
  if (!uri) throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_API_REDIRECT_URI is not set");
  return uri;
}

function authBaseUrl(): string {
  return `https://shopify.com/authentication/${shopId()}`;
}

function graphqlEndpoint(): string {
  return `https://shopify.com/${shopId()}/account/customer/api/${API_VERSION}/graphql`;
}

function base64url(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generatePkce(): { verifier: string; challenge: string } {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

export function generateState(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function decodeIdTokenEmail(idToken: string): string | null {
  try {
    const payload = idToken.split(".")[1];
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string };
    return claims.email ?? null;
  } catch {
    return null;
  }
}

export function buildAuthorizeUrl(params: { state: string; codeChallenge: string }): string {
  const url = new URL(`${authBaseUrl()}/oauth/authorize`);
  url.searchParams.set("client_id", clientId());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("scope", "openid email customer-account-api:full");
  url.searchParams.set("state", params.state);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export function buildLogoutUrl(idToken: string, postLogoutRedirectUri: string): string {
  const url = new URL(`${authBaseUrl()}/logout`);
  url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
  return url.toString();
}

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
};

export async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<TokenResponse> {
  const res = await fetch(`${authBaseUrl()}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId(),
      redirect_uri: redirectUri(),
      code,
      code_verifier: codeVerifier,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to exchange code for tokens: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch(`${authBaseUrl()}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId(),
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to refresh tokens: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function customerAccountFetch<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(graphqlEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Customer Account API request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(`Customer Account API error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  if (!json.data) {
    throw new Error("Customer Account API returned no data");
  }

  return json.data;
}
