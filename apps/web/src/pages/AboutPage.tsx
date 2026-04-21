import { JSX } from 'react';
import { TruxOpsAboutPrinciple } from '@my-monorepo/types';
import { TruxOpsAboutPrincipleCard, TruxOpsQuoteBlock } from '@src/components/truxops/TruxOpsAboutSections';
import { TRUXOPS_ASSETS } from '@src/components/truxops/truxopsAssets';
import { TruxOpsSiteFooter } from '@src/components/truxops/TruxOpsSiteFooter';
import { TruxOpsButton, TruxOpsContainer } from '@src/components/truxops/TruxOpsPrimitives';
import { TRUXOPS_COLORS } from '@src/theme/colors';

const PRINCIPLES: TruxOpsAboutPrinciple[] = [
  {
    title: 'Focus',
    description:
      'One market. Independent trucking companies. Focus creates clarity, clarity creates execution, execution creates leadership.',
  },
  {
    title: 'Simplicity',
    description:
      'Truckers are on the road, not in an office. Every tool must work fast, feel simple, and deliver clear decisions, not complexity.',
  },
  {
    title: 'Trust',
    description:
      'Every feature must answer one question: does this help independent truckers run better businesses? If yes, we build it.',
  },
];

const AboutPage = (): JSX.Element => (
  <main className="bg-white" style={{ color: TRUXOPS_COLORS.primary }}>
    <section className="py-16 md:py-20" style={{ backgroundColor: '#f7f9fb' }}>
      <TruxOpsContainer>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.22em] text-[#102c44]">LEGACY OF PRECISION</p>
            <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
              Engineering the
              <br />
              Future
              <br />
              of <span className="italic text-[#1c65a5]">Fright.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#a8aab0]">
              TruxOps was built on one idea: independent truckers deserve the same operational
              intelligence as the largest fleets in America — without losing their independence.
            </p>
          </div>
          <div className="relative">
            <img
              src={TRUXOPS_ASSETS.aboutTruck}
              alt="TruxOps truck"
              className="h-full w-full rounded-lg object-cover"
            />
            <article className="absolute -bottom-10 left-6 rounded-[10px] bg-white p-6 shadow-[0_0_12px_rgba(0,0,0,0.1)]">
              <p className="text-xs font-bold tracking-[0.14em] text-[#a8aab0]">ESTIMATE ACCURACY</p>
              <p className="mt-2 text-6xl font-bold text-[#102c44]">98.9%</p>
              <p className="mt-2 max-w-[220px] text-sm font-bold text-[#a8aab0]">
                Accuracy across load profit estimation.
              </p>
            </article>
          </div>
        </div>
      </TruxOpsContainer>
    </section>

    <section style={{ backgroundColor: '#f2f4f6' }}>
      <TruxOpsContainer>
        <TruxOpsQuoteBlock
          quote="Independent truckers should have access to the same business intelligence as large fleets — without losing their independence."
          label="THE TRUXOPS MANIFESTO"
        />
      </TruxOpsContainer>
    </section>

    <section className="py-20 md:py-24">
      <TruxOpsContainer>
        <h2 className="text-5xl font-bold md:text-7xl">Foundation of Operations</h2>
        <p className="mt-3 text-lg text-[#a8aab0]">Data-driven load decisions before accepting freight</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <TruxOpsAboutPrincipleCard key={item.title} item={item} />
          ))}
        </div>
      </TruxOpsContainer>
    </section>

    <section className="pb-20">
      <TruxOpsContainer>
        <div className="rounded-[28px] bg-[#1c65a5] px-6 py-14 text-center md:px-12">
          <h2 className="text-4xl font-bold text-white md:text-6xl">Ready to join the movement?</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-[#d6def7] md:text-2xl">
            Experience the precision of TruxOps today. Optimize your fleet, empower your team and
            take control of your logistics.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <TruxOpsButton variant="secondary" className="min-w-[250px]">
              Start Your Free Trial
            </TruxOpsButton>
            <TruxOpsButton variant="outline-light" className="min-w-[250px]">
              Sign In
            </TruxOpsButton>
          </div>
        </div>
      </TruxOpsContainer>
    </section>

    <TruxOpsSiteFooter highlight="about" />
  </main>
);

export default AboutPage;
