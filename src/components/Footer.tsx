import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 py-6 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-blue-200 text-sm flex items-center justify-center font-medium">
            ✨ Imagined, Designed and Developed by 
            <span className="font-bold text-white ml-1 mr-1 bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">Abhishekh Dey</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};