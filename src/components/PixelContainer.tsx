
import React from 'react';
import { cn } from "@/lib/utils";

interface PixelContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PixelContainer = ({ children, className }: PixelContainerProps) => {
  return (
    <div className={cn("terminal-window border-terminal-purple bg-terminal-black/90 relative", className)}>
      {/* Terminal header decoration */}
      <div className="absolute -top-3 left-4 right-4 h-2 flex items-center">
        <div className="h-3 w-3 rounded-full bg-terminal-purple mr-2 animate-pulse"></div>
        <div className="h-3 w-3 rounded-full bg-terminal-cyan mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-terminal-green"></div>
      </div>
      
      {/* Simulated scan line effect container */}
      <div className="overflow-hidden relative z-0">
        {/* Container content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none bg-scanline z-0"></div>
      </div>
      
      {/* Corner markers for cyberpunk style */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-terminal-purple opacity-80"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-terminal-purple opacity-80"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-terminal-purple opacity-80"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-terminal-purple opacity-80"></div>
    </div>
  );
};

export default PixelContainer;
