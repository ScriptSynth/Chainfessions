
import React from 'react';
import { cn } from "@/lib/utils";
import { Laugh, Fire, Skull, Flag, MessageSquare } from "lucide-react";
import { ReactionType } from '@/services/confessionService';

interface ReactionButtonProps {
  type: ReactionType | 'reply';
  count: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const ReactionButton = ({ 
  type, 
  count, 
  active = false, 
  onClick, 
  className 
}: ReactionButtonProps) => {
  const getIcon = () => {
    switch (type) {
      case 'laugh':
        return <Laugh size={18} />;
      case 'fire':
        return <Fire size={18} />;
      case 'skull':
        return <Skull size={18} />;
      case 'flag':
        return <Flag size={18} />;
      case 'reply':
        return <MessageSquare size={18} />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "reaction-button flex items-center gap-1 px-2 py-1 rounded-md transition-all text-terminal-purple/70 hover:bg-terminal-purple/10",
        active && "text-terminal-green bg-terminal-purple/5",
        className
      )}
      aria-label={`${type} reaction`}
    >
      {getIcon()}
      <span className="text-xs font-vt323">{count}</span>
    </button>
  );
};

export default ReactionButton;
