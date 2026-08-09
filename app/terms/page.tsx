type LegalBlock = { type: "p"; text: string } | { type: "ul"; items: string[] } | { type: "h4"; text: string };

type LegalSection = { title: string; blocks: LegalBlock[] };

const SECTIONS: LegalSection[] = [
  {
    title: "1. ACCEPTANCE OF TERMS",
    blocks: [
      {
        type: "p",
        text: "By accessing or using the Monserine website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our site or services.",
      },
    ],
  },
  {
    title: "2. ORDERS & PAYMENT",
    blocks: [
      {
        type: "p",
        text: "All orders are subject to availability and confirmation. Prices are listed in USD and may change without notice. Payment is due in full at the time of purchase.",
      },
    ],
  },
  {
    title: "3. SHIPPING & DELIVERY",
    blocks: [
      { type: "h4", text: "Processing Time" },
      {
        type: "p",
        text: "Orders are typically dispatched within 1–2 business days. During busy sale periods, processing times may be slightly extended. Shipping timeframes are in addition to processing and are estimates only, as the courier can experience delays from time to time.",
      },
      { type: "h4", text: "Overnight / Next Day Delivery" },
      {
        type: "p",
        text: "Overnight delivery applies to the shipping timeframe after your order has been dispatched. It does not guarantee same-day dispatch. Orders are still subject to our 1–2 business day processing time, which may be extended during sale periods. Once shipped, delivery is estimated for the next available business day, though courier delays can occur.",
      },
      { type: "h4", text: "Tracking" },
      {
        type: "p",
        text: "You'll receive a confirmation email after placing your order. Once dispatched, a shipping confirmation email with your tracking ID will follow. Didn't receive it? Check your spam folder or contact us.",
      },
      { type: "h4", text: "Cancellation Policy" },
      {
        type: "p",
        text: "We're unable to make changes to or cancel orders once they are placed, so please review your shipping address and order details carefully before confirming.",
      },
      { type: "h4", text: "Pre-Order" },
      {
        type: "p",
        text: "Pre-order items are reserved exclusively for you and charged at checkout. Estimated delivery dates are listed on product pages, but are subject to change. If your order contains both pre-order and in-stock items, it will ship once the pre-order item arrives.",
      },
      { type: "h4", text: "Split Deliveries" },
      {
        type: "p",
        text: "We don't offer split shipping by default, but in some cases may split orders due to stock limitations.",
      },
      { type: "h4", text: "Responsibility" },
      {
        type: "p",
        text: "Once your parcel is handed over to the courier, we are no longer responsible for delivery delays, address issues, or lost or stolen packages. Please ensure all shipping details are entered correctly. For delivery concerns, contact the courier directly.",
      },
      { type: "h4", text: "Rental Companies" },
      {
        type: "p",
        text: "Monserine is sold exclusively via this website. We are not affiliated with rental or third-party sites. Commercial resale or hire of our garments is a breach of our terms. Orders placed by rental businesses will be canceled.",
      },
    ],
  },
  {
    title: "4. RETURN & REFUND POLICY",
    blocks: [
      {
        type: "p",
        text: "At Monserine, we strive to ensure that every order meets our quality standards. If there is an issue with your order, we're here to help.",
      },
      { type: "h4", text: "Return Eligibility" },
      { type: "p", text: "Returns or exchanges are accepted within 7 days of receiving your order. To be eligible for a return or exchange, the item must:" },
      {
        type: "ul",
        items: [
          "Be unworn, unwashed, and unused.",
          "Have all original tags attached.",
          "Be returned in its original packaging.",
          "Show no signs of damage caused by the customer.",
        ],
      },
      { type: "h4", text: "Incorrect or Defective Items" },
      { type: "p", text: "If you receive:" },
      { type: "ul", items: ["The wrong item.", "A damaged item.", "An item with a manufacturing defect."] },
      { type: "p", text: "Please contact us within 48 hours of delivery and provide:" },
      { type: "ul", items: ["Your order number.", "Clear photos of the item and packaging."] },
      { type: "p", text: "We will review your request and offer one of the following solutions:" },
      {
        type: "ul",
        items: ["A replacement item.", "A full refund.", "A partial refund or store credit (for minor defects)."],
      },
      { type: "p", text: "All shipping costs related to our mistake will be covered by us." },
      { type: "h4", text: "Minor Defects" },
      { type: "p", text: "Minor cosmetic defects such as:" },
      {
        type: "ul",
        items: ["Small ink marks.", "Light sewing machine oil stains.", "A missing button.", "Loose threads."],
      },
      {
        type: "p",
        text: "may qualify for a partial refund or store credit instead of a return. The amount will depend on the severity of the defect.",
      },
      { type: "h4", text: "Wrong Size Ordered" },
      {
        type: "p",
        text: "If you ordered the wrong size, we are happy to offer an exchange, subject to stock availability. Please note:",
      },
      {
        type: "ul",
        items: [
          "The item must meet all return eligibility requirements.",
          "Customers are responsible for the return shipping cost and the shipping fee for the replacement item.",
          "Refunds are not available for incorrect size selections made by the customer.",
        ],
      },
      { type: "h4", text: "Non-Returnable Items" },
      { type: "p", text: "The following items cannot be returned or refunded:" },
      {
        type: "ul",
        items: [
          "Sale or clearance items.",
          "Customized or personalized products.",
          "Items that have been worn, washed, altered, or damaged after delivery.",
          "Items without original tags.",
        ],
      },
      { type: "h4", text: "Refund Processing" },
      {
        type: "p",
        text: "Approved refunds will be processed within 5–10 business days after the returned item has been inspected. Refunds will be issued using the original payment method unless otherwise agreed.",
      },
      { type: "h4", text: "How to Request a Return" },
      { type: "p", text: "Please contact our customer support with:" },
      {
        type: "ul",
        items: ["Your order number.", "A description of the issue.", "Photos or videos showing the problem."],
      },
      { type: "p", text: "Our team will guide you through the return or exchange process." },
    ],
  },
  {
    title: "5. INTELLECTUAL PROPERTY",
    blocks: [
      {
        type: "p",
        text: "All content on this site, including images, text, and logos, is the property of Monserine and may not be reproduced without written permission.",
      },
    ],
  },
  {
    title: "6. LIMITATION OF LIABILITY",
    blocks: [
      {
        type: "p",
        text: "Monserine is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website.",
      },
    ],
  },
  {
    title: "7. CONTACT",
    blocks: [{ type: "p", text: "Questions about these terms can be directed to hello@monserine.com." }],
  },
];

