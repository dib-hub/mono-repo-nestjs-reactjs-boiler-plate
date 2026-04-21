import { FC } from 'react';

const baseIconClass = 'size-10 text-[#1c65a5]';

export const ProfitChartIcon: FC = () => (
  <svg viewBox="0 0 24 24" className={baseIconClass} fill="none" aria-hidden="true">
    <path d="M4 19.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M7 15.5v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 15.5V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 15.5V6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RouteMapIcon: FC = () => (
  <svg viewBox="0 0 24 24" className="size-10 text-white" fill="none" aria-hidden="true">
    <rect x="4" y="5" width="4" height="14" rx="1" fill="currentColor" />
    <rect x="10" y="5" width="4" height="14" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="16" y="5" width="4" height="14" rx="1" fill="currentColor" opacity="0.45" />
  </svg>
);

export const DocumentIcon: FC = () => (
  <svg viewBox="0 0 24 24" className={baseIconClass} fill="none" aria-hidden="true">
    <path d="M7 3.5h7l4 4v13H7z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M14 3.8v4.1h4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
