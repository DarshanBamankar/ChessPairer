import React from 'react';
import { ChessIcon } from './ChessIcon';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ChessIcon className="h-10 w-10 text-amber-400" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ChessPairer</h1>
            <p className="text-xs text-slate-300">Swiss Tournament Manager</p>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="#" className="text-white hover:text-amber-300 transition-colors duration-200">Home</a>
          <a href="#" className="text-slate-300 hover:text-amber-300 transition-colors duration-200">About Swiss System</a>
          <a href="#" className="text-slate-300 hover:text-amber-300 transition-colors duration-200">Help</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;