import React, { useState, useMemo } from 'react';
import { Search, Filter, User, Award, Percent, Ticket, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Guide } from '../types';
import { assignTicketsToGuides, GuideWithTickets } from '../utils/ticketSystem';
import { exportUniversalPoolToExcel, exportUniversalPoolToPDF } from '../utils/exportUtils';
import guidesData from '../data/guides.json';

export const GuidesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  const guides = guidesData as Guide[];
  const guidesWithTickets = useMemo(() => assignTicketsToGuides(guides), [guides]);

  const departments = useMemo(() => {
    return Array.from(new Set(guidesWithTickets.map(guide => guide.department))).sort();
  }, [guidesWithTickets]);

  const supervisors = useMemo(() => {
    return Array.from(new Set(guidesWithTickets.map(guide => guide.supervisor))).sort();
  }, [guidesWithTickets]);

  const filteredGuides = useMemo(() => {
    return guidesWithTickets.filter(guide => {
      const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !selectedDepartment || guide.department === selectedDepartment;
      const matchesSupervisor = !selectedSupervisor || guide.supervisor === selectedSupervisor;
      
      return matchesSearch && matchesDepartment && matchesSupervisor;
    });
  }, [guidesWithTickets, searchTerm, selectedDepartment, selectedSupervisor]);

  const stats = useMemo(() => {
    const totalTickets = guidesWithTickets.reduce((sum, guide) => sum + guide.totalTickets, 0);
    const avgNPS = guidesWithTickets.reduce((sum, guide) => sum + guide.nps, 0) / guidesWithTickets.length;
    const avgNRPC = guidesWithTickets.reduce((sum, guide) => sum + guide.nrpc, 0) / guidesWithTickets.length;
    const avgRefund = guidesWithTickets.reduce((sum, guide) => sum + guide.refundPercent, 0) / guidesWithTickets.length;

    return { totalTickets, avgNPS, avgNRPC, avgRefund };
  }, [guidesWithTickets]);

  const handleExportUniversalPoolExcel = () => {
    exportUniversalPoolToExcel(guidesWithTickets);
  };

  const handleExportUniversalPoolPDF = () => {
    exportUniversalPoolToPDF(guidesWithTickets);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 space-y-6 p-6">
      {/* Header with Export Options */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              👥 Universal Pool - All Guides 👥
            </h2>
            <p className="text-blue-100 text-lg">Complete database of all shortlisted guides with ticket assignments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportUniversalPoolExcel}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-500/50 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </button>
              <button
                onClick={handleExportUniversalPoolPDF}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </button>
            </div>
            <Download className="w-8 h-8 text-blue-300" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Total Guides</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">{guidesWithTickets.length}</p>
            </div>
            <User className="w-10 h-10 text-blue-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium">Total Tickets</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">{stats.totalTickets.toLocaleString()}</p>
            </div>
            <Ticket className="w-10 h-10 text-green-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Avg NPS</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{stats.avgNPS.toFixed(1)}</p>
            </div>
            <Award className="w-10 h-10 text-purple-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm font-medium">Avg Refund%</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">{stats.avgRefund.toFixed(1)}%</p>
            </div>
            <Percent className="w-10 h-10 text-orange-300" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="🔍 Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              className="px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Supervisors</option>
              {supervisors.map(supervisor => (
                <option key={supervisor} value={supervisor}>{supervisor}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Guides Table */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/20 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Guide
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
                  Total Tickets
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Ticket Range
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredGuides.map((guide) => (
                <tr key={guide.id} className="hover:bg-white/10 transition-colors duration-300">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-medium text-sm">
                          {guide.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-white">{guide.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-sm">
                      {guide.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    {guide.supervisor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      guide.nps >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' :
                      guide.nps >= 80 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                      'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                    }`}>
                      {guide.nps}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      guide.nrpc >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' :
                      guide.nrpc >= 85 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                      'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                    }`}>
                      {guide.nrpc}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      guide.refundPercent <= 3 ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' :
                      guide.refundPercent <= 4 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                      'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                    }`}>
                      {guide.refundPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Ticket className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-bold text-white">{guide.totalTickets}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-blue-200">
                      <div className="space-y-1">
                        <span className="font-mono bg-white/20 px-2 py-1 rounded block">
                          #{guide.ticketRange.start.toString().padStart(4, '0')}-#{guide.ticketRange.end.toString().padStart(4, '0')}
                        </span>
                        <div className="text-xs text-white/60">
                          {guide.ticketNumbers.length > 10 ? 
                            `${guide.ticketNumbers.slice(0, 5).map(t => `#${t.toString().padStart(4, '0')}`).join(', ')}...+${guide.ticketNumbers.length - 5} more` :
                            guide.ticketNumbers.map(t => `#${t.toString().padStart(4, '0')}`).join(', ')
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">✨ No guides found matching your criteria ✨</p>
          </div>
        )}
      </div>
    </div>
  );
};