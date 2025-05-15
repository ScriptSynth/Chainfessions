
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import PixelContainer from '@/components/PixelContainer';
import RetroText from '@/components/RetroText';
import RetroButton from '@/components/RetroButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Confession } from '@/components/ConfessionForm';
import ConfessionCard from '@/components/ConfessionCard';
import { Card, CardContent } from '@/components/ui/card';
import { CircuitBoard, User } from 'lucide-react';

const Profile = () => {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [userConfessions, setUserConfessions] = useState<Confession[]>([]);
  const [isLoadingConfessions, setIsLoadingConfessions] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      navigate('/auth');
    }
    
    // Initialize form with current profile data
    if (profile) {
      setUsername(profile.username || '');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserConfessions();
    }
  }, [user]);

  const fetchUserConfessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });
        
      if (error) {
        console.error('Error fetching user confessions:', error);
        return;
      }
      
      const confessions = data.map(item => ({
        id: item.id,
        text: item.text,
        chain: item.chain,
        degenRating: item.degen_rating,
        timestamp: new Date(item.timestamp).getTime()
      }));
      
      setUserConfessions(confessions);
    } catch (error) {
      console.error('Error in fetchUserConfessions:', error);
    } finally {
      setIsLoadingConfessions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Update profile
      await updateProfile({
        username,
      } as any);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
        <Header />
        <div className="mt-12 flex justify-center">
          <div className="terminal-loading">
            <div className="text-terminal-green font-vt323 text-xl">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <Header />
      
      <main className="mt-8 space-y-8">
        <Card className="border-2 border-terminal-purple bg-terminal-black/90 backdrop-blur-sm shadow-lg shadow-terminal-purple/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-terminal-purple/20 rounded-full flex items-center justify-center mr-4 animate-pulse-slow">
                <User className="text-terminal-purple" size={24} />
              </div>
              <RetroText glowing className="text-2xl text-terminal-purple">
                YOUR PROFILE
              </RetroText>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <RetroText className="mb-2 text-terminal-cyan">{'>'} USERNAME</RetroText>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-terminal-darkgray text-terminal-green border-2 border-terminal-purple p-3 font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple rounded shadow-inner"
                  disabled={isSaving}
                  placeholder="Enter your username"
                />
                <div className="absolute right-3 top-9">
                  <CircuitBoard size={16} className="text-terminal-purple/70" />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <RetroButton 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-gradient-to-r from-terminal-purple to-violet-600 border-none shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                >
                  {isSaving ? 'SAVING...' : 'SAVE PROFILE'}
                </RetroButton>
                
                <RetroButton 
                  type="button"
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-red-600 to-red-500 border-none shadow-[0_0_15px_rgba(220,38,38,0.3)] shadow-red-500/30"
                >
                  LOGOUT
                </RetroButton>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-terminal-purple bg-terminal-black/90 backdrop-blur-sm shadow-lg shadow-terminal-purple/20">
          <CardContent className="p-6">
            <RetroText glowing className="text-2xl mb-6 text-terminal-purple">
              {'>'} YOUR CONFESSIONS
            </RetroText>
            
            {isLoadingConfessions ? (
              <div className="py-10 text-center">
                <div className="inline-block terminal-loading px-6">
                  <RetroText className="text-terminal-green animate-pulse">Loading your confessions...</RetroText>
                </div>
              </div>
            ) : userConfessions.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-terminal-purple/30 rounded-lg">
                <RetroText className="text-terminal-purple/60">You haven't made any confessions yet.</RetroText>
                <RetroButton 
                  className="mt-4 bg-gradient-to-r from-terminal-purple to-violet-600 border-none shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                  onClick={() => navigate('/')}
                >
                  MAKE A CONFESSION
                </RetroButton>
              </div>
            ) : (
              <div className="space-y-6">
                {userConfessions.map(confession => (
                  <ConfessionCard key={confession.id} confession={confession} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
