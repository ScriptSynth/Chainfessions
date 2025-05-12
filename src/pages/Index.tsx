
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ConfessionForm from '@/components/ConfessionForm';
import ConfessionTabs from '@/components/ConfessionTabs';
import { Confession } from '@/components/ConfessionForm';
import { loadConfessions, addConfession } from '@/lib/confessionsStore';

const Index = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);

  // Load confessions from storage on mount
  useEffect(() => {
    const storedConfessions = loadConfessions();
    setConfessions(storedConfessions);
  }, []);

  // Handle new confession submissions
  const handleSubmitConfession = (newConfession: Confession) => {
    const updatedConfessions = addConfession(newConfession);
    setConfessions(updatedConfessions);
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <Header />
      
      <main className="mt-8">
        <ConfessionForm onSubmitConfession={handleSubmitConfession} />
        
        <ConfessionTabs confessions={confessions} />
      </main>
      
      <footer className="mt-16 py-6 text-center text-terminal-purple/50 font-press-start text-xs">
        <p>&copy; {new Date().getFullYear()} CHAINFESSIONS</p>
      </footer>
    </div>
  );
};

export default Index;
