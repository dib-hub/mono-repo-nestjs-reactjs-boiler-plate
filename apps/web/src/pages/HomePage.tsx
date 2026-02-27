import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200">
      {/* Hero Section */}
      <section className="px-6 md:px-16 py-10 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Side */}
          <div>
            <p className="text-gray-700 mb-3">Welcome to DibHub</p>

            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Empowering <br /> Your Ideas
            </h2>

            <p className="text-gray-700 mt-6 max-w-lg">
              Join us and take your projects to the next level. Collaborate, share, and innovate
              with ease.
            </p>

            <button className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-black transition">
              Get Started
            </button>
          </div>

          {/* Right Side Illustration */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-3xl p-10 shadow-xl">
              <div className="grid grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="w-14 h-14 bg-white/40 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-16 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-lg">
            <div className="text-4xl mb-4">🚀</div>

            <h3 className="text-xl font-semibold mb-2">Creative Collaboration</h3>

            <p className="text-gray-700">
              Work together in real-time and bring your ideas to life.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-lg">
            <div className="text-4xl mb-4">📊</div>

            <h3 className="text-xl font-semibold mb-2">Powerful Tools</h3>

            <p className="text-gray-700">
              Access a suite of powerful tools to manage your projects.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-lg">
            <div className="text-4xl mb-4">🔒</div>

            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>

            <p className="text-gray-700">
              Your data is securely stored and protected at all times.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-16 pb-20">
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-10 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Building Today</h2>

          <p className="text-gray-700 mb-6">Join DibHub and turn your ideas into reality.</p>

          <button className="bg-black text-white px-8 py-3 rounded-xl">Create Account</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-gray-700">
        © 2026 DibHub. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
