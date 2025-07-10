import React from 'react';
import { Tournament } from '../types';
import { calculateTiebreakers } from '../utils/swissPairing';

interface LeaderboardProps {
  tournament: Tournament;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ tournament }) => {
  // Calculate tiebreakers
  const tiebreakers = calculateTiebreakers(tournament.players);
  
  // Sort players by points (desc) and then by tiebreaker (desc)
  const sortedPlayers = [...tournament.players]
    .map((player, index) => ({
      ...player,
      tiebreaker: tiebreakers[index]
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.tiebreaker - a.tiebreaker;
    });
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Standings</h3>
      
      {sortedPlayers.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No players added yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Points
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tiebreak
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedPlayers.map((player, index) => (
                <tr key={player.id} className={index === 0 ? 'bg-amber-50' : 'hover:bg-slate-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                    {player.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {player.rating > 0 ? player.rating : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                    {player.points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {player.tiebreaker}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 bg-slate-50 p-4 rounded-md">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Tiebreak Method</h4>
        <p className="text-xs text-slate-600">
          Buchholz System: The sum of the points of each opponent faced. This tiebreaker rewards players who faced stronger opposition.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;