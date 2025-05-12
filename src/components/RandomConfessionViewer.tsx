
import React, { useState, useEffect } from 'react';
import { Confession } from './ConfessionForm';
import PixelContainer from './PixelContainer';
import RetroText from './RetroText';
import RetroButton from './RetroButton';
import ConfessionCard from './ConfessionCard';

interface RandomConfessionViewerProps {
  confessions: Confession[];
}

const RandomConfessionViewer = ({ confessions }: RandomConfessionViewerProps) => {
  const [randomConfession, setRandomConfession] = useState<Confession | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);

  const getRandomConfession = () => {
    if (confessions.length === 0) return null;
    
    // Apply glitch animation
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 500);
    
    // Get random confession
    const randomIndex = Math.floor(Math.random() * confessions.length);
    return confessions[randomIndex];
  };

  const handleGetRandom = () => {
    setRandomConfession(getRandomConfession());
  };

  useEffect(() => {
    if (confessions.length > 0 && !randomConfession) {
      setRandomConfession(getRandomConfession());
    }
  }, [confessions]);

  if (confessions.length === 0) {
    return (
      <PixelContainer>
        <RetroText glowing className="text-xl text-terminal-purple">
          No confessions available for random viewing.
        </RetroText>
      </PixelContainer>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`transition-all ${glitchEffect ? 'animate-glitch' : ''}`}>
        {randomConfession && <ConfessionCard confession={randomConfession} isRandom />}
      </div>
      
      <div className="flex justify-center">
        <RetroButton onClick={handleGetRandom}>
          New Random Confession
        </RetroButton>
      </div>
    </div>
  );
};

export default RandomConfessionViewer;
