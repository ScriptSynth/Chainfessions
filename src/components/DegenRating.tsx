
import React from 'react';
import { Skull } from "lucide-react";
import { cn } from "@/lib/utils";

interface DegenRatingProps {
  rating: number;
  maxRating?: number;
  onChange?: (rating: number) => void;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
}

const DegenRating = ({ 
  rating, 
  maxRating = 5, 
  onChange,
  className,
  readOnly = false,
  disabled = false
}: DegenRatingProps) => {
  return (
    <div className={cn("degen-meter flex", className)}>
      {Array.from({ length: maxRating }).map((_, index) => (
        <Skull 
          key={index} 
          size={24} 
          className={cn(
            "skull transition-all",
            index < rating ? "text-terminal-green" : "text-terminal-gray",
            !readOnly && !disabled && "cursor-pointer hover:text-terminal-purple/70",
            disabled && "opacity-50"
          )}
          onClick={() => {
            if (!readOnly && !disabled && onChange) {
              onChange(index + 1);
            }
          }}
        />
      ))}
    </div>
  );
};

export default DegenRating;
