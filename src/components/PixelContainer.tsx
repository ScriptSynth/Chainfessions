
import React from 'react';
import { cn } from "@/lib/utils";

interface PixelContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PixelContainer = ({ children, className }: PixelContainerProps) => {
  return (
    <div className={cn("terminal-window", className)}>
      {children}
    </div>
  );
};

export default PixelContainer;
