import { customerAccountFetch } from "./customerAccount";

export type Money = { amount: string; currencyCode: string };

export type OrderLineItem = {
  title: string;
  quantity: number;
  variantTitle: string | null;
  image: { url: string; altText: string | null } | null;
  totalPrice: Money | null;
};

export type TrackingInformation = {
  company: string | null;
  number: string | null;
  url: string | null;
};

export type Fulfillment = {
  status: string | null;
  trackingInformation: TrackingInformation[];
};

export type Order = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  statusPageUrl: string;
  subtotal: Money | null;
  totalShipping: Money;
  totalTax: Money | null;
  totalPrice: Money;
  shippingAddress: { formatted: string[] } | null;
  lineItems: { edges: { node: OrderLineItem }[] };
  fulfillments: { edges: { node: Fulfillment }[] };
};

export type Customer = {
  firstName: string | null;
  lastName: string | null;
  emailAddress: { emailAddress: string } | null;
  orders: { edges: { node: Order }[] };
};

const CUSTOMER_QUERY = /* GraphQL */ `
  query CustomerWithOrders {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            statusPageUrl
            subtotal {
              amount
              currencyCode
            }
            totalShipping {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
            shippingAddress {
              formatted
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variantTitle
                  image {
                    url
                    altText
                  }
                  totalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            fulfillments(first: 5) {
              edges {
                node {
                  status
                  trackingInformation {
                    company
                    number
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCustomerWithOrders(accessToken: string): Promise<Customer> {
  const data = await customerAccountFetch<{ customer: Customer }>(accessToken, CUSTOMER_QUERY);
  return data.customer;
}
