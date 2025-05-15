
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

const Profile = () => {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
      setAvatarUrl(profile.avatar_url || null);
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File too large",
          description: "Avatar image should be less than 2MB",
          variant: "destructive"
        });
        return;
      }
      setAvatarFile(file);
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;
    
    setIsUploading(true);
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `avatars/${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('confession-media')
        .upload(filePath, avatarFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('confession-media')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Avatar upload failed",
        description: "There was a problem uploading your avatar",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Upload avatar if changed
      let newAvatarUrl = profile?.avatar_url;
      if (avatarFile) {
        newAvatarUrl = await uploadAvatar();
        if (!newAvatarUrl) return;
      }
      
      // Update profile
      await updateProfile({
        username,
        avatar_url: newAvatarUrl,
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
      
      <main className="mt-8">
        <PixelContainer className="w-full max-w-2xl mx-auto mb-8">
          <RetroText glowing className="text-2xl mb-6 text-terminal-purple">
            {'>'} YOUR PROFILE
          </RetroText>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <RetroText className="mb-2 text-terminal-cyan">{'>'} USERNAME</RetroText>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-terminal-darkgray text-terminal-green border-2 border-terminal-purple p-2 font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple"
                disabled={isSaving}
              />
            </div>
            
            <div>
              <RetroText className="mb-2 text-terminal-cyan">{'>'} AVATAR</RetroText>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 border-2 border-terminal-purple flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <RetroText className="text-terminal-purple/50">No Avatar</RetroText>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <RetroButton type="button" className="text-sm">
                      {avatarUrl ? 'Change Avatar' : 'Upload Avatar'}
                    </RetroButton>
                    <input
                      type="file"
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                      disabled={isSaving || isUploading}
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <RetroButton type="submit" disabled={isSaving || isUploading}>
                {isSaving ? 'SAVING...' : 'SAVE PROFILE'}
              </RetroButton>
              
              <RetroButton 
                type="button"
                onClick={handleSignOut}
                className="bg-terminal-darkgray border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]"
              >
                LOGOUT
              </RetroButton>
            </div>
          </form>
        </PixelContainer>
        
        <PixelContainer className="w-full max-w-2xl mx-auto">
          <RetroText glowing className="text-2xl mb-6 text-terminal-purple">
            {'>'} YOUR CONFESSIONS
          </RetroText>
          
          {isLoadingConfessions ? (
            <div className="py-10 text-center">
              <RetroText className="text-terminal-green animate-pulse">Loading your confessions...</RetroText>
            </div>
          ) : userConfessions.length === 0 ? (
            <div className="py-10 text-center">
              <RetroText className="text-terminal-purple/60">You haven't made any confessions yet.</RetroText>
              <RetroButton 
                className="mt-4"
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
        </PixelContainer>
      </main>
    </div>
  );
};

export default Profile;
