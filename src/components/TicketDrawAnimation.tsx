import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Trophy, RotateCcw, ChevronRight } from 'lucide-react';
import { GuideWithTickets, drawRandomTickets, findGuideByTicket } from '../utils/ticketSystem';
import { PrizeCategory } from '../types';

interface TicketDrawAnimationProps {
  guides: GuideWithTickets[];
  isDrawing: boolean;
  onComplete: (winners: GuideWithTickets[], drawnTickets: number[], isRestart?: boolean) => void;
  winnerCount: number;
  prizeCategory?: PrizeCategory | null;
}

export const TicketDrawAnimation: React.FC<TicketDrawAnimationProps> = ({
  guides,
  isDrawing,
  onComplete,
  winnerCount,
  prizeCategory
}) => {
  const [phase, setPhase] = useState<'countdown' | 'drawing' | 'revealing' | 'waiting' | 'complete'>('countdown');
  const [countdown, setCountdown] = useState(15);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [drawnTicket, setDrawnTicket] = useState<number | null>(null);
  const [currentWinner, setCurrentWinner] = useState<GuideWithTickets | null>(null);
  const [allWinners, setAllWinners] = useState<GuideWithTickets[]>([]);
  const [allDrawnTickets, setAllDrawnTickets] = useState<number[]>([]);
  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  const [scrollingTickets, setScrollingTickets] = useState<number[]>([]);

  // Get countdown duration based on prize category
  const getCountdownDuration = (category: PrizeCategory | null): number => {
    if (!category) return 15;
    
    switch (category.id) {
      case 'iron-box': return 7;
      case 'soundbars': return 10;
      case 'washing-machine': return 15;
      case 'tablets': return 20;
      case 'refrigerator': return 60;
      default: return 15;
    }
  };

  // Generate random tickets for scrolling animation
  const generateScrollingTickets = () => {
    const totalTickets = guides.reduce((sum, guide) => sum + guide.totalTickets, 0);
    const tickets: number[] = [];
    for (let i = 0; i < 20; i++) {
      tickets.push(Math.floor(Math.random() * totalTickets) + 1);
    }
    return tickets;
  };

  useEffect(() => {
    if (!isDrawing || guides.length === 0) return;

    // Reset state
    setAllWinners([]);
    setAllDrawnTickets([]);
    setCurrentWinnerIndex(0);
    setIsWaitingForNext(false);
    
    const processWinner = (winnerIndex: number) => {
      if (winnerIndex >= winnerCount) {
        setPhase('complete');
        setTimeout(() => {
          onComplete(allWinners, allDrawnTickets);
        }, 2000);
        return;
      }

      setCurrentWinnerIndex(winnerIndex);
      setPhase('countdown');
      const duration = getCountdownDuration(prizeCategory);
      setCountdown(duration);
      setIsWaitingForNext(false);

      // Countdown timer
      let timeLeft = duration;
      const countdownInterval = setInterval(() => {
        timeLeft--;
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          setPhase('drawing');
          
          // Start ticket scrolling animation
          const scrollingTickets = generateScrollingTickets();
          setScrollingTickets(scrollingTickets);
          
          // After 3 seconds of scrolling, reveal the winner
          setTimeout(() => {
            // Get available guides (excluding already selected winners)
            const availableGuides = guides.filter(guide => 
              !allWinners.some(winner => winner.id === guide.id)
            );
            
            if (availableGuides.length === 0) {
              setPhase('complete');
              return;
            }

            // Draw random ticket from available guides
            const { winners: [winner], drawnTickets: [ticket] } = drawRandomTickets(availableGuides, 1);
            
            setDrawnTicket(ticket);
            setCurrentWinner(winner);
            setPhase('revealing');
            
            // Update winners list
            const newWinners = [...allWinners, winner];
            const newTickets = [...allDrawnTickets, ticket];
            setAllWinners(newWinners);
            setAllDrawnTickets(newTickets);
            
            // For multi-winner draws, wait for user input
            if (winnerCount > 1 && winnerIndex < winnerCount - 1) {
              setTimeout(() => {
                setPhase('waiting');
                setIsWaitingForNext(true);
              }, 3000);
            } else {
              // Single winner or last winner - auto proceed
              setTimeout(() => {
                processWinner(winnerIndex + 1);
              }, 4000);
            }
          }, 3000);
        }
      }, 1000);
    };

    processWinner(0);
  }, [isDrawing, guides, winnerCount, prizeCategory]);

  const handleNext = () => {
    setIsWaitingForNext(false);
    const processWinner = (winnerIndex: number) => {
      if (winnerIndex >= winnerCount) {
        setPhase('complete');
        setTimeout(() => {
          onComplete(allWinners, allDrawnTickets);
        }, 2000);
        return;
      }

      setCurrentWinnerIndex(winnerIndex);
      setPhase('countdown');
      const duration = getCountdownDuration(prizeCategory);
      setCountdown(duration);

      let timeLeft = duration;
      const countdownInterval = setInterval(() => {
        timeLeft--;
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          setPhase('drawing');
          
          const scrollingTickets = generateScrollingTickets();
          setScrollingTickets(scrollingTickets);
          
          setTimeout(() => {
            const availableGuides = guides.filter(guide => 
              !allWinners.some(winner => winner.id === guide.id)
            );
            
            if (availableGuides.length === 0) {
              setPhase('complete');
              return;
            }

            const { winners: [winner], drawnTickets: [ticket] } = drawRandomTickets(availableGuides, 1);
            
            setDrawnTicket(ticket);
            setCurrentWinner(winner);
            setPhase('revealing');
            
            const newWinners = [...allWinners, winner];
            const newTickets = [...allDrawnTickets, ticket];
            setAllWinners(newWinners);
            setAllDrawnTickets(newTickets);
            
            if (winnerIndex < winnerCount - 1) {
              setTimeout(() => {
                setPhase('waiting');
                setIsWaitingForNext(true);
              }, 3000);
            } else {
              setTimeout(() => {
                processWinner(winnerIndex + 1);
              }, 4000);
            }
          }, 3000);
        }
      }, 1000);
    };

    processWinner(currentWinnerIndex + 1);
  };

  const handleRestart = () => {
    onComplete([], [], true); // Pass empty arrays and restart flag
  };

  if (!isDrawing) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-blue-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="text-center w-full max-w-4xl">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center"
          >
            <Ticket className="w-8 h-8 text-purple-600" />
          </motion.div>
        </motion.div>

        {phase === 'countdown' && (
          <div>
            <motion.h2
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 40px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl md:text-5xl font-bold text-white mb-8"
            >
              {prizeCategory ? `${prizeCategory.icon} DRAWING TICKET FOR ${prizeCategory.name} WINNER #${currentWinnerIndex + 1} ${prizeCategory.icon}` : `🎫 DRAWING TICKET FOR WINNER #${currentWinnerIndex + 1} 🎫`}
            </motion.h2>

            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/30 shadow-2xl min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-6"
                >
                  {countdown}
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-yellow-300 text-xl font-semibold"
                >
                  🎫 Preparing to draw ticket... 🎫
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {phase === 'drawing' && (
          <div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-8"
            >
              🎰 DRAWING TICKET... 🎰
            </motion.h2>

            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/30 shadow-2xl min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl text-white mb-6">🎫 Ticket Numbers Flying By... 🎫</div>
                <div className="h-32 overflow-hidden relative">
                  <motion.div
                    animate={{ y: [-100, -3200] }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    {scrollingTickets.map((ticket, index) => (
                      <motion.div
                        key={index}
                        className="text-6xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
                      >
                        #{ticket.toString().padStart(4, '0')}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(phase === 'revealing' || phase === 'waiting') && currentWinner && drawnTicket && (
          <div>
            <motion.h2
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 40px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl md:text-5xl font-bold text-white mb-8"
            >
              {prizeCategory ? `${prizeCategory.icon} ${prizeCategory.name} WINNER #${currentWinnerIndex + 1} ${prizeCategory.icon}` : `🏆 WINNER #${currentWinnerIndex + 1} 🏆`}
            </motion.h2>

            <motion.div
              initial={{ 
                scale: 0,
                opacity: 0,
                rotateY: 180
              }}
              animate={{ 
                scale: 1,
                opacity: 1,
                rotateY: 0
              }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/30 shadow-2xl min-h-[400px] flex items-center justify-center"
            >
              <div className="text-center">
                <div className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-2xl mb-6 shadow-lg">
                  🎫 TICKET #{drawnTicket.toString().padStart(4, '0')} 🎫
                </div>
                
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {currentWinner.name}
                  </div>
                  <div className="text-2xl text-white font-semibold mb-3">
                    {currentWinner.department}
                  </div>
                  <div className="text-xl text-white font-medium mb-4">
                    Supervisor: {currentWinner.supervisor}
                  </div>
                  <div className="flex justify-center space-x-6 text-sm">
                    <div className="bg-yellow-500/80 rounded-lg px-4 py-3">
                      <span className="text-white font-bold">
                        {currentWinner.totalTickets} tickets
                      </span>
                    </div>
                    <div className="bg-green-500/80 rounded-lg px-4 py-3">
                      <span className="text-white font-bold">
                        NPS: {currentWinner.nps}
                      </span>
                    </div>
                    <div className="bg-blue-500/80 rounded-lg px-4 py-3">
                      <span className="text-white font-bold">
                        NRPC: {currentWinner.nrpc}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-blue-100">
                    Ticket Range: #{currentWinner.ticketRange.start}-#{currentWinner.ticketRange.end}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Control buttons for multi-winner draws */}
            {phase === 'waiting' && isWaitingForNext && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex justify-center gap-4"
              >
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full font-semibold hover:from-red-600 hover:to-pink-700 focus:ring-4 focus:ring-red-500/50 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Restart Draw
                </button>
                
                <button
                  onClick={handleNext}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-bold text-lg hover:from-green-600 hover:to-blue-600 focus:ring-4 focus:ring-green-500/50 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  Next Winner
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </motion.div>
            )}
          </div>
        )}

        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent mb-4">
              🎉 ALL TICKETS DRAWN! 🎉
            </div>
            <div className="text-lg text-white mb-4">
              Congratulations to all {winnerCount} winners!
            </div>
            <div className="text-sm text-blue-200">
              Tickets drawn: {allDrawnTickets.map(t => `#${t.toString().padStart(4, '0')}`).join(', ')}
            </div>
          </motion.div>
        )}

        {/* Progress indicator */}
        {winnerCount > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <div className="flex justify-center space-x-2">
              {Array.from({ length: winnerCount }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index < currentWinnerIndex 
                      ? 'bg-green-400 shadow-lg' 
                      : index === currentWinnerIndex 
                        ? 'bg-yellow-400 shadow-lg animate-pulse' 
                        : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/60 text-sm mt-2">
              Winner {currentWinnerIndex + 1} of {winnerCount}
            </p>
          </motion.div>
        )}

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/80 mt-6 text-lg"
        >
          {phase === 'countdown' && '🎫 Preparing the ticket draw... 🎫'}
          {phase === 'drawing' && '🎰 Drawing random ticket... 🎰'}
          {phase === 'revealing' && '🎉 Ticket drawn! Congratulations! 🎉'}
          {phase === 'waiting' && '⏳ Ready for the next ticket draw? ⏳'}
          {phase === 'complete' && '🎉 All tickets drawn successfully! 🎉'}
        </motion.div>
      </div>
    </div>
  );
};