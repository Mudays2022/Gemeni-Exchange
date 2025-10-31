import React from 'react';
import Header from './Header';

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header isLoggedIn={false} onLoginClick={onLoginClick} onSignupClick={onSignupClick} onLogout={() => {}} />
      
      {/* Hero Section */}
      <main className="container mx-auto px-6 text-center py-24 md:py-32">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          The Future of Trading is Here.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          Experience a seamless, powerful, and AI-driven crypto exchange. Trade with confidence and get real-time insights to stay ahead of the market.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onSignupClick}
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-md text-lg font-bold hover:bg-yellow-500 transition-transform transform hover:scale-105"
          >
            Get Started
          </button>
          <button 
            onClick={onLoginClick}
            className="bg-gray-700 text-white px-8 py-3 rounded-md text-lg font-bold hover:bg-gray-600 transition-transform transform hover:scale-105"
          >
            Log In
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-800/50 py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="feature">
            <h3 className="text-2xl font-bold mb-3 text-yellow-400">Real-Time Data</h3>
            <p className="text-gray-400">Access lightning-fast market data, order books, and trade histories to make informed decisions instantly.</p>
          </div>
          <div className="feature">
            <h3 className="text-2xl font-bold mb-3 text-yellow-400">AI Market Insights</h3>
            <p className="text-gray-400">Leverage the power of Google's Gemini API for sophisticated market analysis and trading suggestions.</p>
          </div>
          <div className="feature">
            <h3 className="text-2xl font-bold mb-3 text-yellow-400">Secure & Reliable</h3>
            <p className="text-gray-400">Trade with peace of mind on a platform built with industry-leading security and robust infrastructure.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-gray-400 text-lg mb-8">Create an account in minutes and join the future of finance.</p>
            <button
                onClick={onSignupClick}
                className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-md text-xl font-bold hover:bg-yellow-500 transition-transform transform hover:scale-105"
            >
                Sign Up Now
            </button>
         </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Gemini Exchange. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
