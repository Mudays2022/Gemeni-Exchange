import React from 'react';
import UserIcon from './icons/UserIcon';
import WalletIcon from './icons/WalletIcon';

// --- START: Inlined Icon Components ---
const ChainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);
// --- END: Inlined Icon Components ---


interface HeaderProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogout: () => void;
  activeView?: string;
  onNavigate?: (view: 'trade' | 'wallet' | 'profile' | 'web3') => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLoginClick, onSignupClick, onLogout, activeView, onNavigate }) => {
  const navLinkClasses = (view: string) => 
    `hover:text-white cursor-pointer ${activeView === view ? 'text-white' : 'text-gray-400'}`;

  return (
    <header className="bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 h-14 z-50 sticky top-0">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400">
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v1.25l.09.09c1.657-.03 3.328.234 4.883.898a.75.75 0 0 0 .82-.14l.493-.493a.75.75 0 0 0-.214-1.295Z" />
                <path fillRule="evenodd" d="M3 10.035v4.93A.75.75 0 0 0 3.5 15.5h.193c.484.06 1.251.13 2.13.21a.75.75 0 0 0 .727-.552l.21-1.047a.75.75 0 0 0-.298-.823 8.225 8.225 0 0 1-2.5-2.181.75.75 0 0 0-1.056.097Z" clipRule="evenodd" />
                <path d="M5.933 16.035a14.28 14.28 0 0 1 3.234 .466.75.75 0 0 0 .642-.23l.334-.445a.75.75 0 0 0-.33-.967 11.22 11.22 0 0 0-2.856-1.445.75.75 0 0 0-.919.341l-.224.536a.75.75 0 0 0 .144.885Z" />
                <path fillRule="evenodd" d="M12.97 4.533A9.707 9.707 0 0 1 18 3a9.735 9.735 0 0 1 3.25.555.75.75 0 0 1 .5.707v1.25l-.09.09c-1.657-.03-3.328.234-4.883.898a.75.75 0 0 1-.82-.14l-.493-.493a.75.75 0 0 1 .214-1.295Z" clipRule="evenodd" />
                <path d="M21 10.035v4.93a.75.75 0 0 1-.5 1.465h-.193c-.484.06-1.251.13-2.13.21a.75.75 0 0 1-.727-.552l-.21-1.047a.75.75 0 0 1 .298-.823 8.225 8.225 0 0 0 2.5-2.181.75.75 0 0 1 1.056.097Z" />
                <path d="M18.067 16.035a14.28 14.28 0 0 0-3.234 .466.75.75 0 0 1-.642-.23l-.334-.445a.75.75 0 0 1 .33-.967 11.22 11.22 0 0 1 2.856-1.445.75.75 0 0 1 .919.341l.224.536a.75.75 0 0 1-.144.885Z"
                <path fillRule="evenodd" d="M12 21a8.25 8.25 0 0 0 5.407-2.122.75.75 0 0 0-.53-1.285 6.75 6.75 0 0 1-9.755 0 .75.75 0 0 0-.53 1.285A8.25 8.25 0 0 0 12 21Z" clipRule="evenodd" />
            </svg>
            <span className="text-xl font-bold text-white">Gemini Exchange</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#" className="text-gray-400 hover:text-white">Markets</a>
          {isLoggedIn ? (
            <>
              <button onClick={() => onNavigate?.('trade')} className={navLinkClasses('trade')}>Trade</button>
              <button onClick={() => onNavigate?.('wallet')} className={navLinkClasses('wallet')}>Wallet</button>
              <button onClick={() => onNavigate?.('web3')} className={`${navLinkClasses('web3')} flex items-center space-x-1.5`}>
                <ChainIcon />
                <span>Web3</span>
              </button>
            </>
          ) : (
            <a href="#" className="text-white">Trade</a>
          )}
          <a href="#" className="text-gray-400 hover:text-white">Futures</a>
          <a href="#" className="text-gray-400 hover:text-white">Earn</a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <button className={navLinkClasses('wallet')} onClick={() => onNavigate?.('wallet')}>
                <WalletIcon />
            </button>
            <button className={navLinkClasses('profile')} onClick={() => onNavigate?.('profile')}>
                <UserIcon />
            </button>
            <button 
                onClick={onLogout}
                className="hidden md:block text-sm font-medium text-gray-400 hover:text-white"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <button onClick={onLoginClick} className="hidden md:block text-sm font-medium text-gray-400 hover:text-white">Log In</button>
            <button onClick={onSignupClick} className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-yellow-500">Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;