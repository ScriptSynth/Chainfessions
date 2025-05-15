
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ConfessionForm from '@/components/ConfessionForm';
import ConfessionTabs from '@/components/ConfessionTabs';
import { Confession } from '@/components/ConfessionForm';
import { getConfessions, addConfession as addConfessionToDb } from '@/services/confessionService';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load confessions from Supabase on mount
  useEffect(() => {
    const loadConfessions = async () => {
      setIsLoading(true);
      try {
        const data = await getConfessions();
        setConfessions(data);
      } catch (error) {
        console.error('Failed to load confessions:', error);
        toast({
          title: "Error loading confessions",
          description: "There was a problem loading confessions. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfessions();
  }, [toast]);

  // Handle new confession submissions
  const handleSubmitConfession = async (newConfession: Omit<Confession, 'id' | 'timestamp'>, mediaFile?: File) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to submit a confession",
        variant: "destructive"
      });
      return;
    }

    try {
      const savedConfession = await addConfessionToDb(newConfession, user.id, mediaFile);
      
      if (savedConfession) {
        setConfessions(prev => [savedConfession, ...prev]);
        toast({
          title: "Confession submitted!",
          description: "Your secret is safe on the chain now...",
          duration: 5000 // Auto dismiss after 5 seconds
        });
      } else {
        throw new Error('Failed to save confession');
      }
    } catch (error) {
      console.error('Error submitting confession:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your confession. Please try again.",
        variant: "destructive",
        duration: 5000 // Auto dismiss after 5 seconds
      });
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <Header />
      
      <main className="mt-8">
        <ConfessionForm onSubmitConfession={handleSubmitConfession} />
        
        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <div className="terminal-loading">
              <div className="text-terminal-green font-vt323 text-xl">Loading confessions...</div>
            </div>
          </div>
        ) : (
          <ConfessionTabs confessions={confessions} />
        )}
      </main>
      
      <footer className="mt-16 py-6 text-center text-terminal-purple/50 font-press-start text-xs">
        <p>&copy; {new Date().getFullYear()} CHAINFESSIONS</p>
      </footer>
    </div>
  );
};

export default Index;
