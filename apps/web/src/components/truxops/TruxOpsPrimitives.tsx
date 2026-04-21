import { FC, PropsWithChildren } from 'react';
import { TruxOpsButtonStyleProps, TruxOpsFeatureCardProps, TruxOpsSectionHeadingProps, TruxOpsStepCardProps } from '@my-monorepo/types';
import { TRUXOPS_COLORS } from '@src/theme/colors';

type TruxOpsButtonProps = PropsWithChildren<TruxOpsButtonStyleProps>;

const BUTTON_BASE_CLASS =
  'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5';

const BUTTON_VARIANTS: Record<NonNullable<TruxOpsButtonProps['variant']>, string> = {
  primary: 'bg-[#102c44] text-white hover:bg-[#0d2438]',
  secondary: 'bg-white text-[#102c44] hover:bg-[#f2f4f8]',
  'outline-light': 'border-2 border-[#d6def7] text-[#d6def7] hover:bg-white/10',
};

export const TruxOpsButton: FC<TruxOpsButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => (
  <button className={`${BUTTON_BASE_CLASS} ${BUTTON_VARIANTS[variant]} ${className}`.trim()} type="button">
    {children}
  </button>
);

export const TruxOpsSectionHeading: FC<TruxOpsSectionHeadingProps> = ({ eyebrow, title }) => (
  <div className="space-y-2">
    <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#4b9def]">{eyebrow}</p>
    <h2 className="text-3xl font-bold leading-tight text-[#102c44] md:text-5xl">{title}</h2>
  </div>
);

type TruxOpsFeatureCardViewProps = TruxOpsFeatureCardProps & { icon: FC };

export const TruxOpsFeatureCard: FC<TruxOpsFeatureCardViewProps> = ({
  icon: Icon,
  title,
  description,
  tone = 'light',
  className = '',
  footerText,
  footerValue,
}) => {
  const isDark = tone === 'dark';
  return (
    <article
      className={`rounded-md p-6 md:p-8 ${isDark ? 'bg-[#102c44]' : 'bg-[#f2f4f6]'} ${className}`.trim()}
    >
      <Icon />
      <h3 className={`mt-6 text-3xl font-bold ${isDark ? 'text-white' : 'text-[#102c44]'}`}>{title}</h3>
      <p className={`mt-4 max-w-sm text-sm leading-relaxed ${isDark ? 'text-[#b0c5ec]' : 'text-[#43474d]'}`}>
        {description}
      </p>
      {(footerText || footerValue) && (
        <div className="mt-12 flex items-center justify-between text-xs font-semibold text-white">
          <span>{footerText}</span>
          <span>{footerValue}</span>
        </div>
      )}
    </article>
  );
};

export const TruxOpsStepCard: FC<TruxOpsStepCardProps> = ({ index, title, description }) => (
  <article className="space-y-4">
    <p className="text-4xl font-bold text-[#4b9def]">{index}</p>
    <h3 className="text-[28px] font-bold leading-tight text-[#102c44]">{title}</h3>
    <p className="max-w-sm text-base leading-relaxed text-[#43474d]">{description}</p>
  </article>
);

export const TruxOpsContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className="mx-auto w-full max-w-[1320px] px-5 md:px-8">{children}</div>
);

export const TruxOpsPlayButton: FC = () => (
  <button
    type="button"
    aria-label="Play video"
    className="grid size-16 place-items-center rounded-full border-2 border-white bg-white/10"
  >
    <span
      className="ml-1 inline-block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white"
      aria-hidden="true"
    />
  </button>
);

export const TruxOpsBrand: FC = () => (
  <p className="text-lg font-semibold tracking-tight" style={{ color: TRUXOPS_COLORS.primary }}>
    TruxOps
  </p>
);
