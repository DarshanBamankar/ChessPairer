import React, { useState } from 'react';
import { Tournament } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TournamentCreationProps {
  onCreateTournament: (tournament: Tournament) => void;
}

const TournamentCreation: React.FC<TournamentCreationProps> = ({ onCreateTournament }) => {
  const [name, setName] = useState('');
  const [rounds, setRounds] = useState(5); // Default to 5 rounds
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a tournament name');
      return;
    }
    
    const newTournament: Tournament = {
      id: uuidv4(),
      name: name.trim(),
      rounds,
      currentRound: 0,
      players: [],
      pairings: [],
      started: false,
      completed: false
    };
    
    onCreateTournament(newTournament);
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Tournament</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="tournamentName" className="block text-sm font-medium text-slate-700 mb-1">
              Tournament Name
            </label>
            <input
              id="tournamentName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Fall 2025 Chess Championship"
              required
            />
          </div>
          
          <div>
            <label htmlFor="rounds" className="block text-sm font-medium text-slate-700 mb-1">
              Number of Rounds
            </label>
            <select
              id="rounds"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {[3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Round' : 'Rounds'}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Create Tournament
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">About Swiss Pairing System</h3>
        <p className="text-slate-600 text-sm">
          The Swiss system is a tournament format designed to pair players with similar scores. 
          In each round, players are paired against opponents with the same (or similar) score.
          This system ensures competitive matches while determining a winner in a limited number of rounds.
        </p>
      </div>
    </div>
  );
};

export default TournamentCreation;