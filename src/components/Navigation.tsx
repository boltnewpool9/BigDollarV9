import React from 'react';
import { Users, Trophy, List, Shuffle } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'guides', label: 'All Shortlisted Guides', icon: Users },
    { id: 'raffle', label: 'Run Raffle', icon: Shuffle },
    { id: 'winners', label: 'Winners Dashboard', icon: Trophy },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-xl shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center px-4 py-4 border-b-2 text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-300 bg-white/10 rounded-t-lg'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 rounded-t-lg'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};