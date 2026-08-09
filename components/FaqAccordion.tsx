"use client";

import { useState } from "react";

export type Faq = { q: string; intro: string; items?: string[] };

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={faq.q} className="border-b border-black/[0.08]">
            <button
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="flex w-full items-center justify-between gap-3 px-1 py-4 text-left"
            >
              <div className="text-[15px] font-medium text-dark">{faq.q}</div>
              <div className="w-4 flex-shrink-0 text-center text-lg text-accent">{open ? "−" : "+"}</div>
            </button>
            {open && (
              <div className="flex flex-col gap-2.5 px-1 pb-[18px]">
                <div className="text-[13.5px] font-light leading-[1.7] text-body">{faq.intro}</div>
                {faq.items && faq.items.length > 0 && (
                  <ul className="m-0 flex flex-col gap-[7px]">
                    {faq.items.map((item, j) => (
                      <li
                        key={j}
                        className="relative pl-[16px] text-[13.5px] font-light leading-[1.6] text-body before:absolute before:left-0 before:top-[0.62em] before:h-[4px] before:w-[4px] before:rounded-full before:bg-accent before:content-['']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
