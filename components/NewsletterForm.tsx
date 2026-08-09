export default function NewsletterForm({ width = 280 }: { width?: number }) {
  return (
    <div className="flex gap-0 border-b border-black/20 pb-2" style={{ width }}>
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 border-none bg-transparent font-sans text-[13px] font-light text-dark outline-none placeholder:text-body"
      />
      <a href="#" className="flex-shrink-0 text-xs font-semibold uppercase tracking-[0.06em] text-dark">
        Subscribe
      </a>
    </div>
  );
}
