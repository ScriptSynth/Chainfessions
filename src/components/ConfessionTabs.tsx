
import React, { useState } from 'react';
import { Confession } from './ConfessionForm';
import RetroText from './RetroText';
import ConfessionFeed from './ConfessionFeed';
import RandomConfessionViewer from './RandomConfessionViewer';

interface ConfessionTabsProps {
  confessions: Confession[];
}

const ConfessionTabs = ({ confessions }: ConfessionTabsProps) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'random'>('feed');

  return (
    <div className="mt-12">
      <div className="flex border-b-2 border-terminal-purple mb-6">
        <button
          className={`px-6 py-3 ${
            activeTab === 'feed'
              ? 'bg-terminal-purple/20 border-t-2 border-l-2 border-r-2 border-terminal-purple'
              : 'bg-transparent'
          }`}
          onClick={() => setActiveTab('feed')}
        >
          <RetroText 
            className={`${
              activeTab === 'feed' ? 'text-terminal-purple glow-text' : 'text-terminal-purple/50'
            }`}
          >
            {'>'} ALL CONFESSIONS
          </RetroText>
        </button>
        
        <button
          className={`px-6 py-3 ${
            activeTab === 'random'
              ? 'bg-terminal-purple/20 border-t-2 border-l-2 border-r-2 border-terminal-purple'
              : 'bg-transparent'
          }`}
          onClick={() => setActiveTab('random')}
        >
          <RetroText 
            className={`${
              activeTab === 'random' ? 'text-terminal-purple glow-text' : 'text-terminal-purple/50'
            }`}
          >
            {'>'} RANDOM CONFESSION
          </RetroText>
        </button>
      </div>
      
      <div className="transition-all duration-300">
        {activeTab === 'feed' ? (
          <ConfessionFeed confessions={confessions} />
        ) : (
          <RandomConfessionViewer confessions={confessions} />
        )}
      </div>
    </div>
  );
};

export default ConfessionTabs;
