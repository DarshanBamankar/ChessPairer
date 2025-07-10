import React, { useState } from 'react';
import { Tournament } from '../types';
import PlayerManagement from './PlayerManagement';
import RoundManagement from './RoundManagement';
import Leaderboard from './Leaderboard';

interface TournamentManagementProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament | null>>;
}

const TournamentManagement: React.FC<TournamentManagementProps> = ({ 
  tournament,
  setTournament
}) => {
  const [activeTab, setActiveTab] = useState<'players' | 'rounds' | 'standings'>('players');
  
  // Helper function to update the tournament
  const updateTournament = (updates: Partial<Tournament>) => {
    setTournament(current => {
      if (!current) return null;
      return { ...current, ...updates };
    });
  };
  
  // Function to handle starting the tournament
  const handleStartTournament = () => {
    if (tournament.players.length < 2) {
      alert('You need at least 2 players to start the tournament.');
      return;
    }
    
    updateTournament({
      started: true,
      currentRound: 1
    });
    
    // Move to the rounds tab
    setActiveTab('rounds');
  };
  
  // Function to reset the tournament
  const handleResetTournament = () => {
    if (window.confirm('Are you sure you want to reset this tournament? All data will be lost.')) {
      setTournament(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{tournament.name}</h2>
          {!tournament.started && (
            <button
              onClick={handleStartTournament}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Start Tournament
            </button>
          )}
          {tournament.started && !tournament.completed && (
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              Round {tournament.currentRound} of {tournament.rounds}
            </div>
          )}
          {tournament.completed && (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              Tournament Completed
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('players')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'players'
                  ? 'border-b-2 border-amber-500 text-amber-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Players
            </button>
            <button
              onClick={() => setActiveTab('rounds')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'rounds'
                  ? 'border-b-2 border-amber-500 text-amber-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={!tournament.started}
            >
              Rounds & Pairings
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'standings'
                  ? 'border-b-2 border-amber-500 text-amber-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Standings
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'players' && (
            <PlayerManagement
              tournament={tournament}
              updateTournament={updateTournament}
              disabled={tournament.started}
            />
          )}
          
          {activeTab === 'rounds' && (
            <RoundManagement
              tournament={tournament}
              updateTournament={updateTournament}
            />
          )}
          
          {activeTab === 'standings' && (
            <Leaderboard
              tournament={tournament}
            />
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleResetTournament}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Reset Tournament
        </button>
      </div>
    </div>
  );
};

export default TournamentManagement;