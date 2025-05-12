
import React from 'react';
import { Confession } from './ConfessionForm';
import ConfessionCard from './ConfessionCard';
import RetroText from './RetroText';

interface ConfessionFeedProps {
  confessions: Confession[];
}

const ConfessionFeed = ({ confessions }: ConfessionFeedProps) => {
  if (confessions.length === 0) {
    return (
      <div className="text-center py-12">
        <RetroText glowing className="text-xl text-terminal-purple">
          No confessions yet. Be the first to confess!
        </RetroText>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {confessions.map((confession) => (
        <ConfessionCard key={confession.id} confession={confession} />
      ))}
    </div>
  );
};

export default ConfessionFeed;
