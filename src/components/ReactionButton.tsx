
import React from 'react';
import { cn } from "@/lib/utils";
import { Laugh, Flame, Skull, Flag, MessageSquare } from "lucide-react";
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
  
  // Define icon colors based on type
  const getIconColor = () => {
    switch (type) {
      case 'laugh':
        return 'text-yellow-400';
      case 'fire':
        return 'text-orange-500';
      case 'skull':
        return 'text-gray-200';
      case 'flag':
        return 'text-red-500';
      case 'reply':
        return 'text-blue-400';
      default:
        return 'text-terminal-purple/70';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'laugh':
        return <Laugh size={18} className={active ? "text-yellow-500" : "text-yellow-400"} />;
      case 'fire':
        return <Flame size={18} className={active ? "text-orange-600" : "text-orange-500"} />;
      case 'skull':
        return <Skull size={18} className={active ? "text-white" : "text-gray-200"} />;
      case 'flag':
        return <Flag size={18} className={active ? "text-red-600" : "text-red-500"} />;
      case 'reply':
        return <MessageSquare size={18} className={active ? "text-blue-500" : "text-blue-400"} />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "reaction-button flex items-center gap-1 px-2 py-1 rounded-md transition-all hover:bg-terminal-purple/10",
        active && "bg-terminal-purple/5",
        className,
        "animate-hover-scale"
      )}
      aria-label={`${type} reaction`}
    >
      {getIcon()}
      <span className="text-xs font-vt323 text-terminal-green">{count}</span>
    </button>
  );
};

export default ReactionButton;
