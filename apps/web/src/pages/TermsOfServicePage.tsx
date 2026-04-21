import { JSX } from 'react';
import { TruxOpsLegalPageContent } from '@my-monorepo/types';
import { TruxOpsLegalDocument } from '@src/components/truxops/TruxOpsLegalDocument';
import { TruxOpsSiteFooter } from '@src/components/truxops/TruxOpsSiteFooter';

const TERMS_CONTENT: TruxOpsLegalPageContent = {
  title: 'Terms of Service',
  effectiveDateLabel: 'Effective date: April 20, 2026',
  tocLabel: 'TABLE OF CONTENTS',
  separatedUntil: 3,
  intro:
    'These Terms of Service ("Terms") govern your access to and use of TruxOps Logistics software and related services ("Services"). By using TruxOps, you confirm that you have read and agree to these Terms.',
  sections: [
    {
      id: 'acceptance-and-eligibility',
      heading: '1. Acceptance and Eligibility',
      paragraphs: [
        'You must be at least 18 years old and legally able to enter into contracts to use TruxOps. If you use TruxOps on behalf of a company, you represent that you are authorized to bind that company to these Terms.',
        'By creating an account, clicking to accept, or continuing to use the Services, you accept these Terms and our Privacy Policy.',
      ],
    },
    {
      id: 'services-and-permitted-use',
      heading: '2. Services and Permitted Use',
      paragraphs: [
        'TruxOps provides digital tools for load profit estimation, expense tracking, document organization, reporting, and related operational insights for independent trucking businesses.',
        'You may use the Services only for lawful business operations. You may not reverse engineer, scrape, interfere with platform security, or use the Services in a way that damages TruxOps or other users.',
      ],
    },
    {
      id: 'billing-and-subscriptions',
      heading: '3. Billing and Subscriptions',
      paragraphs: [
        'Paid plans are billed according to the pricing schedule shown at purchase. You are responsible for providing a valid payment method and keeping billing details current.',
        'Unless otherwise stated, subscriptions renew automatically. You may cancel renewal from your account settings, and cancellation applies to future billing cycles.',
      ],
    },
    {
      id: 'data-and-intellectual-property',
      heading: '4. Data and Intellectual Property',
      paragraphs: [
        'You retain ownership of your business data uploaded to TruxOps. You grant TruxOps a limited license to host, process, and display that data solely to provide and improve the Services.',
        'The TruxOps platform, code, branding, and documentation are owned by TruxOps and protected by applicable intellectual property laws. No ownership rights are transferred to you.',
      ],
    },
    {
      id: 'liability-termination-and-contact',
      heading: '5. Liability, Termination, and Contact',
      paragraphs: [
        'TruxOps is provided "as is" to the fullest extent permitted by law. We are not liable for indirect, incidental, or consequential damages, including lost profits resulting from use of the Services.',
        'We may suspend or terminate access for violations of these Terms, fraudulent activity, or non-payment. If you have questions, contact TruxOps Logistics using the support channel listed in your account.',
      ],
    },
  ],
};

const TermsOfServicePage = (): JSX.Element => (
  <>
    <TruxOpsLegalDocument content={TERMS_CONTENT} />
    <TruxOpsSiteFooter highlight="terms" />
  </>
);

export default TermsOfServicePage;
