
import React from 'react';
import { cn } from "@/lib/utils";

interface RetroTextProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
  typewriter?: boolean;
}

const RetroText = ({ 
  children, 
  className, 
  glowing = false,
  typewriter = false
}: RetroTextProps) => {
  return (
    <div 
      className={cn(
        "font-vt323", 
        glowing && "glow-text",
        typewriter && "typewriter-text",
        className
      )}
    >
      {children}
    </div>
  );
};

export default RetroText;
