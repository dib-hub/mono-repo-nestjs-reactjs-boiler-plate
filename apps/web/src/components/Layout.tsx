import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">DibHub</h1>
            <ul className="flex gap-6">
              <li>
                <a href="/" className="text-gray-900 hover:text-blue-600">
                  Home
                </a>
              </li>
              <li>
                <a href="/sign-in" className="text-gray-900 hover:text-blue-600">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/sign-up" className="text-gray-900 hover:text-blue-600">
                  Sign up
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">{children}</main>
    </div>
  );
}
