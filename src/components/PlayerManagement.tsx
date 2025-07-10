import React, { useState } from 'react';
import { Player, Tournament } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface PlayerManagementProps {
  tournament: Tournament;
  updateTournament: (updates: Partial<Tournament>) => void;
  disabled: boolean;
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({
  tournament,
  updateTournament,
  disabled
}) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a player name');
      return;
    }
    
    const playerRating = rating.trim() ? parseInt(rating, 10) : 0;
    
    const newPlayer: Player = {
      id: uuidv4(),
      name: name.trim(),
      rating: playerRating,
      points: 0,
      opponents: [],
      colorHistory: [],
      bye: false
    };
    
    updateTournament({
      players: [...tournament.players, newPlayer]
    });
    
    // Reset form
    setName('');
    setRating('');
  };
  
  const handleRemovePlayer = (playerId: string) => {
    updateTournament({
      players: tournament.players.filter(player => player.id !== playerId)
    });
  };
  
  const handleBulkImport = () => {
    const input = prompt('Enter players (one per line, format: "Name, Rating")');
    if (!input) return;
    
    const lines = input.split('\n');
    const newPlayers: Player[] = [...tournament.players];
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 1) {
        const playerName = parts[0].trim();
        if (playerName) {
          const playerRating = parts[1] ? parseInt(parts[1].trim(), 10) : 0;
          
          newPlayers.push({
            id: uuidv4(),
            name: playerName,
            rating: isNaN(playerRating) ? 0 : playerRating,
            points: 0,
            opponents: [],
            colorHistory: [],
            bye: false
          });
        }
      }
    });
    
    updateTournament({ players: newPlayers });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Players ({tournament.players.length})</h3>
        
        {!disabled && (
          <button
            onClick={handleBulkImport}
            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded transition-colors duration-200"
          >
            Bulk Import
          </button>
        )}
      </div>
      
      {!disabled && (
        <form onSubmit={handleAddPlayer} className="mb-6 flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Player Name"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={disabled}
            />
          </div>
          
          <div className="w-24">
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Rating"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={disabled}
            />
          </div>
          
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            disabled={disabled}
          >
            Add Player
          </button>
        </form>
      )}
      
      {tournament.players.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No players added yet. Add players to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rating
                </th>
                {!disabled && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {tournament.players.map((player) => (
                <tr key={player.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                    {player.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {player.rating > 0 ? player.rating : '-'}
                  </td>
                  {!disabled && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleRemovePlayer(player.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;