
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import PixelContainer from './PixelContainer';
import RetroText from './RetroText';
import RetroButton from './RetroButton';

const chainOptions = [
  { value: "eth", label: "Ethereum" },
  { value: "sol", label: "Solana" },
  { value: "bnb", label: "Binance" },
  { value: "avax", label: "Avalanche" },
  { value: "arb", label: "Arbitrum" },
  { value: "op", label: "Optimism" },
  { value: "other", label: "Other Chain" },
];

interface ConfessionFormProps {
  onSubmitConfession: (confession: Omit<Confession, 'id' | 'timestamp'>) => void;
}

export interface Confession {
  id: string;
  text: string;
  chain: string;
  degenRating: number; // Keeping this in the interface for compatibility
  timestamp: number;
}

const ConfessionForm = ({ onSubmitConfession }: ConfessionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    text: "",
    chain: "eth"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.text.trim().length < 10) {
      toast({
        title: "Confession too short",
        description: "Your confession needs to be at least 10 characters. Don't be shy!",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const newConfession = {
      text: formData.text,
      chain: formData.chain,
      degenRating: 3 // Default value
    };
    
    try {
      onSubmitConfession(newConfession);
      
      // Reset form
      setFormData({
        text: "",
        chain: "eth"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit confession. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      text: "",
      chain: "eth"
    });
  };

  return (
    <PixelContainer className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <RetroText glowing className="text-2xl mb-2 text-terminal-purple">
            {'>'} NEW CONFESSION
          </RetroText>
          
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full h-40 bg-terminal-darkgray text-terminal-green border-2 border-terminal-purple p-3 font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple"
            placeholder="I panic sold at the bottom and told everyone I diamond handed..."
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <RetroText className="mb-2 text-terminal-cyan">{'>'} SELECT CHAIN</RetroText>
          <select
            value={formData.chain}
            onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
            className="w-full bg-terminal-darkgray text-terminal-green border-2 border-terminal-purple p-2 font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple"
            disabled={isSubmitting}
          >
            {chainOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-4">
          <RetroButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'SUBMITTING...' : 'Submit Confession'}
          </RetroButton>
          
          <RetroButton 
            onClick={handleReset} 
            className="bg-terminal-darkgray border-terminal-lightpurple shadow-[4px_4px_0px_0px_rgba(126,105,171,1)] hover:shadow-[2px_2px_0px_0px_rgba(126,105,171,1)]"
            disabled={isSubmitting}
          >
            Confess Again
          </RetroButton>
        </div>
      </form>
    </PixelContainer>
  );
};

export default ConfessionForm;
