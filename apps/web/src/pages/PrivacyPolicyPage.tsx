import { JSX } from 'react';
import { TruxOpsLegalPageContent } from '@my-monorepo/types';
import { TruxOpsLegalDocument } from '@src/components/truxops/TruxOpsLegalDocument';
import { TruxOpsSiteFooter } from '@src/components/truxops/TruxOpsSiteFooter';

const PRIVACY_CONTENT: TruxOpsLegalPageContent = {
  title: 'Privacy Policy',
  effectiveDateLabel: 'Effective date: April 20, 2026',
  tocLabel: 'TABLE OF CONTENTS',
  separatedUntil: 3,
  intro:
    'TruxOps Logistics ("TruxOps", "we", "us", or "our") respects your privacy. This Privacy Policy explains what data we collect, how we use it, and the choices you have when using our Services.',
  sections: [
    {
      id: 'data-we-collect',
      heading: '1. Data We Collect',
      paragraphs: [
        'We collect account and business information you provide directly, including name, email, company details, billing information, and uploaded operational files.',
        'We also collect technical usage data such as IP address, browser type, device details, and usage analytics to maintain service quality and security.',
      ],
    },
    {
      id: 'how-data-is-used',
      heading: '2. How Data Is Used',
      paragraphs: [
        'We use your data to operate TruxOps features, process billing, improve platform performance, communicate important service updates, and provide customer support.',
        'We may use aggregated and de-identified insights for product analytics and operational improvements.',
      ],
    },
    {
      id: 'sharing-and-disclosure',
      heading: '3. Sharing and Disclosure',
      paragraphs: [
        'We do not sell your personal data. We share data only with trusted service providers necessary for hosting, analytics, support, and payment processing.',
        'We may disclose data if legally required, to enforce our rights, or in connection with a lawful corporate transaction such as a merger or acquisition.',
      ],
    },
    {
      id: 'retention-and-security',
      heading: '4. Retention and Security',
      paragraphs: [
        'We retain data for as long as needed to provide services, meet legal requirements, and resolve disputes.',
        'TruxOps applies technical and organizational safeguards to protect data; however, no method of storage or transmission is completely risk-free.',
      ],
    },
    {
      id: 'your-rights-and-contact',
      heading: '5. Your Rights and Contact',
      paragraphs: [
        'Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict use of your data. You may also opt out of non-essential communications.',
        'For privacy requests or questions, contact TruxOps Logistics through the support details available in your account or official website.',
      ],
    },
  ],
};

const PrivacyPolicyPage = (): JSX.Element => (
  <>
    <TruxOpsLegalDocument content={PRIVACY_CONTENT} />
    <TruxOpsSiteFooter highlight="privacy" />
  </>
);

export default PrivacyPolicyPage;
