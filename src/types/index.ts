export interface Player {
  id: string;
  name: string;
  rating: number;
  points: number;
  opponents: string[]; // IDs of opponents faced
  colorHistory: string[]; // 'W' or 'B' for each round
  bye: boolean; // Whether player has received a bye
}

export interface Pairing {
  id: string;
  player1Id: string;
  player2Id: string;
  result: "1-0" | "0-1" | "1/2-1/2" | ""; // Empty string means not played yet
  roundNumber: number;
}

export interface Tournament {
  id: string;
  name: string;
  rounds: number;
  currentRound: number;
  players: Player[];
  pairings: Pairing[];
  started: boolean;
  completed: boolean;
}