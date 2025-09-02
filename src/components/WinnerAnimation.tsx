import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Guide, PrizeCategory } from '../types';

interface WinnerAnimationProps {
  isVisible: boolean;
  winners: Guide[];
  onComplete: () => void;
  prizeCategory?: PrizeCategory | null;
}

export const WinnerAnimation: React.FC<WinnerAnimationProps> = ({
  isVisible,
  winners,
  onComplete,
  prizeCategory
}) => {
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedWinners, setRevealedWinners] = useState<Guide[]>([]);

  useEffect(() => {
    if (!isVisible || winners.length === 0) return;

    setCurrentWinnerIndex(0);
    setRevealedWinners([]);
    setIsRevealing(true);

    const revealNextWinner = (index: number) => {
      if (index >= winners.length) {
        setTimeout(() => {
          setIsRevealing(false);
          onComplete();
        }, 2000);
        return;
      }

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      });

      setCurrentWinnerIndex(index);
      setRevealedWinners(prev => [...prev, winners[index]]);

      setTimeout(() => {
        revealNextWinner(index + 1);
      }, 3000);
    };

    const timer = setTimeout(() => {
      revealNextWinner(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVisible, winners, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {isRevealing && currentWinnerIndex < winners.length && (
            <motion.div
              key={currentWinnerIndex}
              initial={{ scale: 0, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0, opacity: 0, rotateY: -180 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="bg-white/20 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/30 shadow-2xl"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-8 shadow-lg"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-4"
              >
                {prizeCategory ? `${prizeCategory.icon} ${prizeCategory.name} WINNER #${currentWinnerIndex + 1} ${prizeCategory.icon}` : `🎉 WINNER #${currentWinnerIndex + 1} 🎉`}
              </motion.h2>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 mb-6"
              >
                <h3 className="text-3xl font-bold text-white mb-2">
                  {winners[currentWinnerIndex].name}
                </h3>
                <p className="text-xl text-blue-100 mb-4">
                  {winners[currentWinnerIndex].department}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-blue-200">Supervisor</p>
                    <p className="font-semibold text-white">{winners[currentWinnerIndex].supervisor}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-blue-200">Tickets</p>
                    <p className="font-semibold text-white">{winners[currentWinnerIndex].totalTickets}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity
                }}
                className="flex justify-center space-x-2"
              >
                <Star className="w-6 h-6 text-yellow-300" />
                <Sparkles className="w-6 h-6 text-pink-300" />
                <Star className="w-6 h-6 text-yellow-300" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Winners Summary */}
        {!isRevealing && revealedWinners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {prizeCategory ? `${prizeCategory.icon} Congratulations to All ${prizeCategory.name} Winners! ${prizeCategory.icon}` : `🏆 Congratulations to All Winners! 🏆`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {revealedWinners.map((winner, index) => (
                <motion.div
                  key={winner.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">#{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm">{winner.name}</h4>
                  <p className="text-blue-100 text-xs">{winner.department}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={onComplete}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
              >
                Continue to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};