import { ReactNode, JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.authSlice);

  const handleLogout = (): void => {
    dispatch(logout());
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-900">
              DibHub
            </Link>
            <ul className="flex gap-6 items-center">
              <li>
                <Link to="/" className="text-gray-900 hover:text-blue-600">
                  Home
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard" className="text-gray-900 hover:text-blue-600">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="text-gray-900 hover:text-blue-600">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-gray-900 hover:text-blue-600">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/sign-in" className="text-gray-900 hover:text-blue-600">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/sign-up" className="text-gray-900 hover:text-blue-600">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
