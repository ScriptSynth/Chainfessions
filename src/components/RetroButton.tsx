
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
      className={cn("retro-button", className)}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default RetroButton;
