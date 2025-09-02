import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Login } from './components/Login';
import { GuidesView } from './components/GuidesView';
import { RaffleView } from './components/RaffleView';
import { WinnersView } from './components/WinnersView';
import { Footer } from './components/Footer';
import { isAuthenticated } from './utils/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('guides');

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('guides');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'guides':
        return <GuidesView />;
      case 'raffle':
        return <RaffleView />;
      case 'winners':
        return <WinnersView />;
      default:
        return <GuidesView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header onLogout={handleLogout} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderActiveView()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;