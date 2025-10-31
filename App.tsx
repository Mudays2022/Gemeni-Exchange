import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ExchangeDashboard from './components/ExchangeDashboard';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for persisted login state
        try {
            const loggedInState = localStorage.getItem('isLoggedIn');
            if (loggedInState === 'true') {
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setShowSignupModal(false);
        try {
            localStorage.setItem('isLoggedIn', 'true');
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        try {
            localStorage.removeItem('isLoggedIn');
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
    };

    const openLoginModal = () => {
        setShowSignupModal(false);
        setShowLoginModal(true);
    };
    
    const openSignupModal = () => {
        setShowLoginModal(false);
        setShowSignupModal(true);
    };

    if (isLoading) {
        return (
            <div className="bg-gray-900 min-h-screen" />
        );
    }

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen antialiased">
            {isLoggedIn ? (
                <ExchangeDashboard onLogout={handleLogout} />
            ) : (
                <LandingPage onLoginClick={openLoginModal} onSignupClick={openSignupModal} />
            )}

            {showLoginModal && (
                <LoginModal 
                    onClose={() => setShowLoginModal(false)} 
                    onSuccess={handleLoginSuccess}
                    onSwitchToSignup={openSignupModal}
                />
            )}

            {showSignupModal && (
                <SignupModal 
                    onClose={() => setShowSignupModal(false)}
                    onSuccess={handleLoginSuccess}
                    onSwitchToLogin={openLoginModal}
                />
            )}
        </div>
    );
};

export default App;
