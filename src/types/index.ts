export interface Guide {
  id: number;
  name: string;
  supervisor: string;
  department: string;
  nps: number;
  nrpc: number;
  refundPercent: number;
  totalTickets: number;
}

export interface Winner {
  id: string;
  guide_id: number;
  name: string;
  supervisor: string;
  department: string;
  nps: number;
  nrpc: number;
  refund_percent: number;
  total_tickets: number;
  won_at: string;
  created_at: string;
}

export interface RaffleSettings {
  maxWinners: number;
  drawFrom: 'all' | 'departments';
  selectedDepartments: string[];
}

export interface PrizeCategory {
  id: string;
  name: string;
  description: string;
  winnerCount: number;
  image: string;
  gradient: string;
  icon: string;
}

export interface PrizeWinner extends Winner {
  prize_category: string;
  prize_name: string;
  ticket_numbers?: string; // JSON string of ticket numbers array
  drawn_ticket?: number;
}