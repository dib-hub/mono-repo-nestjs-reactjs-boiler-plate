import { JSX } from 'react';
import { TruxOpsComparisonRow, TruxOpsFaqItem, TruxOpsPricingPlan } from '@my-monorepo/types';
import { TruxOpsComparisonTable, TruxOpsFaqCard, TruxOpsPricingPlanCard } from '@src/components/truxops/TruxOpsPricingSections';
import { TruxOpsSiteFooter } from '@src/components/truxops/TruxOpsSiteFooter';
import { TruxOpsButton, TruxOpsContainer } from '@src/components/truxops/TruxOpsPrimitives';
import { TRUXOPS_ASSETS } from '@src/components/truxops/truxopsAssets';
import { TRUXOPS_COLORS } from '@src/theme/colors';

const PRICING_PLANS: TruxOpsPricingPlan[] = [
  {
    name: 'TruxOps Core',
    price: '$79',
    description: 'The foundational SaaS platform for independent trucking operations.',
    features: ['Load Profit Estimator (LPE)', 'Expense Tracking', 'Document Storage', 'Reporting & CSV Exports'],
  },
  {
    name: 'TruxOps Advantage',
    price: '$159',
    description: 'Core platform plus professional financial management support.',
    features: ['Everything in Core', 'Bookkeeping Verification', 'Monthly Statements', 'Carrier Manager Support'],
    highlighted: true,
  },
  {
    name: 'TruxOps Complete',
    price: '$249',
    description: 'Full-service business support including tax strategy and filing.',
    features: ['Everything in Advantage', 'Tax Strategy + Estimation', 'Professional Tax Filing', 'Strategic Tax Planning'],
  },
];

const COMPARISON_ROWS: TruxOpsComparisonRow[] = [
  { feature: 'Load Profit Estimator', core: true, advantage: true, complete: true },
  { feature: 'Load Tracking & Management', core: true, advantage: true, complete: true },
  { feature: 'Expense Tracking', core: true, advantage: true, complete: true },
  { feature: 'Business Analytics Dashboard', core: true, advantage: true, complete: true },
  { feature: 'Document Storage', core: true, advantage: true, complete: true },
  { feature: 'CSV Export / Reporting', core: true, advantage: true, complete: true },
  { feature: 'Monthly Bookkeeping', core: false, advantage: true, complete: true },
  { feature: 'Financial Statement Prep', core: false, advantage: true, complete: true },
  { feature: 'Carrier Manager Support', core: false, advantage: true, complete: true },
  { feature: 'Personal Tax Filing', core: false, advantage: false, complete: true },
  { feature: 'Annual Business Tax Return', core: false, advantage: false, complete: true },
  { feature: 'Strategic Tax Planning', core: false, advantage: false, complete: true },
];

const FAQ_ITEMS: TruxOpsFaqItem[] = [
  {
    question: 'Can I upgrade my plan mid-cycle?',
    answer:
      'Yes. TruxOps is designed for kinetic growth. You can upgrade from Solo to Pro at any time; your remaining balance is prorated automatically toward the new tier infrastructure.',
  },
  {
    question: 'Can I upgrade my plan mid-cycle?',
    answer:
      'Yes. TruxOps is designed for kinetic growth. You can upgrade from Solo to Pro at any time; your remaining balance is prorated automatically toward the new tier infrastructure.',
  },
  {
    question: 'Can I upgrade my plan mid-cycle?',
    answer:
      'Yes. TruxOps is designed for kinetic growth. You can upgrade from Solo to Pro at any time; your remaining balance is prorated automatically toward the new tier infrastructure.',
  },
];

const PricingPage = (): JSX.Element => (
  <main className="bg-white" style={{ color: TRUXOPS_COLORS.primary }}>
    <section className="relative overflow-hidden">
      <img src={TRUXOPS_ASSETS.heroBackground} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#f6fafe]/75" />
      <div className="relative z-10">
        <TruxOpsContainer>
          <div className="grid gap-10 py-16 md:grid-cols-2 md:items-end md:py-24">
            <div className="max-w-2xl space-y-8">
              <h1 className="text-5xl font-bold leading-[0.95] md:text-7xl">
                Maximize Your
                <br />
                Trucking Profit with
                <br />
                TRUXOPS.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-[#43474d]">
                The ultimate tool for owner-operators and fleets to calculate accurate margins, expenses,
                and net profit per load. Stop guessing, start earning.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <TruxOpsButton className="text-base">Try The Estimator</TruxOpsButton>
                <TruxOpsButton variant="secondary" className="text-base">
                  Login
                </TruxOpsButton>
              </div>
            </div>
            <div />
          </div>
        </TruxOpsContainer>
      </div>
    </section>

    <section className="py-16 md:py-20" style={{ backgroundColor: TRUXOPS_COLORS.surfaceAlt }}>
      <TruxOpsContainer>
        <div className="grid gap-8 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <TruxOpsPricingPlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </TruxOpsContainer>
    </section>

    <section className="py-20 md:py-24">
      <TruxOpsContainer>
        <h2 className="text-5xl font-semibold md:text-7xl">Structural Comparison</h2>
        <p className="mt-4 text-lg text-[#43474d] md:text-2xl">
          Detailed breakdown of the TruxOps technical infrastructure.
        </p>
        <div className="mt-10 md:mt-14">
          <TruxOpsComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </TruxOpsContainer>
    </section>

    <section className="relative overflow-hidden py-24 md:py-28">
      <img src={TRUXOPS_ASSETS.trailerBackground} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#102840]/80" />
      <TruxOpsContainer>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-6xl font-medium text-white md:text-8xl">Ready to test-out?</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <TruxOpsButton variant="outline-light" className="min-w-[250px]">
              Get Membership
            </TruxOpsButton>
            <TruxOpsButton className="min-w-[250px] bg-[#1d629f] hover:bg-[#195488]">
              Start a free trial
            </TruxOpsButton>
          </div>
        </div>
      </TruxOpsContainer>
    </section>

    <section className="py-20 md:py-24">
      <TruxOpsContainer>
        <h2 className="text-center text-5xl font-semibold md:text-6xl">Operational Intel (FAQ)</h2>
        <div className="mt-10 space-y-8 md:mt-14">
          {FAQ_ITEMS.map((item, index) => (
            <TruxOpsFaqCard key={`${item.question}-${index}`} item={item} />
          ))}
        </div>
      </TruxOpsContainer>
    </section>

    <TruxOpsSiteFooter highlight="pricing" />
  </main>
);

export default PricingPage;
