
import React from 'react';
import RetroText from './RetroText';

const Header = () => {
  return (
    <header className="py-8 text-center">
      <RetroText className="text-5xl font-press-start text-terminal-purple mb-4 glow-text">
        CHAINFESSIONS
      </RetroText>
      
      <RetroText className="text-xl text-terminal-cyan mb-8">
        {'>'} Confess your blockchain secrets anonymously
      </RetroText>
      
      <div className="max-w-2xl mx-auto px-4">
        <RetroText className="text-sm text-terminal-green/80 border-2 border-terminal-purple/30 p-4 bg-terminal-darkpurple/30">
          We store no IPs. We don't care who you are. Just confess your crypto sins and sleep better tonight.
        </RetroText>
      </div>
    </header>
  );
};

export default Header;
