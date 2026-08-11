const API_VERSION = "2025-01";

function endpoint(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new Error("SHOPIFY_STORE_DOMAIN is not set");
  }
  return `https://${domain}/api/${API_VERSION}/graphql.json`;
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache; revalidate?: number; buyerIp?: string }
): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
  if (!token) {
    throw new Error("SHOPIFY_STOREFRONT_PUBLIC_TOKEN is not set");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token,
  };
  if (options?.buyerIp) {
    headers["Shopify-Storefront-Buyer-IP"] = options.buyerIp;
  }

  const res = await fetch(endpoint(), {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache: options?.cache,
    next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(`Shopify Storefront API error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  if (!json.data) {
    throw new Error("Shopify Storefront API returned no data");
  }

  return json.data;
}
