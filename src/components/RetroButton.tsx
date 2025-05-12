
import React from 'react';
import { cn } from "@/lib/utils";

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const RetroButton = ({ 
  children, 
  onClick, 
  className,
  type = "button",
  disabled = false
}: RetroButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      className={cn("retro-button bg-terminal-purple text-white border-2 border-terminal-purple px-6 py-2 text-lg font-vt323 transition-all shadow-[4px_4px_0px_0px_rgba(139,92,246,1)] hover:shadow-[2px_2px_0px_0px_rgba(139,92,246,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]", className)}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default RetroButton;
