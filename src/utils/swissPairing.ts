import { Player, Pairing } from "../types";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates Swiss pairings for the current round
 * @param players List of players sorted by points (desc) and rating (desc)
 * @param previousPairings List of all pairings from previous rounds
 * @param roundNumber Current round number
 * @returns List of new pairings for the current round
 */
export const generateSwissPairings = (
  players: Player[],
  previousPairings: Pairing[],
  roundNumber: number
): Pairing[] => {
  // Sort players by points (desc) and then by rating (desc)
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.rating - a.rating;
  });
  
  // Create a copy of sorted players to work with
  const availablePlayers = [...sortedPlayers];
  const newPairings: Pairing[] = [];
  
  // Handle odd number of players with a bye
  if (availablePlayers.length % 2 !== 0) {
    // Find the lowest-scoring player who hasn't had a bye yet
    for (let i = availablePlayers.length - 1; i >= 0; i--) {
      if (!availablePlayers[i].bye) {
        // Give this player a bye
        const byePlayer = availablePlayers.splice(i, 1)[0];
        
        // Mark player as having received a bye
        const playerWithBye: Player = {
          ...byePlayer,
          bye: true,
          points: byePlayer.points + 1, // Award 1 point for a bye
        };
        
        // Replace the original player with updated one
        const playerIndex = players.findIndex(p => p.id === byePlayer.id);
        if (playerIndex !== -1) {
          players[playerIndex] = playerWithBye;
        }
        
        break;
      }
    }
  }
  
  // Pair remaining players
  while (availablePlayers.length > 0) {
    const player1 = availablePlayers.shift();
    if (!player1) break;
    
    // Find the next available player who hasn't played against player1
    let paired = false;
    
    for (let i = 0; i < availablePlayers.length; i++) {
      const player2 = availablePlayers[i];
      
      // Check if these players have already played each other
      const previouslyPaired = previousPairings.some(
        pairing => 
          (pairing.player1Id === player1.id && pairing.player2Id === player2.id) ||
          (pairing.player1Id === player2.id && pairing.player2Id === player1.id)
      );
      
      if (!previouslyPaired) {
        // Create a new pairing
        newPairings.push({
          id: uuidv4(),
          player1Id: player1.id,
          player2Id: player2.id,
          result: "",
          roundNumber
        });
        
        // Remove player2 from available players
        availablePlayers.splice(i, 1);
        paired = true;
        break;
      }
    }
    
    // If no valid pairing found, pair with the next available player
    // This can happen in later rounds when avoiding repeat pairings becomes difficult
    if (!paired && availablePlayers.length > 0) {
      const player2 = availablePlayers.shift();
      if (player2) {
        newPairings.push({
          id: uuidv4(),
          player1Id: player1.id,
          player2Id: player2.id,
          result: "",
          roundNumber
        });
      }
    }
  }
  
  return newPairings;
};

/**
 * Updates player standings based on match results
 * @param players Current list of players
 * @param pairings All pairings with results
 * @returns Updated list of players with points recalculated
 */
export const updateStandings = (
  players: Player[],
  pairings: Pairing[]
): Player[] => {
  // Create a copy of players to work with
  const updatedPlayers = players.map(player => ({
    ...player,
    points: 0,
    opponents: [] as string[],
  }));
  
  // Process all pairings to update points and opponents
  pairings.forEach(pairing => {
    // Skip pairings without results
    if (pairing.result === "") return;
    
    const player1Index = updatedPlayers.findIndex(p => p.id === pairing.player1Id);
    const player2Index = updatedPlayers.findIndex(p => p.id === pairing.player2Id);
    
    if (player1Index === -1 || player2Index === -1) return;
    
    // Update opponents faced
    updatedPlayers[player1Index].opponents.push(pairing.player2Id);
    updatedPlayers[player2Index].opponents.push(pairing.player1Id);
    
    // Update points based on result
    if (pairing.result === "1-0") {
      updatedPlayers[player1Index].points += 1;
    } else if (pairing.result === "0-1") {
      updatedPlayers[player2Index].points += 1;
    } else if (pairing.result === "1/2-1/2") {
      updatedPlayers[player1Index].points += 0.5;
      updatedPlayers[player2Index].points += 0.5;
    }
  });
  
  return updatedPlayers;
};

/**
 * Calculates tiebreakers for each player
 * Currently implements Buchholz tiebreaker (sum of opponents' scores)
 */
export const calculateTiebreakers = (
  players: Player[]
): number[] => {
  const tiebreakers: number[] = new Array(players.length).fill(0);
  
  players.forEach((player, index) => {
    // Calculate Buchholz score (sum of opponents' scores)
    let buchholz = 0;
    player.opponents.forEach(opponentId => {
      const opponent = players.find(p => p.id === opponentId);
      if (opponent) {
        buchholz += opponent.points;
      }
    });
    
    tiebreakers[index] = buchholz;
  });
  
  return tiebreakers;
};