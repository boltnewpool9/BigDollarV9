import { Guide } from '../types';

export interface GuideWithTickets extends Guide {
  ticketNumbers: number[];
  ticketRange: { start: number; end: number };
}

export const assignTicketsToGuides = (guides: Guide[]): GuideWithTickets[] => {
  // Calculate total tickets needed
  const totalTickets = guides.reduce((sum, guide) => sum + guide.totalTickets, 0);
  
  // Create array of all ticket numbers
  const allTickets = Array.from({ length: totalTickets }, (_, i) => i + 1);
  
  // Shuffle the tickets using Fisher-Yates algorithm
  for (let i = allTickets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allTickets[i], allTickets[j]] = [allTickets[j], allTickets[i]];
  }
  
  // Sort guides by ticket count in descending order for consistent assignment
  const sortedGuides = [...guides].sort((a, b) => b.totalTickets - a.totalTickets);
  
  let ticketIndex = 0;
  const guidesWithTickets: GuideWithTickets[] = [];

  for (const guide of sortedGuides) {
    const ticketNumbers: number[] = [];
    
    // Assign random tickets to each guide
    for (let i = 0; i < guide.totalTickets; i++) {
      if (ticketIndex < allTickets.length) {
        ticketNumbers.push(allTickets[ticketIndex]);
        ticketIndex++;
      }
    }
    
    // Sort the assigned tickets for display purposes
    ticketNumbers.sort((a, b) => a - b);
    
    const startTicket = Math.min(...ticketNumbers);
    const endTicket = Math.max(...ticketNumbers);
    
    guidesWithTickets.push({
      ...guide,
      ticketNumbers,
      ticketRange: { start: startTicket, end: endTicket }
    });
  }

  // Sort back by original order (by id) for consistent display
  return guidesWithTickets.sort((a, b) => a.id - b.id);
};

export const drawRandomTickets = (guidesWithTickets: GuideWithTickets[], count: number): { winners: GuideWithTickets[], drawnTickets: number[] } => {
  const drawnTickets: number[] = [];
  const winners: GuideWithTickets[] = [];
  const availableGuides = [...guidesWithTickets];

  for (let i = 0; i < count && availableGuides.length > 0; i++) {
    // Get all available ticket numbers from remaining guides
    const allAvailableTickets: number[] = [];
    availableGuides.forEach(guide => {
      allAvailableTickets.push(...guide.ticketNumbers);
    });
    
    if (allAvailableTickets.length === 0) break;
    
    // Draw a random ticket from all available tickets
    const randomIndex = Math.floor(Math.random() * allAvailableTickets.length);
    const randomTicket = allAvailableTickets[randomIndex];
    drawnTickets.push(randomTicket);
    
    // Find which guide owns this ticket
    const winnerGuide = availableGuides.find(guide => 
      guide.ticketNumbers.includes(randomTicket)
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
    guide.ticketNumbers.includes(ticketNumber)
  ) || null;
};