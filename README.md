# MONSERINE

A Next.js storefront for the MONSERINE clothing brand, live at **[monserine.com](https://monserine.com)**.

Shopify is the entire commerce backend — no database, no custom payment code. Checkout redirects to Shopify's own hosted checkout; login redirects to Shopify's hosted Customer Account login (OAuth 2.0 + PKCE). All product, cart, and account data is fetched live from Shopify's Storefront and Customer Account GraphQL APIs.

## Stack

Next.js 15 (App Router), TypeScript, React 19, Tailwind CSS, iron-session — deployed on Netlify, DNS on Namecheap.

## Features

- **Home** — hero video, a "Just Arrived" product rail sorted by newest, a community showcase, newsletter signup.
- **Shop** — full product grid with a category dropdown (Tops, Dresses, Skirts and Skorts, Sets, Outerwear), backed by Shopify Collections.
- **Search** — live product search against the Storefront API.
- **Product pages** — image gallery with drag/swipe navigation, a variant selector generalized to any option set (color, size, etc.), an optional per-product Size Guide and Fit Details section sourced from Shopify metafields, and Add to Bag.
- **Cart** — line-item management, quantity updates, checkout handoff to Shopify's hosted checkout.
- **Account** — Shopify-hosted login and order history via the Customer Account API.
- **Support** — FAQ accordion covering shipping, returns, and care; full legal Return & Refund and Shipping & Delivery policies live on the Terms page.

## Architecture

- **Storefront API** — products, cart, checkout URL. Public token, server-side only.
- **Customer Account API** — login and order history. OAuth 2.0 + PKCE public client, no client secret.
- Two cookies carry state: a plain cart id, and an encrypted session for the OAuth tokens. Tokens never reach the browser.
- Every page degrades gracefully (friendly message, not a crash) if a Shopify fetch fails.
