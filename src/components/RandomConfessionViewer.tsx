
import React, { useState, useEffect } from 'react';
import { Confession } from './ConfessionForm';
import PixelContainer from './PixelContainer';
import RetroText from './RetroText';
import RetroButton from './RetroButton';
import ConfessionCard from './ConfessionCard';
import { getRandomConfession } from '@/services/confessionService';
import { useToast } from "@/hooks/use-toast";

interface RandomConfessionViewerProps {
  confessions: Confession[];
}

const RandomConfessionViewer = ({ confessions }: RandomConfessionViewerProps) => {
  const [randomConfession, setRandomConfession] = useState<Confession | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchRandomConfession = async () => {
    setIsLoading(true);
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 500);
    
    try {
      const confession = await getRandomConfession();
      setRandomConfession(confession);
    } catch (error) {
      console.error('Error fetching random confession:', error);
      toast({
        title: "Error",
        description: "Failed to fetch a random confession. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRandom = () => {
    fetchRandomConfession();
  };

  useEffect(() => {
    if (confessions.length > 0 && !randomConfession) {
      fetchRandomConfession();
    }
  }, [confessions.length]);

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
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="terminal-loading">
            <RetroText glowing className="text-xl text-terminal-green animate-pulse">
              SCANNING THE BLOCKCHAIN...
            </RetroText>
          </div>
        </div>
      ) : (
        <div className={`transition-all ${glitchEffect ? 'animate-glitch' : ''}`}>
          {randomConfession && <ConfessionCard confession={randomConfession} isRandom />}
        </div>
      )}
      
      <div className="flex justify-center">
        <RetroButton onClick={handleGetRandom} disabled={isLoading}>
          New Random Confession
        </RetroButton>
      </div>
    </div>
  );
};

export default RandomConfessionViewer;
