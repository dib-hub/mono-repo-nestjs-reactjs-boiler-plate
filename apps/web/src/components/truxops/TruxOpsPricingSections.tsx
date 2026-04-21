import { FC } from 'react';
import { TruxOpsComparisonRow, TruxOpsFaqItem, TruxOpsPricingPlan } from '@my-monorepo/types';
import { TruxOpsButton } from '@src/components/truxops/TruxOpsPrimitives';

const CheckMark: FC<{ highlighted?: boolean }> = ({ highlighted = false }) => (
  <span className={`text-xl font-bold ${highlighted ? 'text-white' : 'text-[#1c63a4]'}`}>✓</span>
);

export const TruxOpsPricingPlanCard: FC<{ plan: TruxOpsPricingPlan }> = ({ plan }) => (
  <article
    className={`rounded-md border p-7 ${plan.highlighted ? 'border-[#102c44] bg-[#102c44] text-white' : 'border-[#dbe3ef] bg-white text-[#102c44]'}`}
  >
    <div className="text-right">
      <p className="text-5xl font-bold">{plan.price}</p>
      <p className={`mt-2 text-xs font-bold tracking-[0.18em] ${plan.highlighted ? 'text-[#d6def7]' : 'text-[#a8aab0]'}`}>
        PER MONTH / BILLED YEARLY
      </p>
    </div>
    <h3 className="mt-5 text-4xl font-bold">{plan.name}</h3>
    <p className={`mt-3 text-sm leading-relaxed ${plan.highlighted ? 'text-[#f2f6fd]' : 'text-[#3e2a33]'}`}>
      {plan.description}
    </p>
    <ul className="mt-7 space-y-3">
      {plan.features.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed">
          <CheckMark highlighted={plan.highlighted} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <div className="mt-8">
      <TruxOpsButton
        variant={plan.highlighted ? 'primary' : 'secondary'}
        className={`w-full border-2 ${plan.highlighted ? 'border-[#1f65a2] bg-[#1c63a4] text-white hover:bg-[#195992]' : 'border-[#c8cbd9] text-[#102c44]'}`}
      >
        Buy Now
      </TruxOpsButton>
    </div>
  </article>
);

export const TruxOpsComparisonTable: FC<{ rows: TruxOpsComparisonRow[] }> = ({ rows }) => (
  <div className="overflow-x-auto rounded-md border border-[#e8eef7] bg-white">
    <table className="w-full min-w-[800px] text-left">
      <thead>
        <tr className="border-b border-[#e8eef7] bg-[#f8fbff] text-[22px] font-bold text-[#1c63a4]">
          <th className="px-6 py-4">Feature</th>
          <th className="px-6 py-4 text-center">Core</th>
          <th className="px-6 py-4 text-center">Advantage</th>
          <th className="px-6 py-4 text-center">Complete</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.feature} className="border-b border-[#e8eef7] text-xl font-medium text-[#102c44]">
            <td className="px-6 py-4">{row.feature}</td>
            <td className="px-6 py-4 text-center">{row.core ? <CheckMark /> : null}</td>
            <td className="px-6 py-4 text-center">{row.advantage ? <CheckMark /> : null}</td>
            <td className="px-6 py-4 text-center">{row.complete ? <CheckMark /> : null}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const TruxOpsFaqCard: FC<{ item: TruxOpsFaqItem }> = ({ item }) => (
  <article className="rounded-[9px] bg-[#f0f4f8] px-12 py-10">
    <h3 className="text-4xl font-semibold text-[#102c44]">{item.question}</h3>
    <p className="mt-5 text-2xl leading-relaxed text-[#102c44]">{item.answer}</p>
  </article>
);
