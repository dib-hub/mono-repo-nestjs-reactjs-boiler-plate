import { FC } from 'react';
import { TruxOpsLegalDocumentProps, TruxOpsLegalSection } from '@my-monorepo/types';
import { TRUXOPS_COLORS } from '@src/theme/colors';

const TOC_HEADING_CLASS = 'text-[11px] font-bold uppercase tracking-[0.22em] text-[#a8aab0]';

const TOC_LINK_CLASS =
  'group flex items-start gap-3 border-b border-[#e8edf5] py-4 text-[15px] font-medium leading-snug text-[#475569] transition-colors hover:text-[#1c65a5]';

const TocNav: FC<{ sections: TruxOpsLegalSection[]; className?: string }> = ({ sections, className = '' }) => (
  <nav className={className}>
    <ul className="divide-y divide-[#e8edf5] border-t border-[#e8edf5]">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className={TOC_LINK_CLASS}>
            <span className="min-w-[2ch] text-[#a8aab0] transition-colors group-hover:text-[#1c65a5]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{section.heading}</span>
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

export const TruxOpsLegalDocument: FC<TruxOpsLegalDocumentProps> = ({ content }) => {
  const tocLabel = content.tocLabel ?? 'TABLE OF CONTENTS';
  const separatedUntil = content.separatedUntil ?? 0;

  return (
    <main className="min-h-screen bg-white pb-16 pt-12 md:pb-24 md:pt-16" style={{ color: TRUXOPS_COLORS.primary }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-[70px]">
        <header className="flex flex-col justify-between gap-5 border-b border-[#e8edf5] pb-7 md:flex-row md:items-end md:pb-9">
          <div>
            {content.eyebrow && <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1c65a5]">{content.eyebrow}</p>}
            <h1 className="mt-2 text-[36px] font-bold leading-[1.15] tracking-tight text-[#102c44] md:text-[52px]">
              {content.title}
            </h1>
          </div>
          <p className="text-sm font-medium leading-normal text-[#828fa1]">{content.effectiveDateLabel}</p>
        </header>

        <div className="mt-8 lg:grid lg:grid-cols-[minmax(250px,300px)_minmax(0,1fr)] lg:items-start lg:gap-x-20 xl:gap-x-[100px]">
          <aside className="mb-10 hidden lg:sticky lg:top-28 lg:mb-0 lg:block lg:self-start lg:pt-1">
            <p className={TOC_HEADING_CLASS}>{tocLabel}</p>
            <TocNav sections={content.sections} className="mt-5" />
          </aside>

          <article className="min-w-0" style={{ color: TRUXOPS_COLORS.primary }}>
            <div className="rounded-lg border border-[#e8edf5] bg-[#fafcff] p-5 lg:hidden">
              <p className={TOC_HEADING_CLASS}>{tocLabel}</p>
              <TocNav sections={content.sections} className="mt-4" />
            </div>

            <p className="mt-8 text-[17px] leading-[1.75] text-[#43474d] md:mt-2">{content.intro}</p>

            <div className="mt-10 space-y-8 md:mt-12">
              {content.sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className={`scroll-mt-28 ${index < separatedUntil ? 'border-b border-[#e8edf5] pb-8 md:pb-10' : ''}`}
                >
                  <h2 className="text-[22px] font-bold leading-tight text-[#102c44] md:text-2xl lg:text-[26px]">
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-4 text-[15px] leading-[1.7] text-[#43474d] md:text-base md:leading-[1.75]">
                    {section.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
};
