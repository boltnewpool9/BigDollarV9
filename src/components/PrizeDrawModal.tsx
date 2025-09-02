import React from 'react';
import { X, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { PrizeCategory } from '../types';

interface PrizeDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: PrizeCategory | null;
  onConfirmDraw: () => void;
  isDrawing: boolean;
  availableGuides: number;
}

export const PrizeDrawModal: React.FC<PrizeDrawModalProps> = ({
  isOpen,
  onClose,
  category,
  onConfirmDraw,
  isDrawing,
  availableGuides
}) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-xl shadow-lg`}>
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
              <p className="text-blue-200">{category.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Prize Image */}
        <div className="p-6">
          <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-40`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-6xl"
              >
                {category.icon}
              </motion.div>
            </div>
          </div>

          {/* Draw Details */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Draw Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-200">Prize Category:</p>
                <p className="font-semibold text-white">{category.name}</p>
              </div>
              <div>
                <p className="text-blue-200">Number of Winners:</p>
                <p className="font-semibold text-white">{category.winnerCount}</p>
              </div>
              <div>
                <p className="text-blue-200">Available Guides:</p>
                <p className="font-semibold text-white">{availableGuides}</p>
              </div>
              <div>
                <p className="text-blue-200">Draw Type:</p>
                <p className="font-semibold text-white">Weighted by Tickets</p>
              </div>
            </div>
          </div>

          {/* Warning if not enough guides */}
          {availableGuides < category.winnerCount && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 mb-6">
              <p className="text-red-200 text-sm font-medium">
                ⚠️ Warning: Only {availableGuides} guides available, but {category.winnerCount} winners needed for this category.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-white/30 rounded-full text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all duration-300"
            >
              Cancel
            </button>
            
            <button
              onClick={onConfirmDraw}
              disabled={isDrawing || availableGuides < category.winnerCount}
              className={`flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${category.gradient} text-white rounded-full font-bold hover:opacity-90 focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg`}
            >
              {isDrawing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 mr-2"
                  >
                    🎰
                  </motion.div>
                  Drawing...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  Start {category.name} Draw
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};