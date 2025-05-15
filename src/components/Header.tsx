
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RetroText from './RetroText';
import RetroButton from './RetroButton';

const Header = () => {
  const { user } = useAuth();
  
  return (
    <header className="flex flex-col md:flex-row items-center justify-between">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <Link to="/">
          <RetroText glowing className="text-5xl text-terminal-purple">
            CHAINFESSIONS
          </RetroText>
        </Link>
        <RetroText className="mt-2 text-terminal-cyan">
          Confess your crypto sins, anon
        </RetroText>
      </div>
      
      <div className="flex space-x-4 items-center">
        {user ? (
          <Link to="/profile">
            <RetroButton>
              MY PROFILE
            </RetroButton>
          </Link>
        ) : (
          <Link to="/auth">
            <RetroButton>
              LOGIN / REGISTER
            </RetroButton>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
