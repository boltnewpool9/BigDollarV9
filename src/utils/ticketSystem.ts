import { Guide } from '../types';

export interface GuideWithTickets extends Guide {
  ticketNumbers: number[];
  ticketRange: { start: number; end: number };
}

export const assignTicketsToGuides = (guides: Guide[]): GuideWithTickets[] => {
  // Sort guides by ticket count in descending order
  const sortedGuides = [...guides].sort((a, b) => b.totalTickets - a.totalTickets);
  
  let currentTicketNumber = 1;
  const guidesWithTickets: GuideWithTickets[] = [];

  for (const guide of sortedGuides) {
    const ticketNumbers: number[] = [];
    const startTicket = currentTicketNumber;
    
    // Assign consecutive ticket numbers to each guide
    for (let i = 0; i < guide.totalTickets; i++) {
      ticketNumbers.push(currentTicketNumber);
      currentTicketNumber++;
    }
    
    const endTicket = currentTicketNumber - 1;
    
    guidesWithTickets.push({
      ...guide,
      ticketNumbers,
      ticketRange: { start: startTicket, end: endTicket }
    });
  }

  return guidesWithTickets;
};

export const drawRandomTickets = (guidesWithTickets: GuideWithTickets[], count: number): { winners: GuideWithTickets[], drawnTickets: number[] } => {
  const totalTickets = guidesWithTickets.reduce((sum, guide) => sum + guide.totalTickets, 0);
  const drawnTickets: number[] = [];
  const winners: GuideWithTickets[] = [];
  const availableGuides = [...guidesWithTickets];

  for (let i = 0; i < count && availableGuides.length > 0; i++) {
    // Draw a random ticket number from 1 to totalTickets
    const randomTicket = Math.floor(Math.random() * totalTickets) + 1;
    drawnTickets.push(randomTicket);
    
    // Find which guide owns this ticket
    const winnerGuide = availableGuides.find(guide => 
      randomTicket >= guide.ticketRange.start && randomTicket <= guide.ticketRange.end
    );
    
    if (winnerGuide) {
      winners.push(winnerGuide);
      // Remove the winner from available guides to prevent duplicate wins
      const index = availableGuides.indexOf(winnerGuide);
      availableGuides.splice(index, 1);
    }
  }

  return { winners, drawnTickets };
};

export const findGuideByTicket = (ticketNumber: number, guidesWithTickets: GuideWithTickets[]): GuideWithTickets | null => {
  return guidesWithTickets.find(guide => 
    ticketNumber >= guide.ticketRange.start && ticketNumber <= guide.ticketRange.end
  ) || null;
};