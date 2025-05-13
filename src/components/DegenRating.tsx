
import React, { useState, useEffect } from 'react';
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
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleRatingClick = (selectedRating: number) => {
    if (!readOnly && !disabled && onChange) {
      onChange(selectedRating);
    }
  };

  return (
    <div className={cn("degen-meter flex items-center", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const skullRating = index + 1; // Convert to 1-based rating
        const isActive = skullRating <= (hoverRating || rating);
        
        return (
          <Skull 
            key={index} 
            size={24} 
            className={cn(
              "skull transition-all mr-1 cursor-pointer",
              isActive ? "text-terminal-green" : "text-terminal-gray",
              !readOnly && !disabled && "hover:scale-110 hover:animate-pulse",
              disabled && "opacity-50",
              "animate-hover-scale"
            )}
            onClick={() => handleRatingClick(skullRating)}
            onMouseEnter={() => {
              if (!readOnly && !disabled) {
                setHoverRating(skullRating);
              }
            }}
            onMouseLeave={() => {
              if (!readOnly && !disabled) {
                setHoverRating(0);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default DegenRating;
