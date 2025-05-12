
import React from 'react';
import { Skull } from "lucide-react";
import { cn } from "@/lib/utils";

interface DegenRatingProps {
  rating: number;
  maxRating?: number;
  onChange?: (rating: number) => void;
  className?: string;
  readOnly?: boolean;
}

const DegenRating = ({ 
  rating, 
  maxRating = 5, 
  onChange,
  className,
  readOnly = false
}: DegenRatingProps) => {
  return (
    <div className={cn("degen-meter", className)}>
      {Array.from({ length: maxRating }).map((_, index) => (
        <Skull 
          key={index} 
          size={24} 
          className={cn(
            "skull transition-all",
            index < rating ? "active" : "",
            !readOnly && "cursor-pointer hover:text-terminal-purple/70"
          )}
          onClick={() => {
            if (!readOnly && onChange) {
              onChange(index + 1);
            }
          }}
        />
      ))}
    </div>
  );
};

export default DegenRating;
