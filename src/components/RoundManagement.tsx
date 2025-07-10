import React from 'react';
import { Tournament, Pairing, Player } from '../types';
import { generateSwissPairings, updateStandings } from '../utils/swissPairing';
import { v4 as uuidv4 } from 'uuid';

interface RoundManagementProps {
  tournament: Tournament;
  updateTournament: (updates: Partial<Tournament>) => void;
}

const RoundManagement: React.FC<RoundManagementProps> = ({
  tournament,
  updateTournament
}) => {
  // Get current round pairings
  const currentRoundPairings = tournament.pairings.filter(
    pairing => pairing.roundNumber === tournament.currentRound
  );
  
  // Check if current round is completed
  const isCurrentRoundComplete = currentRoundPairings.length > 0 && 
    currentRoundPairings.every(pairing => pairing.result !== "");
  
  // Function to generate pairings for the current round
  const handleGeneratePairings = () => {
    if (currentRoundPairings.length > 0) {
      if (!window.confirm('This will regenerate pairings for the current round. Proceed?')) {
        return;
      }
    }
    
    // Remove existing pairings for this round
    const otherPairings = tournament.pairings.filter(
      pairing => pairing.roundNumber !== tournament.currentRound
    );
    
    // Generate new pairings
    const newPairings = generateSwissPairings(
      tournament.players,
      otherPairings,
      tournament.currentRound
    );
    
    updateTournament({
      pairings: [...otherPairings, ...newPairings]
    });
  };
  
  // Function to update a pairing result
  const handleUpdateResult = (pairingId: string, result: Pairing['result']) => {
    const updatedPairings = tournament.pairings.map(pairing => 
      pairing.id === pairingId ? { ...pairing, result } : pairing
    );
    
    // Update standings based on new results
    const updatedPlayers = updateStandings(tournament.players, updatedPairings);
    
    updateTournament({
      pairings: updatedPairings,
      players: updatedPlayers
    });
  };
  
  // Function to advance to the next round
  const handleNextRound = () => {
    if (!isCurrentRoundComplete) {
      alert('Please complete all matches in the current round before advancing.');
      return;
    }
    
    const nextRound = tournament.currentRound + 1;
    
    if (nextRound > tournament.rounds) {
      // Tournament is complete
      updateTournament({
        completed: true
      });
      return;
    }
    
    updateTournament({
      currentRound: nextRound
    });
  };
  
  // Helper function to get player name by ID
  const getPlayerName = (playerId: string): string => {
    const player = tournament.players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          Round {tournament.currentRound} of {tournament.rounds}
        </h3>
        
        <div className="space-x-2">
          {currentRoundPairings.length === 0 && (
            <button
              onClick={handleGeneratePairings}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Generate Pairings
            </button>
          )}
          
          {isCurrentRoundComplete && !tournament.completed && (
            <button
              onClick={handleNextRound}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              {tournament.currentRound === tournament.rounds ? 'Finish Tournament' : 'Next Round'}
            </button>
          )}
        </div>
      </div>
      
      {tournament.completed ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 text-center text-emerald-800">
          The tournament is complete! View the final standings in the Standings tab.
        </div>
      ) : currentRoundPairings.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No pairings generated for this round yet. Click "Generate Pairings" to create pairings.
        </div>
      ) : (
        <div className="space-y-4">
          {currentRoundPairings.map(pairing => (
            <div key={pairing.id} className="bg-white border border-slate-200 rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex-1 text-center">
                  <span className="font-medium text-slate-800">{getPlayerName(pairing.player1Id)}</span>
                </div>
                
                <div className="flex space-x-2 mx-4">
                  <button
                    onClick={() => handleUpdateResult(pairing.id, "1-0")}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pairing.result === "1-0"
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    1-0
                  </button>
                  <button
                    onClick={() => handleUpdateResult(pairing.id, "1/2-1/2")}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pairing.result === "1/2-1/2"
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    ½-½
                  </button>
                  <button
                    onClick={() => handleUpdateResult(pairing.id, "0-1")}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pairing.result === "0-1"
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    0-1
                  </button>
                </div>
                
                <div className="flex-1 text-center">
                  <span className="font-medium text-slate-800">{getPlayerName(pairing.player2Id)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoundManagement;