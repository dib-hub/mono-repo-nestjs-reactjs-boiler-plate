import { FC } from 'react';
import { TruxOpsAboutPrinciple } from '@my-monorepo/types';

const FocusIcon: FC = () => (
  <svg viewBox="0 0 24 24" className="size-8 text-[#1c65a5]" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const SimplicityIcon: FC = () => (
  <svg viewBox="0 0 24 24" className="size-8 text-[#1c65a5]" fill="none" aria-hidden="true">
    <path d="M7 13.5l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const TrustIcon: FC = () => (
  <svg viewBox="0 0 24 24" className="size-8 text-[#1c65a5]" fill="none" aria-hidden="true">
    <path d="M12 3.5l6 2.6v4.2c0 4.1-2.6 7.8-6 9.7-3.4-1.9-6-5.6-6-9.7V6.1z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9.2 12.1l1.9 1.9 3.7-3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ICON_BY_TITLE: Record<string, FC> = {
  Focus: FocusIcon,
  Simplicity: SimplicityIcon,
  Trust: TrustIcon,
};

export const TruxOpsAboutPrincipleCard: FC<{ item: TruxOpsAboutPrinciple }> = ({ item }) => {
  const Icon = ICON_BY_TITLE[item.title] ?? FocusIcon;
  return (
    <article className="rounded-md bg-white p-7">
      <Icon />
      <h3 className="mt-6 text-4xl font-bold text-[#102c44]">{item.title}</h3>
      <p className="mt-4 text-lg leading-relaxed text-[#a8aab0]">{item.description}</p>
    </article>
  );
};

export const TruxOpsQuoteBlock: FC<{ quote: string; label: string }> = ({ quote, label }) => (
  <section className="py-24 md:py-28">
    <div className="mx-auto max-w-5xl text-center">
      <p className="text-8xl font-semibold italic leading-none text-[#a9bddd]">"</p>
      <blockquote className="mx-auto mt-2 max-w-4xl text-left text-5xl font-semibold italic leading-tight text-[#102c44] md:text-6xl">
        {quote}
      </blockquote>
      <div className="mx-auto mt-14 h-[2px] w-24 bg-[#75b4f5]" />
      <p className="mt-5 text-lg font-medium tracking-[0.08em] text-[#9b9fa9]">{label}</p>
    </div>
  </section>
);
