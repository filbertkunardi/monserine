import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center px-[clamp(20px,5vw,56px)] pb-[clamp(72px,10vw,120px)] pt-[clamp(56px,10vw,100px)]">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Our Story</div>
      <h1 className="m-0 mb-12 text-center font-condensed text-[clamp(34px,6vw,52px)] font-semibold leading-[1.05] text-dark">
        About Monserine
      </h1>

      <div className="flex w-full max-w-[600px] flex-col gap-[26px]">
        <p className="m-0 font-condensed text-[clamp(20px,3vw,26px)] font-medium leading-[1.5] text-dark">
          Monserine is an independent womenswear label creating timeless pieces designed to be worn, loved, and
          lived in.
        </p>

        <div className="my-2 h-px w-14 bg-rule" />

        <p className="m-0 text-[15.5px] font-light leading-[1.9] text-body2">
          Designed in-house and proudly made in Indonesia, each collection is thoughtfully crafted with an emphasis
          on quality fabrics, flattering fits, and the little details that make every piece feel special. We
          believe in creating wardrobe staples that transcend seasons: pieces you&apos;ll continue reaching for
          long after the trends have passed.
        </p>

        <p className="m-0 text-[15.5px] font-light leading-[1.9] text-body2">
          Inspired by femininity, romance, and effortless dressing, Monserine is made for slow mornings, golden
          afternoons, spontaneous dinners, and everything in between.
        </p>

        <p className="m-0 text-[15.5px] font-light leading-[1.9] text-body2">
          Our philosophy is simple: beautiful clothing should feel as good as it looks. Every silhouette is
          designed to be comfortable, versatile, and made to last, so you can build a wardrobe you&apos;ll cherish
          for years to come.
        </p>

        <p className="m-0 mt-6 text-[15.5px] font-light leading-[1.9] text-body2">
          Thank you for being part of our story.
        </p>

        <div className="mt-2">
          <div className="font-condensed text-base italic text-body">With love,</div>
          <Image
            src="/images/logo.png"
            alt="Monserine"
            width={102}
            height={34}
            className="mt-1.5 h-[34px] w-auto object-contain object-left"
          />
        </div>
      </div>
    </main>
  );
}
