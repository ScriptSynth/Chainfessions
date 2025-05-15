
import React from 'react';
import { Confession } from './ConfessionForm';
import RetroText from './RetroText';
import ConfessionFeed from './ConfessionFeed';

interface ConfessionTabsProps {
  confessions: Confession[];
}

const ConfessionTabs = ({ confessions }: ConfessionTabsProps) => {
  return (
    <div className="mt-12">
      <div className="border-b-2 border-terminal-purple mb-6">
        <div className="px-6 py-3 bg-terminal-purple/20 border-t-2 border-l-2 border-r-2 border-terminal-purple inline-block">
          <RetroText className="text-terminal-purple glow-text">
            {'>'} ALL CONFESSIONS
          </RetroText>
        </div>
      </div>
      
      <div className="transition-all duration-300">
        <ConfessionFeed confessions={confessions} />
      </div>
    </div>
  );
};

export default ConfessionTabs;
