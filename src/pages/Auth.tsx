
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RetroText from '@/components/RetroText';
import RetroButton from '@/components/RetroButton';
import PixelContainer from '@/components/PixelContainer';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (activeTab === 'register') {
        if (password !== confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please ensure both passwords match",
            variant: "destructive",
          });
          return;
        }
        
        await signUp(email, password, username);
      } else {
        await signIn(email, password);
      }
      
      // Navigate to home on success
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <RetroText glowing className="text-5xl text-terminal-purple">
          CHAINFESSIONS
        </RetroText>
        <RetroText className="mt-2 text-terminal-cyan">
          Confess your crypto sins, anon
        </RetroText>
      </div>
      
      <PixelContainer className="w-full max-w-md mx-auto">
        <div className="flex border-b-2 border-terminal-purple mb-6">
          <button
            className={`px-6 py-3 ${
              activeTab === 'login'
                ? 'bg-terminal-purple/20 border-t-2 border-l-2 border-r-2 border-terminal-purple'
                : 'bg-transparent'
            }`}
            onClick={() => setActiveTab('login')}
          >
            <RetroText 
              className={`${
                activeTab === 'login' ? 'text-terminal-purple glow-text' : 'text-terminal-purple/50'
              }`}
            >
              {'>'} LOGIN
            </RetroText>
          </button>
          
          <button
            className={`px-6 py-3 ${
              activeTab === 'register'
                ? 'bg-terminal-purple/20 border-t-2 border-l-2 border-r-2 border-terminal-purple'
                : 'bg-transparent'
            }`}
            onClick={() => setActiveTab('register')}
          >
            <RetroText 
              className={`${
                activeTab === 'register' ? 'text-terminal-purple glow-text' : 'text-terminal-purple/50'
              }`}
            >
              {'>'} REGISTER
            </RetroText>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div>
              <RetroText className="mb-2 text-terminal-cyan">{'>'} USERNAME</RetroText>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-terminal-darkgray text-terminal-green border-2 border-terminal-purple p-2 font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple"
                placeholder="satoshi_nakamoto"
                disabled={loading}
              />
            </div>
          )}
          
          <div>
            <RetroText className="mb-2 text-terminal-cyan">{'>'} EMAIL</RetroText>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-terminal-darkgray text-terminal-green border-2 border-terminal-purple p-2 font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple"
              placeholder="anon@example.com"
              disabled={loading}
            />
          </div>
          
          <div>
            <RetroText className="mb-2 text-terminal-cyan">{'>'} PASSWORD</RetroText>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-terminal-darkgray text-terminal-green border-2 border-terminal-purple p-2 font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple"
              placeholder="••••••••••••"
              disabled={loading}
            />
          </div>
          
          {activeTab === 'register' && (
            <div>
              <RetroText className="mb-2 text-terminal-cyan">{'>'} CONFIRM PASSWORD</RetroText>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-terminal-darkgray text-terminal-green border-2 border-terminal-purple p-2 font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple"
                placeholder="••••••••••••"
                disabled={loading}
              />
            </div>
          )}
          
          <div className="pt-4">
            <RetroButton type="submit" disabled={loading} className="w-full">
              {loading ? 'PROCESSING...' : activeTab === 'login' ? 'LOGIN' : 'REGISTER'}
            </RetroButton>
          </div>
        </form>
      </PixelContainer>
      
      <div className="mt-8 text-center">
        <RetroText className="text-terminal-purple/70 text-sm">
          {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            className="text-terminal-cyan underline hover:text-terminal-cyan/80"
          >
            {activeTab === 'login' ? 'Register here' : 'Login here'}
          </button>
        </RetroText>
      </div>
    </div>
  );
};

export default Auth;
