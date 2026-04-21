import { JSX, useMemo } from 'react';
import { LayoutProps, TruxOpsNavLink } from '@my-monorepo/types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux/store';
import { logout } from '@src/redux/slices/authSlice';
import { TruxOpsNavbar } from '@src/components/truxops/TruxOpsNavbar';

export default function Layout({ children }: LayoutProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.authSlice);

  const handleLogout = useMemo((): (() => void) => {
    return () => {
      dispatch(logout());
      navigate('/sign-in');
    };
  }, [dispatch, navigate]);

  const navLinks = useMemo<TruxOpsNavLink[]>(() => {
    if (user) {
      return [
        { label: 'Home', to: '/' },
        { label: 'Pricing', to: '/pricing' },
        { label: 'About', to: '/about' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Profile', to: '/profile' },
      ];
    }

    return [
      { label: 'Home', to: '/' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'About', to: '/about' },
    ];
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TruxOpsNavbar
        navLinks={navLinks}
        textAction={
          user ? { label: 'Logout', onClick: handleLogout } : { label: 'Login', to: '/sign-in' }
        }
        ctaAction={user ? undefined : { label: 'Get Started', to: '/sign-up' }}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
