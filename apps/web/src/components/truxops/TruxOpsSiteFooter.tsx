import { FC } from 'react';
import { Link } from 'react-router-dom';
import { TruxOpsSiteFooterProps } from '@my-monorepo/types';
import { TruxOpsBrand, TruxOpsContainer } from '@src/components/truxops/TruxOpsPrimitives';
import { ROUTES } from '@src/utils/routes';
import { TRUXOPS_COLORS } from '@src/theme/colors';

const linkClass = (active: boolean) =>
  `text-sm transition-colors hover:text-[#1c65a5] ${active ? 'font-bold text-[#1e65a3]' : 'text-[#828fa1]'}`.trim();

export const TruxOpsSiteFooter: FC<TruxOpsSiteFooterProps> = ({ highlight = null }) => (
  <footer className="border-t border-[#e7edf5] py-10" style={{ backgroundColor: TRUXOPS_COLORS.surface }}>
    <TruxOpsContainer>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <TruxOpsBrand />
        <div className="flex flex-wrap items-center gap-6">
          <Link to={ROUTES.PUBLIC_ROUTES.termsOfService} className={linkClass(highlight === 'terms')}>
            Terms of Service
          </Link>
          <Link to={ROUTES.PUBLIC_ROUTES.privacyPolicy} className={linkClass(highlight === 'privacy')}>
            Privacy Policy
          </Link>
          <Link to={ROUTES.PUBLIC_ROUTES.pricing} className={linkClass(highlight === 'pricing')}>
            Pricing
          </Link>
          <Link to={ROUTES.PUBLIC_ROUTES.about} className={linkClass(highlight === 'about')}>
            About
          </Link>
        </div>
        <p className="text-sm text-[#828fa1]">© 2026 TruxOps Logistics. All rights reserved.</p>
      </div>
    </TruxOpsContainer>
  </footer>
);
