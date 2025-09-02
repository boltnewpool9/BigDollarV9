import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Trophy, Users, Ticket, Trash2, Sparkles, Gift } from 'lucide-react';
import { Guide, Winner, PrizeCategory } from '../types';
import { assignTicketsToGuides, GuideWithTickets } from '../utils/ticketSystem';
import { useWinners } from '../hooks/useWinners';
import { PrizeSelectionModal } from './PrizeSelectionModal';
import { PrizeDrawModal } from './PrizeDrawModal';
import { TicketDrawAnimation } from './TicketDrawAnimation';
import { WinnerAnimation } from './WinnerAnimation';
import { prizeCategories } from '../data/prizeCategories';
import confetti from 'canvas-confetti';
import guidesData from '../data/guides.json';

export const RaffleView: React.FC = () => {
  const [isPrizeSelectionOpen, setIsPrizeSelectionOpen] = useState(false);
  const [isPrizeDrawOpen, setIsPrizeDrawOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PrizeCategory | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isTicketDrawing, setIsTicketDrawing] = useState(false);
  const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);
  const [animationWinners, setAnimationWinners] = useState<GuideWithTickets[]>([]);
  const [drawnTickets, setDrawnTickets] = useState<number[]>([]);

  const { winners, addWinners, purgeWinners } = useWinners();
  const guides = guidesData as Guide[];
  const guidesWithTickets = useMemo(() => assignTicketsToGuides(guides), [guides]);

  const availableGuides = useMemo(() => {
    const winnerIds = new Set(winners.map(w => w.guide_id));
    return guidesWithTickets.filter(guide => !winnerIds.has(guide.id));
  }, [guidesWithTickets, winners]);

  const handleSelectPrize = (category: PrizeCategory) => {
    setSelectedCategory(category);
    setIsPrizeSelectionOpen(false);
    setIsPrizeDrawOpen(true);
  };

  const handleRunRaffle = async () => {
    if (!selectedCategory || availableGuides.length < selectedCategory.winnerCount) {
      return;
    }

    setIsDrawing(true);
    setIsPrizeDrawOpen(false);
    setIsTicketDrawing(true);
  };

  const handleTicketDrawComplete = async (selectedWinners: GuideWithTickets[], tickets: number[], isRestart?: boolean) => {
    setIsTicketDrawing(false);
    
    // Check if this is a restart
    if (isRestart || selectedWinners.length === 0) {
      // Reset the draw state
      setIsDrawing(false);
      setSelectedCategory(null);
      return;
    }
    
    setAnimationWinners(selectedWinners);
    setDrawnTickets(tickets);
    setShowWinnerAnimation(true);
  };

  const handleAnimationComplete = async () => {
    setShowWinnerAnimation(false);
    
    if (!selectedCategory) return;

    // Save to database with prize category
    const winnersData: any[] = animationWinners.map(guide => ({
      id: crypto.randomUUID(),
      guide_id: guide.id,
      name: guide.name,
      supervisor: guide.supervisor,
      department: guide.department,
      nps: guide.nps,
      nrpc: guide.nrpc,
      refund_percent: guide.refundPercent,
      total_tickets: guide.totalTickets,
      prize_category: selectedCategory.id,
      prize_name: selectedCategory.name,
      drawn_ticket: drawnTickets[index],
      won_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }));

    try {
      await addWinners(winnersData);
      
      // Final celebration confetti
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      });
    } catch (error) {
      console.error('Failed to save winners:', error);
      alert('Failed to save winners. Please try again.');
    }
    
    setIsDrawing(false);
    setSelectedCategory(null);
  };

  const handlePurgeWinners = async () => {
    if (winners.length === 0) {
      alert('No winners to purge!');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ALL ${winners.length} winners? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await purgeWinners();
        alert('All winners have been successfully purged!');
      } catch (error) {
        console.error('Failed to purge winners:', error);
        alert('Failed to purge winners. Please try again.');
      }
    }
  };

  const stats = useMemo(() => {
    const totalTickets = availableGuides.reduce((sum, guide) => sum + guide.totalTickets, 0);
    const avgNPS = availableGuides.length > 0 ? 
      availableGuides.reduce((sum, guide) => sum + guide.nps, 0) / availableGuides.length : 0;
    
    return { totalTickets, avgNPS };
  }, [availableGuides]);

  const prizeStats = useMemo(() => {
    return prizeCategories.map(category => {
      const categoryWinners = winners.filter(w => w.prize_category === category.id);
      return {
        ...category,
        currentWinners: categoryWinners.length,
        isCompleted: categoryWinners.length >= category.winnerCount
      };
    });
  }, [winners]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 space-y-6 p-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              🎪 Multi-Prize Contest System 🎪
            </h2>
            <p className="text-blue-100 text-lg">Conduct magical draws for different prize categories!</p>
          </div>
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
          >
            <Gift className="w-16 h-16 text-yellow-300" />
          </motion.div>
        </div>
      </div>

      {/* Current Pool Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Available Guides</p>
              <p className="text-3xl font-bold text-white">{availableGuides.length}</p>
              <p className="text-xs text-blue-300 mt-1">from {guides.length} total</p>
            </div>
            <Users className="w-10 h-10 text-blue-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 text-sm font-medium">Pool Tickets</p>
              <p className="text-3xl font-bold text-white">{stats.totalTickets.toLocaleString()}</p>
            </div>
            <Ticket className="w-10 h-10 text-yellow-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium">Pool Avg NPS</p>
              <p className="text-3xl font-bold text-white">{stats.avgNPS.toFixed(1)}</p>
            </div>
            <Trophy className="w-10 h-10 text-green-300" />
          </div>
        </div>
      </div>

      {/* Prize Categories Overview */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Gift className="w-6 h-6 mr-2 text-pink-300" />
          Prize Categories Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {prizeStats.map((prize) => (
            <motion.div
              key={prize.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 ${
                prize.isCompleted 
                  ? 'border-green-400/50 bg-green-500/20' 
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{prize.icon}</div>
                <h4 className="font-bold text-white text-sm mb-1">{prize.name}</h4>
                <div className="text-xs text-blue-200 mb-2">
                  {prize.currentWinners}/{prize.winnerCount} winners
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${prize.gradient} transition-all duration-500`}
                    style={{ width: `${(prize.currentWinners / prize.winnerCount) * 100}%` }}
                  />
                </div>
                {prize.isCompleted && (
                  <div className="text-green-300 text-xs font-semibold mt-2">✅ Complete</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Raffle Controls */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-300" />
              Contest Controls
            </h3>
            <div className="space-y-2 text-sm text-blue-100">
              <p>Total Guides in System: <span className="font-medium">{guidesWithTickets.length}</span></p>
              <p>Available for Draw: <span className="font-medium">{availableGuides.length}</span></p>
              <p>Total Winners Selected: <span className="font-medium">{winners.length}</span></p>
            </div>
          </div>
          
          <div className="flex gap-4">
            {winners.length > 0 && (
              <button
                onClick={handlePurgeWinners}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full font-semibold hover:from-red-600 hover:to-pink-700 focus:ring-4 focus:ring-red-500/50 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Purge All Winners
              </button>
            )}
            
            <button
              onClick={() => setIsPrizeSelectionOpen(true)}
              disabled={isDrawing || availableGuides.length === 0}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-bold text-lg hover:from-green-600 hover:to-blue-600 focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105 disabled:transform-none"
            >
              <Gift className="w-6 h-6 mr-2" />
              {isDrawing ? '🎰 Drawing Magic...' : '🎁 Select Prize & Draw!'}
            </button>
          </div>
        </div>
      </div>

      <PrizeSelectionModal
        isOpen={isPrizeSelectionOpen}
        onClose={() => setIsPrizeSelectionOpen(false)}
        availableGuides={availableGuides}
        onSelectPrize={handleSelectPrize}
        existingWinners={winners}
      />
      
      <PrizeDrawModal
        isOpen={isPrizeDrawOpen}
        onClose={() => {
          setIsPrizeDrawOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onConfirmDraw={handleRunRaffle}
        isDrawing={isDrawing}
        availableGuides={availableGuides.length}
      />
      
      <TicketDrawAnimation
        guides={availableGuides}
        isDrawing={isTicketDrawing}
        onComplete={handleTicketDrawComplete}
        winnerCount={selectedCategory?.winnerCount || 1}
        prizeCategory={selectedCategory}
      />
      
      <WinnerAnimation
        isVisible={showWinnerAnimation}
        winners={animationWinners}
        onComplete={handleAnimationComplete}
        prizeCategory={selectedCategory}
      />
    </div>
  );
};