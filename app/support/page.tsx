import FaqAccordion, { type Faq } from "@/components/FaqAccordion";

const FAQS: Faq[] = [
  {
    q: "Shipping & Delivery",
    intro:
      "Orders are typically dispatched within 1–2 business days (may run slightly longer during sale periods), and you'll get a tracking link by email once your order ships. Please double-check your address before checking out. We're unable to make changes or cancel an order once it's placed, and once a parcel is with the courier we're no longer responsible for delivery delays or lost packages. See our Terms & Conditions page for our full Shipping & Delivery policy.",
  },
  {
    q: "International Orders",
    intro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    q: "Returns & Exchanges",
    intro:
      "Returns or exchanges are accepted within 7 days of delivery for items that are unworn, unwashed, and returned with original tags and packaging. Received the wrong or a defective item? Contact us within 48 hours with your order number and photos and we'll sort out a replacement, refund, or store credit, with return shipping on us. Ordered the wrong size? We're happy to exchange it, subject to stock, with shipping covered by you. Sale items, customized products, and worn or altered items are final sale. See our Terms & Conditions page for the full Return & Refund Policy.",
  },
  {
    q: "Product Care",
    intro:
      "We designed this piece to be loved and worn for years to come. Please treat it with care by following the instructions below to preserve its quality, shape, and color.",
    items: [
      "Hand wash cold or machine wash cold on a gentle cycle.",
      "Wash with similar colors.",
      "Use mild detergent.",
      "Do not bleach.",
      "Do not tumble dry.",
      "Hang or lay flat to dry in the shade.",
      "Cool iron if needed.",
      "Avoid excessive heat and rough surfaces to maintain the fabric's quality.",
    ],
  },
];

export default function SupportPage() {
  return (
    <main>
      <div className="flex flex-col items-center gap-[18px] px-[clamp(20px,5vw,56px)] pb-2 pt-[clamp(48px,8vw,88px)] text-center">
        <h1 className="m-0 font-condensed text-[clamp(32px,6vw,48px)] font-semibold text-dark">
          We&apos;re here to help.
        </h1>
        <p className="m-0 max-w-[480px] text-sm font-light leading-[1.8] text-body">
          If you have any questions about your order, sizing, shipping, returns, or our products, our team is
          happy to assist you.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3.5 px-[clamp(20px,5vw,56px)] pb-8 pt-14 text-center">
        <h2 className="m-0 font-condensed text-[26px] font-semibold text-dark">Customer Care</h2>
        <p className="m-0 text-sm font-light text-body">For all enquiries, please contact us via:</p>
      </div>
      <div className="mx-auto flex max-w-[600px] flex-wrap justify-center gap-5 px-[clamp(20px,5vw,56px)] pb-5">
        <a
          href="mailto:hello@monserine.com"
          className="flex flex-1 flex-col items-center gap-2 border border-black/10 px-5 py-6 text-center text-dark"
          style={{ flexBasis: 200 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="1.8">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 6l10 7 10-7" />
          </svg>
          <div className="font-condensed text-sm font-semibold uppercase tracking-[0.04em] text-accent">Email</div>
          <div className="text-sm font-medium text-dark">hello@monserine.com</div>
        </a>
        <a
          href="https://wa.me/6281323000625"
          target="_blank"
          rel="noopener"
          className="flex flex-1 flex-col items-center gap-2 border border-black/10 px-5 py-6 text-center text-dark"
          style={{ flexBasis: 200 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#2B2926">
            <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4C7.4 4 3.6 7.8 3.6 12.45c0 1.56.42 3.05 1.2 4.36L3 21l4.34-1.14a8.8 8.8 0 0 0 4.7 1.34h.01c4.65 0 8.45-3.8 8.45-8.45a8.4 8.4 0 0 0-2.9-6.43zm-5.55 13a7 7 0 0 1-3.58-.98l-.26-.15-2.57.68.69-2.5-.17-.26a6.98 6.98 0 0 1-1.07-3.7 7.01 7.01 0 0 1 7.03-7 6.98 6.98 0 0 1 4.96 2.05 6.94 6.94 0 0 1 2.06 4.95c0 3.88-3.16 7.03-7.03 7.03zm3.85-5.26c-.21-.1-1.24-.61-1.43-.68-.19-.07-.33-.1-.47.1-.14.21-.53.68-.65.82-.12.14-.24.16-.44.05-.2-.1-.87-.32-1.65-1.02-.61-.54-1.02-1.21-1.14-1.41-.12-.2-.01-.31.09-.42.1-.1.21-.26.32-.39.1-.13.14-.22.21-.37.07-.14.03-.26-.03-.37-.07-.1-.6-1.44-.82-1.97-.22-.53-.44-.46-.6-.47-.16-.01-.34-.01-.53-.01-.19 0-.48.07-.73.34-.25.27-.97.94-.97 2.28 0 1.34.99 2.65 1.13 2.83.14.19 1.9 2.9 4.6 3.95 2.7 1.05 2.7.7 3.19.66.49-.05 1.57-.64 1.79-1.26.22-.62.22-1.15.15-1.26-.06-.11-.24-.17-.44-.27z" />
          </svg>
          <div className="font-condensed text-sm font-semibold uppercase tracking-[0.04em] text-accent">
            WhatsApp
          </div>
          <div className="text-sm font-medium text-dark">+62 813 2300 0625</div>
        </a>
      </div>
      <p className="m-0 mb-14 px-[clamp(20px,5vw,56px)] text-center text-[13px] font-light text-copyright">
        We aim to respond within 1–2 business days.
      </p>

      <div className="mx-auto flex max-w-[600px] flex-col px-[clamp(20px,5vw,56px)] pb-14">
        <h2 className="m-0 mb-5 text-center font-condensed text-[26px] font-semibold text-dark">
          Frequently Asked Questions
        </h2>
        <FaqAccordion faqs={FAQS} />
      </div>

      <div className="px-[clamp(20px,5vw,56px)] pb-[72px] text-center">
        <p className="mx-auto m-0 max-w-[480px] text-sm font-light leading-[1.8] text-body">
          Thank you for choosing Monserine. We appreciate your support and look forward to helping you.
        </p>
      </div>
    </main>
  );
}
