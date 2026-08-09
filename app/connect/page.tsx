import NewsletterForm from "@/components/NewsletterForm";

export default function ConnectPage() {
  return (
    <main>
      <div className="flex flex-col items-center gap-[18px] px-[clamp(20px,5vw,56px)] pb-2 pt-[clamp(48px,8vw,88px)] text-center">
        <h1 className="m-0 font-condensed text-[clamp(32px,6vw,48px)] font-semibold text-dark">Connect</h1>
        <p className="m-0 max-w-[480px] font-condensed text-xl font-medium text-dark">
          Be part of the Monserine world.
        </p>
        <div className="flex max-w-[480px] flex-col gap-3.5">
          <p className="m-0 text-sm font-light leading-[1.8] text-body">
            Follow along for new collections, behind the scenes, styling inspiration, and exclusive updates.
          </p>
          <p className="m-0 text-sm font-light leading-[1.8] text-body">
            Join our community by following us on social, subscribing to our newsletter, or simply saying hello.
            We&apos;d love to connect with you.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[800px] flex-wrap justify-center gap-5 px-[clamp(20px,5vw,56px)] pb-[72px] pt-12">
        <a
          href="https://www.instagram.com/monserine/"
          target="_blank"
          rel="noopener"
          className="flex flex-1 flex-col items-center gap-2.5 border border-black/10 px-5 py-7 text-center text-dark"
          style={{ flexBasis: 200 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="#2B2926" stroke="none" />
          </svg>
          <div className="font-condensed text-base font-semibold uppercase tracking-[0.04em] text-accent">
            Instagram
          </div>
          <div className="text-[15px] font-medium text-dark">@monserine</div>
        </a>
        <a
          href="https://www.tiktok.com/@monserine"
          target="_blank"
          rel="noopener"
          className="flex flex-1 flex-col items-center gap-2.5 border border-black/10 px-5 py-7 text-center text-dark"
          style={{ flexBasis: 200 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#2B2926">
            <path d="M16.6 5.82c-.83-.73-1.36-1.75-1.46-2.82h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.43 0-2.6-1.16-2.6-2.6a2.6 2.6 0 0 1 2.6-2.6c.26 0 .5.03.74.1V9.63a5.9 5.9 0 0 0-.74-.04c-3.26 0-5.9 2.64-5.9 5.9s2.64 5.9 5.9 5.9 5.9-2.64 5.9-5.9V9.53a7.15 7.15 0 0 0 4.13 1.3V7.44a4.85 4.85 0 0 1-2.89-1.62z" />
          </svg>
          <div className="font-condensed text-base font-semibold uppercase tracking-[0.04em] text-accent">
            TikTok
          </div>
          <div className="text-[15px] font-medium text-dark">@monserine</div>
        </a>
        <a
          href="mailto:hello@monserine.com"
          className="flex flex-1 flex-col items-center gap-2.5 border border-black/10 px-5 py-7 text-center text-dark"
          style={{ flexBasis: 200 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="1.8">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 6l10 7 10-7" />
          </svg>
          <div className="font-condensed text-base font-semibold uppercase tracking-[0.04em] text-accent">
            Email
          </div>
          <div className="text-[15px] font-medium text-dark">hello@monserine.com</div>
        </a>
      </div>

      <div className="flex flex-col items-center gap-5 px-[clamp(20px,5vw,56px)] pb-[88px] text-center">
        <p className="m-0 max-w-[440px] text-sm font-light leading-[1.7] text-body">
          Subscribe to receive first access to new arrivals, exclusive launches, and special offers.
        </p>
        <NewsletterForm width={300} />
      </div>
    </main>
  );
}
