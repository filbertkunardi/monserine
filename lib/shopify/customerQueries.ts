import { customerAccountFetch } from "./customerAccount";

export type Order = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: { edges: { node: { title: string; quantity: number } }[] };
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
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
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