export default function TermsPage() {
  return (
    <main>
      <div className="flex flex-col items-center gap-3.5 px-[clamp(20px,5vw,56px)] pb-6 pt-[clamp(48px,8vw,72px)] text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Legal</div>
        <h1 className="m-0 font-condensed text-[clamp(30px,6vw,44px)] font-semibold text-dark">
          TERMS &amp; CONDITIONS
        </h1>
        <p className="m-0 text-[13px] font-light text-accent">Last updated August 2026</p>
      </div>

      <div className="mx-auto flex max-w-[720px] flex-col gap-9 px-[clamp(20px,5vw,56px)] pb-[88px] pt-8">
        {SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-2.5">
            <div className="font-condensed text-[19px] font-semibold text-dark">{section.title}</div>
            <div className="flex flex-col gap-3">
              {section.blocks.map((block, i) => {
                if (block.type === "h4") {
                  return (
                    <div key={i} className="mt-1 font-condensed text-[14px] font-semibold uppercase tracking-[0.03em] text-accent">
                      <span className="mr-1.5">-</span>
                      {block.text}
                    </div>
                  );
                }
                if (block.type === "p") {
                  return (
                    <div key={i} className="text-[13.5px] font-light leading-[1.85] text-body">
                      {block.text}
                    </div>
                  );
                }
                return (
                  <ul key={i} className="m-0 flex flex-col gap-[9px]">
                    {block.items.map((item, j) => (
                      <li
                        key={j}
                        className="relative pl-[18px] text-[13.5px] font-light leading-[1.7] text-body before:absolute before:left-0 before:top-[0.65em] before:h-[5px] before:w-[5px] before:rounded-full before:bg-accent before:content-['']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
