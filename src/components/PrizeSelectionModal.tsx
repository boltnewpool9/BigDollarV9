import React from 'react';
import { X, Trophy, Users, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { PrizeCategory, Guide } from '../types';
import { prizeCategories } from '../data/prizeCategories';

interface PrizeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableGuides: Guide[];
  onSelectPrize: (category: PrizeCategory) => void;
  existingWinners: any[];
}

export const PrizeSelectionModal: React.FC<PrizeSelectionModalProps> = ({
  isOpen,
  onClose,
  availableGuides,
  onSelectPrize,
  existingWinners
}) => {
  if (!isOpen) return null;

  const getWinnersForCategory = (categoryId: string) => {
    return existingWinners.filter(winner => winner.prize_category === categoryId);
  };

  const totalTickets = availableGuides.reduce((sum, guide) => sum + guide.totalTickets, 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/20"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">🎪 Select Prize Category 🎪</h2>
              <p className="text-blue-200">Choose which prize draw to conduct</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Pool Stats */}
        <div className="p-6 border-b border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Available Guides</p>
                  <p className="text-2xl font-bold text-white">{availableGuides.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-300" />
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm font-medium">Total Tickets</p>
                  <p className="text-2xl font-bold text-white">{totalTickets.toLocaleString()}</p>
                </div>
                <Ticket className="w-8 h-8 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Prize Categories */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prizeCategories.map((category, index) => {
              const categoryWinners = getWinnersForCategory(category.id);
              const isCompleted = categoryWinners.length >= category.winnerCount;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'border-green-400/50 bg-green-500/20' 
                      : 'border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50 cursor-pointer transform hover:scale-105'
                  }`}
                  onClick={() => !isCompleted && onSelectPrize(category)}
                >
                  {/* Prize Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60`} />
                    <div className="absolute top-4 left-4">
                      <span className="text-4xl">{category.icon}</span>
                    </div>
                    {isCompleted && (
                      <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                          ✅ COMPLETED
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prize Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-blue-200 text-sm mb-4">{category.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-xs text-blue-200">Winners</p>
                          <p className="text-lg font-bold text-white">
                            {categoryWinners.length}/{category.winnerCount}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-blue-200">Status</p>
                          <p className={`text-sm font-semibold ${
                            isCompleted ? 'text-green-300' : 'text-yellow-300'
                          }`}>
                            {isCompleted ? 'Complete' : 'Pending'}
                          </p>
                        </div>
                      </div>
                      
                      {!isCompleted && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 bg-gradient-to-r ${category.gradient} text-white rounded-full font-semibold text-sm shadow-lg`}
                        >
                          Draw Now
                        </motion.button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${category.gradient} transition-all duration-500`}
                          style={{ width: `${(categoryWinners.length / category.winnerCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 bg-white/5">
          <div className="text-center">
            <p className="text-blue-200 text-sm">
              Select a prize category to conduct the draw. Each category has a fixed number of winners.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};