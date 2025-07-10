import React from 'react';
import { ChevronRight as ChessKnight } from 'lucide-react';

interface ChessIconProps {
  className?: string;
}

export const ChessIcon: React.FC<ChessIconProps> = ({ className }) => {
  return <ChessKnight className={className} />;
};