
import React from 'react';
import { Confession } from './ConfessionForm';
import PixelContainer from './PixelContainer';
import RetroText from './RetroText';
import DegenRating from './DegenRating';

interface ConfessionCardProps {
  confession: Confession;
  isRandom?: boolean;
}

const getChainIcon = (chain: string) => {
  switch (chain.toLowerCase()) {
    case 'eth':
      return '🟣';
    case 'sol':
      return '🔵';
    case 'bnb':
      return '🟡';
    case 'avax':
      return '🔴';
    case 'arb':
      return '🔵';
    case 'op':
      return '🔴';
    default:
      return '⚪';
  }
};

const getChainName = (chain: string) => {
  switch (chain.toLowerCase()) {
    case 'eth':
      return 'Ethereum';
    case 'sol':
      return 'Solana';
    case 'bnb':
      return 'Binance';
    case 'avax':
      return 'Avalanche';
    case 'arb':
      return 'Arbitrum';
    case 'op':
      return 'Optimism';
    default:
      return 'Other Chain';
  }
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toUTCString();
};

const ConfessionCard = ({ confession, isRandom = false }: ConfessionCardProps) => {
  return (
    <PixelContainer 
      className={`w-full mb-4 transition-all ${isRandom ? 'animate-glitch' : 'hover:scale-[1.01]'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getChainIcon(confession.chain)}</span>
          <RetroText className="text-terminal-cyan">
            {getChainName(confession.chain)}
          </RetroText>
        </div>
        
        <DegenRating rating={confession.degenRating} readOnly />
      </div>
      
      <RetroText className={`my-4 text-xl ${isRandom ? 'typewriter-text' : ''}`}>
        {confession.text}
      </RetroText>
      
      <div className="text-right mt-4">
        <RetroText className="text-terminal-purple/60 text-sm">
          {formatDate(confession.timestamp)}
        </RetroText>
      </div>
    </PixelContainer>
  );
};

export default ConfessionCard;
