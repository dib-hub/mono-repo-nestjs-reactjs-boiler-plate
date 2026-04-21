import { JSX } from 'react';
import { TruxOpsSiteFooter } from '@src/components/truxops/TruxOpsSiteFooter';
import {
  TruxOpsButton,
  TruxOpsContainer,
  TruxOpsFeatureCard,
  TruxOpsPlayButton,
  TruxOpsSectionHeading,
  TruxOpsStepCard,
} from '@src/components/truxops/TruxOpsPrimitives';
import { DocumentIcon, ProfitChartIcon, RouteMapIcon } from '@src/components/truxops/TruxOpsIcons';
import { TRUXOPS_ASSETS } from '@src/components/truxops/truxopsAssets';
import { TRUXOPS_COLORS } from '@src/theme/colors';

const HOW_IT_WORKS_STEPS = [
  {
    index: '01',
    title: 'Enter Load Details',
    description:
      'Input origin, destination, and gross offer from the broker. Our system syncs with live market rates.',
  },
  {
    index: '02',
    title: 'Calculate Expense',
    description:
      'Factor in fuel prices, tolls, maintenance, and dispatcher fees automatically based on your truck profile.',
  },
  {
    index: '03',
    title: 'See Your Net Profit',
    description:
      'Get a clear bottom-line number before you ever book the load. Precision profit forecasting for every load.',
  },
] as const;

const HomePage = (): JSX.Element => {
  return (
    <main className="bg-white" style={{ color: TRUXOPS_COLORS.primary }}>
      <section className="relative overflow-hidden">
        <img
          src={TRUXOPS_ASSETS.heroBackground}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#f6fafe]/75" />
        <div className="relative z-10">
          <TruxOpsContainer>
            <div className="grid gap-12 py-16 md:grid-cols-2 md:items-end md:py-24">
              <div className="max-w-2xl space-y-8">
                <h1 className="text-5xl font-bold leading-[0.95] md:text-7xl">
                  Maximize Your
                  <br />
                  Trucking Profit
                  <br />
                  with TRUXOPS.
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-[#43474d]">
                  The ultimate tool for owner-operators and fleets to calculate accurate margins,
                  expenses, and net profit per load. Stop guessing, start earning.
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

      <section className="py-20" style={{ backgroundColor: TRUXOPS_COLORS.surfaceAlt }}>
        <TruxOpsContainer>
          <TruxOpsSectionHeading eyebrow="THE MANIFEST" title="How it Works" />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <TruxOpsStepCard
                key={step.index}
                index={step.index}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </TruxOpsContainer>
      </section>

      <section className="relative h-[600px] overflow-hidden md:h-[760px]">
        <img
          src={TRUXOPS_ASSETS.trailerBackground}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0f0f0f]/45" />
        <div className="absolute inset-0 grid place-items-center">
          <TruxOpsPlayButton />
        </div>
      </section>

      <section id="about" className="scroll-mt-24 py-24">
        <TruxOpsContainer>
          <TruxOpsSectionHeading
            eyebrow="CORE ECOSYSTEM"
            title="The Industrial Architect of Modern Freight."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-12">
            <TruxOpsFeatureCard
              icon={ProfitChartIcon}
              title="Load Profit Estimator"
              description="Visual representation of profit margins before the engine even starts. Predict the bottom line of every haul with 99% accuracy."
              className="md:col-span-8"
            />
            <TruxOpsFeatureCard
              icon={RouteMapIcon}
              title="Route Mapping"
              description="Data-rich map overlays calculating bridge clearances, fuel stops, and weather patterns in real-time."
              tone="dark"
              footerText="ACTIVE LOADS"
              footerValue="2,481"
              className="md:col-span-4"
            />
            <TruxOpsFeatureCard
              icon={DocumentIcon}
              title="Document Organization"
              description="A sleek UI preview of automated BOLs and PODs. Say goodbye to manual paperwork and hello to sub-second processing."
              className="md:col-span-7"
            />
            <article className="overflow-hidden rounded-md md:col-span-5">
              <img
                src={TRUXOPS_ASSETS.documentPreview}
                alt="Document workflow preview"
                className="h-full w-full object-cover"
              />
            </article>
          </div>
        </TruxOpsContainer>
      </section>

      <section className="pb-20">
        <TruxOpsContainer>
          <div className="rounded-[28px] bg-[#1c65a5] px-6 py-14 text-center md:px-12">
            <h2 className="text-4xl font-bold text-white md:text-6xl">
              Ready to join the movement?
            </h2>
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

      <TruxOpsSiteFooter />
    </main>
  );
};

export default HomePage;
