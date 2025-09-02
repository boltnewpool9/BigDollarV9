import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PrizeWinner } from '../types';
import { GuideWithTickets } from './ticketSystem';
import { prizeCategories } from '../data/prizeCategories';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToExcel = (winners: PrizeWinner[]) => {
  const exportData = winners.map(winner => {
    const prizeCategory = prizeCategories.find(p => p.id === winner.prize_category);
    return {
      'Prize Category': prizeCategory?.name || 'Unknown',
      'Prize Icon': prizeCategory?.icon || '',
      'Drawn Ticket': winner.drawn_ticket ? `#${winner.drawn_ticket.toString().padStart(4, '0')}` : 'N/A',
      'Winner Name': winner.name,
      'Department': winner.department,
      'Supervisor': winner.supervisor,
      'NPS Score': winner.nps,
      'NRPC Score': winner.nrpc,
      'Refund Percentage': winner.refund_percent,
      'Total Tickets Owned': winner.total_tickets,
      'Ticket Range Start': `#${Math.min(...JSON.parse(winner.ticket_numbers || '[]')).toString().padStart(4, '0')}` || 'N/A',
      'Ticket Range End': `#${Math.max(...JSON.parse(winner.ticket_numbers || '[]')).toString().padStart(4, '0')}` || 'N/A',
      'All Ticket Numbers': winner.ticket_numbers ? JSON.parse(winner.ticket_numbers).map((t: number) => `#${t.toString().padStart(4, '0')}`).join(', ') : 'N/A',
      'Won Date': new Date(winner.won_at).toLocaleDateString(),
      'Won Time': new Date(winner.won_at).toLocaleTimeString(),
      'Guide ID': winner.guide_id
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  
  // Set column widths
  const colWidths = [
    { wch: 25 }, // Prize Category
    { wch: 8 },  // Prize Icon
    { wch: 12 }, // Drawn Ticket
    { wch: 25 }, // Winner Name
    { wch: 15 }, // Department
    { wch: 20 }, // Supervisor
    { wch: 10 }, // NPS Score
    { wch: 10 }, // NRPC Score
    { wch: 15 }, // Refund Percentage
    { wch: 15 }, // Total Tickets Owned
    { wch: 15 }, // Ticket Range Start
    { wch: 15 }, // Ticket Range End
    { wch: 50 }, // All Ticket Numbers
    { wch: 12 }, // Won Date
    { wch: 12 }, // Won Time
    { wch: 10 }  // Guide ID
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contest Winners');
  
  const fileName = `Contest_Winners_Detailed_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportToPDF = (winners: PrizeWinner[]) => {
  const doc = new jsPDF('landscape'); // Use landscape for more columns
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Big Dollar Contest - Detailed Winners Report', 20, 20);
  
  // Add generation date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  
  // Prepare table data
  const tableData = winners.map(winner => {
    const prizeCategory = prizeCategories.find(p => p.id === winner.prize_category);
    const ticketNumbers = winner.ticket_numbers ? JSON.parse(winner.ticket_numbers) : [];
    const ticketRange = ticketNumbers.length > 0 ? 
      `#${Math.min(...ticketNumbers).toString().padStart(4, '0')}-#${Math.max(...ticketNumbers).toString().padStart(4, '0')}` : 
      'N/A';
    
    return [
      prizeCategory?.name || 'Unknown',
      winner.drawn_ticket ? `#${winner.drawn_ticket.toString().padStart(4, '0')}` : 'N/A',
      winner.name,
      winner.department,
      winner.supervisor,
      winner.nps.toString(),
      winner.nrpc.toString(),
      `${winner.refund_percent.toFixed(1)}%`,
      winner.total_tickets.toString(),
      ticketRange,
      new Date(winner.won_at).toLocaleDateString()
    ];
  });

  // Add table
  doc.autoTable({
    head: [['Prize Category', 'Drawn Ticket', 'Winner Name', 'Department', 'Supervisor', 'NPS', 'NRPC', 'Refund %', 'Total Tickets', 'Ticket Range', 'Won Date']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 7,
      cellPadding: 1.5
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { cellWidth: 35 }, // Prize Category
      1: { cellWidth: 15 }, // Drawn Ticket
      2: { cellWidth: 35 }, // Winner Name
      3: { cellWidth: 20 }, // Department
      4: { cellWidth: 25 }, // Supervisor
      5: { cellWidth: 12 }, // NPS
      6: { cellWidth: 12 }, // NRPC
      7: { cellWidth: 15 }, // Refund %
      8: { cellWidth: 15 }, // Total Tickets
      9: { cellWidth: 25 }, // Ticket Range
      10: { cellWidth: 18 }  // Won Date
    }
  });

  // Add summary statistics
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text('Summary Statistics:', 20, finalY);
  
  doc.setFontSize(10);
  doc.text(`Total Winners: ${winners.length}`, 20, finalY + 10);
  
  const totalTickets = winners.reduce((sum, w) => sum + w.total_tickets, 0);
  doc.text(`Total Tickets Won: ${totalTickets.toLocaleString()}`, 20, finalY + 20);
  
  const avgNPS = winners.length > 0 ? winners.reduce((sum, w) => sum + w.nps, 0) / winners.length : 0;
  doc.text(`Average NPS: ${avgNPS.toFixed(1)}`, 20, finalY + 30);
  
  const avgNRPC = winners.length > 0 ? winners.reduce((sum, w) => sum + w.nrpc, 0) / winners.length : 0;
  doc.text(`Average NRPC: ${avgNRPC.toFixed(1)}`, 20, finalY + 40);

  // Add prize category breakdown
  doc.text('Prize Category Breakdown:', 150, finalY);
  let yPos = finalY + 10;
  prizeCategories.forEach(category => {
    const categoryWinners = winners.filter(w => w.prize_category === category.id);
    if (categoryWinners.length > 0) {
      doc.text(`${category.name}: ${categoryWinners.length} winners`, 150, yPos);
      yPos += 10;
    }
  });

  // Save the PDF
  const fileName = `Contest_Winners_Detailed_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const exportUniversalPoolToExcel = (guides: GuideWithTickets[]) => {
  const exportData = guides.map(guide => ({
    'Guide ID': guide.id,
    'Name': guide.name,
    'Department': guide.department,
    'Supervisor': guide.supervisor,
    'NPS Score': guide.nps,
    'NRPC Score': guide.nrpc,
    'Refund Percentage': guide.refundPercent,
    'Total Tickets Assigned': guide.totalTickets,
    'Ticket Range Start': guide.ticketNumbers.length > 0 ? `#${Math.min(...guide.ticketNumbers).toString().padStart(4, '0')}` : 'N/A',
    'Ticket Range End': guide.ticketNumbers.length > 0 ? `#${Math.max(...guide.ticketNumbers).toString().padStart(4, '0')}` : 'N/A',
    'All Assigned Tickets': guide.ticketNumbers.length > 0 ? 
      guide.ticketNumbers.sort((a, b) => a - b).map(t => `#${t.toString().padStart(4, '0')}`).join(', ') : 
      'No tickets',
    'Ticket Count Verification': guide.ticketNumbers.length,
    'Performance Tier': guide.nps >= 90 ? 'Excellent' : guide.nps >= 80 ? 'Good' : guide.nps >= 70 ? 'Average' : 'Below Average',
    'NRPC Tier': guide.nrpc >= 90 ? 'Excellent' : guide.nrpc >= 85 ? 'Good' : guide.nrpc >= 80 ? 'Average' : 'Below Average',
    'Refund Risk': guide.refundPercent <= 3 ? 'Low' : guide.refundPercent <= 5 ? 'Medium' : 'High'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  
  // Set column widths for better readability
  const colWidths = [
    { wch: 10 }, // Guide ID
    { wch: 30 }, // Name
    { wch: 15 }, // Department
    { wch: 25 }, // Supervisor
    { wch: 12 }, // NPS Score
    { wch: 12 }, // NRPC Score
    { wch: 18 }, // Refund Percentage
    { wch: 20 }, // Total Tickets Assigned
    { wch: 18 }, // Ticket Range Start
    { wch: 18 }, // Ticket Range End
    { wch: 80 }, // All Assigned Tickets (wide for long lists)
    { wch: 20 }, // Ticket Count Verification
    { wch: 15 }, // Performance Tier
    { wch: 15 }, // NRPC Tier
    { wch: 12 }  // Refund Risk
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Universal Pool - All Guides');
  
  const fileName = `Universal_Pool_Complete_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportUniversalPoolToPDF = (guides: GuideWithTickets[]) => {
  const doc = new jsPDF('landscape');
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Big Dollar Contest - Universal Pool Complete Data', 20, 20);
  
  // Add generation date and stats
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  
  const totalTickets = guides.reduce((sum, guide) => sum + guide.totalTickets, 0);
  const avgNPS = guides.reduce((sum, guide) => sum + guide.nps, 0) / guides.length;
  const avgNRPC = guides.reduce((sum, guide) => sum + guide.nrpc, 0) / guides.length;
  
  doc.text(`Total Guides: ${guides.length} | Total Tickets: ${totalTickets.toLocaleString()} | Avg NPS: ${avgNPS.toFixed(1)} | Avg NRPC: ${avgNRPC.toFixed(1)}`, 20, 35);
  
  // Prepare table data
  const tableData = guides.map(guide => {
    const ticketRange = guide.ticketNumbers.length > 0 ? 
      `#${Math.min(...guide.ticketNumbers).toString().padStart(4, '0')}-#${Math.max(...guide.ticketNumbers).toString().padStart(4, '0')}` : 
      'No tickets';
    
    const ticketPreview = guide.ticketNumbers.length > 0 ?
      guide.ticketNumbers.slice(0, 8).map(t => `#${t.toString().padStart(4, '0')}`).join(', ') + 
      (guide.ticketNumbers.length > 8 ? `... (+${guide.ticketNumbers.length - 8} more)` : '') :
      'No tickets';
    
    return [
      guide.id.toString(),
      guide.name,
      guide.department,
      guide.supervisor,
      guide.nps.toString(),
      guide.nrpc.toString(),
      `${guide.refundPercent.toFixed(1)}%`,
      guide.totalTickets.toString(),
      ticketRange,
      ticketPreview
    ];
  });

  // Add table
  doc.autoTable({
    head: [['ID', 'Name', 'Dept', 'Supervisor', 'NPS', 'NRPC', 'Refund%', 'Tickets', 'Range', 'Sample Tickets']],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 6,
      cellPadding: 1
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { cellWidth: 8 },  // ID
      1: { cellWidth: 35 }, // Name
      2: { cellWidth: 15 }, // Dept
      3: { cellWidth: 25 }, // Supervisor
      4: { cellWidth: 10 }, // NPS
      5: { cellWidth: 10 }, // NRPC
      6: { cellWidth: 12 }, // Refund%
      7: { cellWidth: 12 }, // Tickets
      8: { cellWidth: 20 }, // Range
      9: { cellWidth: 60 }  // Sample Tickets
    }
  });

  // Add department breakdown
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text('Department Breakdown:', 20, finalY);
  
  const deptStats = new Map<string, { count: number, tickets: number }>();
  guides.forEach(guide => {
    const current = deptStats.get(guide.department) || { count: 0, tickets: 0 };
    deptStats.set(guide.department, {
      count: current.count + 1,
      tickets: current.tickets + guide.totalTickets
    });
  });

  let yPos = finalY + 10;
  doc.setFontSize(9);
  Array.from(deptStats.entries()).forEach(([dept, stats]) => {
    doc.text(`${dept}: ${stats.count} guides, ${stats.tickets} tickets`, 20, yPos);
    yPos += 8;
  });

  // Save the PDF
  const fileName = `Universal_Pool_Complete_Data_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};