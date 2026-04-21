import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TruxOpsNavbarAction, TruxOpsNavbarProps } from '@my-monorepo/types';
import { TruxOpsBrand, TruxOpsButton, TruxOpsContainer } from '@src/components/truxops/TruxOpsPrimitives';

const renderAction = (action?: TruxOpsNavbarAction, className = ''): JSX.Element | null => {
  if (!action) {
    return null;
  }

  if (action.to) {
    return (
      <Link to={action.to} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
};

export const TruxOpsNavbar: FC<TruxOpsNavbarProps> = ({
  navLinks,
  textAction,
  ctaAction,
  className = '',
}) => {
  const location = useLocation();
  return (
    <header className={`sticky top-0 z-50 border-b border-[#e8edf5] bg-[#f8f9ff]/95 backdrop-blur ${className}`.trim()}>
      <TruxOpsContainer>
        <div className="flex items-center justify-between py-4">
          <TruxOpsBrand />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#102c44] md:flex">
            {navLinks.map((link) => {
              const isActive = !link.to.startsWith('#') && location.pathname === link.to;
              const linkClassName = `transition-colors hover:text-[#1c65a5] ${isActive ? 'text-[#1c65a5]' : ''}`.trim();
              return link.to.startsWith('#') ? (
                <a key={link.label} href={link.to} className={linkClassName}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.to} className={linkClassName}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-4">
            {renderAction(textAction, 'hidden text-sm font-semibold text-[#102c44] md:inline-flex')}
            {ctaAction &&
              (ctaAction.to ? (
                <Link to={ctaAction.to}>
                  <TruxOpsButton className="px-5 py-2 text-xs md:text-sm">{ctaAction.label}</TruxOpsButton>
                </Link>
              ) : (
                <TruxOpsButton className="px-5 py-2 text-xs md:text-sm">{ctaAction.label}</TruxOpsButton>
              ))}
          </div>
        </div>
      </TruxOpsContainer>
    </header>
  );
};
