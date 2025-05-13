
import React from 'react';
import { Skull } from "lucide-react";
import { cn } from "@/lib/utils";

interface DegenRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  readOnly?: boolean;
}

const DegenRating = ({ 
  rating, 
  maxRating = 5, 
  className,
  readOnly = false
}: DegenRatingProps) => {
  return (
    <div className={cn("degen-meter flex items-center", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const skullRating = index + 1;
        const isActive = skullRating <= rating;
        
        return (
          <Skull 
            key={index} 
            size={24} 
            className={cn(
              "skull mr-1",
              isActive ? "text-terminal-green" : "text-terminal-gray"
            )}
          />
        );
      })}
    </div>
  );
};

export default DegenRating;
