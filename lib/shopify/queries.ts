import { storefrontFetch } from "./storefront";

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  images: { edges: { node: { url: string; altText: string | null } }[] };
  priceRange: { minVariantPrice: Money };
  variants: { edges: { node: { id: string; availableForSale: boolean } }[] };
};

export type ProductOption = { name: string; values: string[] };

export type ProductVariant = {
  id: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: { name: string; value: string }[];
};

export type ProductDetail = {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: { edges: { node: { url: string; altText: string | null } }[] };
  options: ProductOption[];
  variants: { edges: { node: ProductVariant }[] };
  fitDetails: string[];
  sizeGuide: string[][];
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { totalAmount: Money };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: { title: string; handle: string };
          image: { url: string; altText: string | null } | null;
          price: Money;
        };
      };
    }[];
  };
};

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    featuredImage {
      url
      altText
    }
    images(first: 2) {
      edges {
        node {
          url
          altText
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      edges {
        node {
          id
          availableForSale
        }
      }
    }
  }
`;

const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

export async function getProducts(
  options: {
    first?: number;
    sortKey?: "CREATED_AT" | "BEST_SELLING" | "TITLE";
    reverse?: boolean;
    query?: string;
  } = {}
): Promise<Product[]> {
  const { first = 24, sortKey, reverse, query } = options;
  const data = await storefrontFetch<{ products: { edges: { node: Product }[] } }>(
    PRODUCTS_QUERY,
    { first, sortKey, reverse, query },
    { revalidate: 60 }
  );
  return data.products.edges.map((e) => e.node);
}

const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query CollectionProducts($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
`;

export async function getProductsByCollection(
  handle: string,
  options: { first?: number } = {}
): Promise<Product[] | null> {
  const { first = 48 } = options;
  const data = await storefrontFetch<{
    collectionByHandle: { products: { edges: { node: Product }[] } } | null;
  }>(COLLECTION_PRODUCTS_QUERY, { handle, first }, { revalidate: 60 });
  if (!data.collectionByHandle) return null;
  return data.collectionByHandle.products.edges.map((e) => e.node);
}

const PRODUCT_DETAIL_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      options {
        name
        values
      }
      variants(first: 100) {
        edges {
          node {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      fitDetails: metafield(namespace: "custom", key: "fit_details") {
        value
      }
      sizeGuide: metafield(namespace: "custom", key: "size_guide") {
        value
      }
    }
  }
`;

function parseFitDetails(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === "string");
    return [];
  } catch {
    return [];
  }
}

function parseSizeGuide(raw: string | null | undefined): string[][] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((v): v is string => typeof v === "string")
      .map((line) => line.split("|").map((cell) => cell.trim()))
      .filter((row) => row.some((cell) => cell.length > 0));
  } catch {
    return [];
  }
}

export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  const data = await storefrontFetch<{
    product:
      | (Omit<ProductDetail, "fitDetails" | "sizeGuide"> & {
          fitDetails: { value: string } | null;
          sizeGuide: { value: string } | null;
        })
      | null;
  }>(PRODUCT_DETAIL_QUERY, { handle }, { revalidate: 60 });
  if (!data.product) return null;
  return {
    ...data.product,
    fitDetails: parseFitDetails(data.product.fitDetails?.value),
    sizeGuide: parseSizeGuide(data.product.sizeGuide?.value),
  };
}

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
                handle
              }
              image {
                url
                altText
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_QUERY = /* GraphQL */ `
  ${CART_FRAGMENT}
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

type CartMutationResult = {
  cart: Cart | null;
  userErrors: { message: string }[];
};

function assertNoUserErrors(result: CartMutationResult): Cart {
  if (result.userErrors.length) {
    throw new Error(`Shopify cart error: ${result.userErrors.map((e) => e.message).join(", ")}`);
  }
  if (!result.cart) {
    throw new Error("Shopify cart mutation returned no cart");
  }
  return result.cart;
}

export async function createCart(merchandiseId: string, quantity: number): Promise<Cart> {
  const data = await storefrontFetch<{ cartCreate: CartMutationResult }>(CART_CREATE_MUTATION, {
    lines: [{ merchandiseId, quantity }],
  });
  return assertNoUserErrors(data.cartCreate);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefrontFetch<{ cart: Cart | null }>(
    CART_QUERY,
    { cartId },
    { cache: "no-store" }
  );
  return data.cart;
}

export async function addCartLine(cartId: string, merchandiseId: string, quantity: number): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesAdd: CartMutationResult }>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ merchandiseId, quantity }],
  });
  return assertNoUserErrors(data.cartLinesAdd);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesUpdate: CartMutationResult }>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  return assertNoUserErrors(data.cartLinesUpdate);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesRemove: CartMutationResult }>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  return assertNoUserErrors(data.cartLinesRemove);
}
