import React, { useState } from 'react';
import TournamentCreation from './components/TournamentCreation';
import TournamentManagement from './components/TournamentManagement';
import Header from './components/Header';
import { Tournament } from './types';

function App() {
  const [tournament, setTournament] = useState<Tournament | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!tournament ? (
          <TournamentCreation onCreateTournament={setTournament} />
        ) : (
          <TournamentManagement 
            tournament={tournament} 
            setTournament={setTournament}
          />
        )}
      </main>
      
      <footer className="bg-navy-800 text-white py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>College Chess Tournament Manager &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;