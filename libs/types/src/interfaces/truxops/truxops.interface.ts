export type TruxOpsButtonVariant = 'primary' | 'secondary' | 'outline-light';
export type TruxOpsFeatureTone = 'light' | 'dark';

export interface TruxOpsButtonStyleProps {
  variant?: TruxOpsButtonVariant;
  className?: string;
}

export interface TruxOpsSectionHeadingProps {
  eyebrow: string;
  title: string;
}

export interface TruxOpsFeatureCardProps {
  title: string;
  description: string;
  tone?: TruxOpsFeatureTone;
  className?: string;
  footerText?: string;
  footerValue?: string;
}

export interface TruxOpsStepCardProps {
  index: string;
  title: string;
  description: string;
}

export interface TruxOpsNavLink {
  label: string;
  to: string;
}

export interface TruxOpsNavbarAction {
  label: string;
  to?: string;
  onClick?: () => void;
}

export interface TruxOpsNavbarProps {
  navLinks: TruxOpsNavLink[];
  textAction?: TruxOpsNavbarAction;
  ctaAction?: TruxOpsNavbarAction;
  className?: string;
}

export interface TruxOpsPricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface TruxOpsComparisonRow {
  feature: string;
  core: boolean;
  advantage: boolean;
  complete: boolean;
}

export interface TruxOpsFaqItem {
  question: string;
  answer: string;
}

export interface TruxOpsAboutPrinciple {
  title: string;
  description: string;
}

export interface TruxOpsLegalSection {
  /** Anchor id for TOC links (kebab-case, stable) */
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface TruxOpsLegalPageContent {
  /** Optional small label above title (e.g. LEGAL, POLICY) */
  eyebrow?: string;
  title: string;
  effectiveDateLabel: string;
  intro: string;
  /** TOC heading label; default applied in UI if omitted */
  tocLabel?: string;
  /** First N sections should render with separators */
  separatedUntil?: number;
  sections: TruxOpsLegalSection[];
}

export interface TruxOpsLegalDocumentProps {
  content: TruxOpsLegalPageContent;
}

export type TruxOpsSiteFooterHighlight = 'privacy' | 'terms' | 'pricing' | 'about' | null;

export interface TruxOpsSiteFooterProps {
  highlight?: TruxOpsSiteFooterHighlight;
}
