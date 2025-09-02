import React from 'react';
import { Trophy, LogOut } from 'lucide-react';
import { logout } from '../utils/auth';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <header className="bg-white/10 backdrop-blur-xl shadow-2xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                🎪 Big Dollar Contest 🎪
              </h1>
              <p className="text-sm text-blue-200 font-medium">✨ Magical Admin Dashboard ✨</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-6 py-2 border border-white/30 text-sm font-bold rounded-full text-white bg-white/20 backdrop-blur-sm hover:bg-red-500/80 focus:ring-2 focus:ring-red-400/50 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};