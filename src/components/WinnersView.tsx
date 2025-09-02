import React, { useMemo } from 'react';
import { Trophy, Calendar, User, Award, Percent, Ticket, TrendingUp, Sparkles, Trash2, Gift, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWinners } from '../hooks/useWinners';
import { prizeCategories } from '../data/prizeCategories';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

export const WinnersView: React.FC = () => {
  const { winners, loading, purgeWinners } = useWinners();

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

  const handleExportExcel = () => {
    if (winners.length === 0) {
      alert('No winners to export!');
      return;
    }
    exportToExcel(winners);
  };

  const handleExportPDF = () => {
    if (winners.length === 0) {
      alert('No winners to export!');
      return;
    }
    exportToPDF(winners);
  };

  const stats = useMemo(() => {
    if (winners.length === 0) return { totalWinners: 0, totalTickets: 0, avgNPS: 0, avgNRPC: 0 };
    
    const totalTickets = winners.reduce((sum, winner) => sum + winner.total_tickets, 0);
    const avgNPS = winners.reduce((sum, winner) => sum + winner.nps, 0) / winners.length;
    const avgNRPC = winners.reduce((sum, winner) => sum + winner.nrpc, 0) / winners.length;
    
    return { totalWinners: winners.length, totalTickets, avgNPS, avgNRPC };
  }, [winners]);

  const departmentStats = useMemo(() => {
    const deptMap = new Map<string, number>();
    winners.forEach(winner => {
      deptMap.set(winner.department, (deptMap.get(winner.department) || 0) + 1);
    });
    return Array.from(deptMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [winners]);

  const prizeStats = useMemo(() => {
    return prizeCategories.map(category => {
      const categoryWinners = winners.filter(w => w.prize_category === category.id);
      return {
        ...category,
        winnersCount: categoryWinners.length,
        winners: categoryWinners
      };
    });
  }, [winners]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 space-y-6 p-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              🏆 Winners Hall of Fame 🏆
            </h2>
            <p className="text-blue-100 text-lg">Live celebration of all our amazing winners!</p>
          </div>
          <div className="flex items-center gap-4">
            {winners.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportExcel}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-500/50 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Excel
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </button>
                </div>
                <button
                  onClick={handlePurgeWinners}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full font-semibold hover:from-red-600 hover:to-pink-700 focus:ring-4 focus:ring-red-500/50 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Purge All Winners
                </button>
              </>
            )}
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
              <Trophy className="w-16 h-16 text-yellow-300" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 text-sm font-medium">Total Winners</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">{stats.totalWinners}</p>
            </div>
            <Trophy className="w-10 h-10 text-yellow-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium">Total Tickets Won</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">{stats.totalTickets.toLocaleString()}</p>
            </div>
            <Ticket className="w-10 h-10 text-green-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Avg Winner NPS</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">{stats.avgNPS.toFixed(1)}</p>
            </div>
            <Award className="w-10 h-10 text-blue-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Avg Winner NRPC</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{stats.avgNRPC.toFixed(1)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-300" />
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      {departmentStats.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-pink-300" />
            Winners by Department
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentStats.map(([department, count]) => (
              <motion.div
                key={department}
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/30 transition-all duration-300"
              >
                <h4 className="font-bold text-white">{department}</h4>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">{count}</p>
                <p className="text-xs text-blue-200 font-medium">winners</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Prize Categories Breakdown */}
      {winners.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Gift className="w-5 h-5 mr-2 text-yellow-300" />
            Winners by Prize Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {prizeStats.map((prize) => (
              <motion.div
                key={prize.id}
                whileHover={{ scale: 1.05 }}
                className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 ${
                  prize.winnersCount > 0 
                    ? 'border-green-400/50 bg-green-500/10' 
                    : 'border-white/20'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{prize.icon}</div>
                  <h4 className="font-bold text-white text-xs mb-1">{prize.name}</h4>
                  <div className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {prize.winnersCount}
                  </div>
                  <p className="text-xs text-blue-200 font-medium">
                    of {prize.winnerCount} winners
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                    <div
                      className={`h-1 rounded-full bg-gradient-to-r ${prize.gradient} transition-all duration-500`}
                      style={{ width: `${(prize.winnersCount / prize.winnerCount) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {/* Winners List */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <div className="px-6 py-4 border-b border-white/20 bg-white/20 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            🎉 All Winners 🎉
          </h3>
        </div>
        
        {winners.length === 0 ? (
          <div className="text-center py-12">
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
              <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
            </motion.div>
            <p className="text-white/60 text-lg">✨ No winners yet. Run your first magical raffle to get started! ✨</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/20 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Prize
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Winner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Supervisor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    NPS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    NRPC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Refund %
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Tickets
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Won At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {winners.map((winner, index) => (
                  <motion.tr
                    key={winner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/10 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {prizeCategories.find(p => p.id === winner.prize_category) && (
                          <>
                            <span className="text-2xl mr-2">
                              {prizeCategories.find(p => p.id === winner.prize_category)?.icon}
                            </span>
                            <div>
                              <div className="text-sm font-bold text-white">
                                {prizeCategories.find(p => p.id === winner.prize_category)?.name}
                              </div>
                              <div className="text-xs text-blue-200">
                                {prizeCategories.find(p => p.id === winner.prize_category)?.description}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-medium text-sm">
                            {winner.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white flex items-center">
                            {winner.name}
                            <Trophy className="w-4 h-4 ml-2 text-yellow-400" />
                          </div>
                          <div className="text-xs text-blue-200 font-medium">
                            🏆 {prizeCategories.find(p => p.id === winner.prize_category)?.name || 'Winner'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-sm">
                        {winner.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      {winner.supervisor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        winner.nps >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' :
                        winner.nps >= 80 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                        'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                      }`}>
                        {winner.nps}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        winner.nrpc >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' :
                        winner.nrpc >= 85 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                        'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                      }`}>
                        {winner.nrpc}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        winner.refund_percent <= 3 ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' :
                        winner.refund_percent <= 4 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                        'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                      }`}>
                        {winner.refund_percent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Ticket className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-bold text-white">{winner.total_tickets}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200 font-medium">
                      {new Date(winner.won_at).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};