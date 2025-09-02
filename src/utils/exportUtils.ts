import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PrizeWinner } from '../types';
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
      'Drawn Ticket': winner.drawn_ticket ? `#${winner.drawn_ticket.toString().padStart(4, '0')}` : 'N/A',
      'Winner Name': winner.name,
      'Department': winner.department,
      'Supervisor': winner.supervisor,
      'NPS Score': winner.nps,
      'NRPC Score': winner.nrpc,
      'Refund Percentage': `${winner.refund_percent.toFixed(1)}%`,
      'Total Tickets': winner.total_tickets,
      'Won Date': new Date(winner.won_at).toLocaleDateString(),
      'Won Time': new Date(winner.won_at).toLocaleTimeString()
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  
  // Set column widths
  const colWidths = [
    { wch: 25 }, // Prize Category
    { wch: 12 }, // Drawn Ticket
    { wch: 25 }, // Winner Name
    { wch: 15 }, // Department
    { wch: 20 }, // Supervisor
    { wch: 10 }, // NPS Score
    { wch: 10 }, // NRPC Score
    { wch: 15 }, // Refund Percentage
    { wch: 12 }, // Total Tickets
    { wch: 12 }, // Won Date
    { wch: 12 }  // Won Time
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contest Winners');
  
  const fileName = `Contest_Winners_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportToPDF = (winners: PrizeWinner[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Big Dollar Contest - Winners Report', 20, 20);
  
  // Add generation date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  
  // Prepare table data
  const tableData = winners.map(winner => {
    const prizeCategory = prizeCategories.find(p => p.id === winner.prize_category);
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
      new Date(winner.won_at).toLocaleDateString()
    ];
  });

  // Add table
  doc.autoTable({
    head: [['Prize Category', 'Ticket', 'Winner Name', 'Department', 'Supervisor', 'NPS', 'NRPC', 'Refund %', 'Tickets', 'Won Date']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2
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
      0: { cellWidth: 25 },
      1: { cellWidth: 12 },
      2: { cellWidth: 25 },
      3: { cellWidth: 15 },
      4: { cellWidth: 20 },
      5: { cellWidth: 10 },
      6: { cellWidth: 10 },
      7: { cellWidth: 12 },
      8: { cellWidth: 10 },
      9: { cellWidth: 15 }
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

  // Save the PDF
  const fileName = `Contest_Winners_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};