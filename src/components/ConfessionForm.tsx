
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import PixelContainer from './PixelContainer';
import RetroText from './RetroText';
import RetroButton from './RetroButton';
import { Upload, ImageIcon, X } from 'lucide-react';

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
  onSubmitConfession: (confession: Omit<Confession, 'id' | 'timestamp'>, mediaFile?: File) => void;
}

export interface Confession {
  id: string;
  text: string;
  chain: string;
  degenRating?: number;
  timestamp: number;
}

const ConfessionForm = ({ onSubmitConfession }: ConfessionFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    text: "",
    chain: "eth"
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
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

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a confession",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const newConfession = {
      text: formData.text,
      chain: formData.chain,
    };
    
    try {
      onSubmitConfession(newConfession, mediaFile || undefined);
      
      // Reset form
      setFormData({
        text: "",
        chain: "eth"
      });
      setMediaFile(null);
      setMediaPreview(null);
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
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Media files should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type (only images and GIFs)
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        toast({
          title: "Invalid file type",
          description: "Only images (JPG, PNG, WebP) and GIFs are supported",
          variant: "destructive"
        });
        return;
      }
      
      setMediaFile(file);
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
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
        
        <div>
          <RetroText className="mb-2 text-terminal-cyan">{'>'} ATTACH MEDIA (OPTIONAL)</RetroText>
          
          {mediaPreview ? (
            <div className="relative border-2 border-terminal-purple p-2 mb-4">
              <img src={mediaPreview} alt="Preview" className="max-h-64 mx-auto" />
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-terminal-purple text-terminal-black p-1 rounded-full"
                disabled={isSubmitting}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-terminal-purple bg-terminal-darkgray rounded-lg cursor-pointer hover:bg-terminal-purple/10">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-10 h-10 mb-3 text-terminal-purple" />
                <RetroText className="mb-2 text-sm text-terminal-purple"><span className="font-semibold">Click to upload</span> image or GIF</RetroText>
                <RetroText className="text-xs text-terminal-purple/60">PNG, JPG, WEBP or GIF (MAX. 5MB)</RetroText>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/jpeg,image/png,image/gif,image/webp" 
                onChange={handleMediaChange}
                disabled={isSubmitting}
              />
            </label>
          )}
        </div>
        
        <div className="flex gap-4">
          <RetroButton type="submit" disabled={isSubmitting || !user}>
            {isSubmitting ? 'SUBMITTING...' : 'Submit Confession'}
          </RetroButton>
          
          <RetroButton 
            onClick={handleReset} 
            className="bg-terminal-darkgray border-terminal-lightpurple shadow-[4px_4px_0px_0px_rgba(126,105,171,1)] hover:shadow-[2px_2px_0px_0px_rgba(126,105,171,1)]"
            disabled={isSubmitting}
            type="button"
          >
            Confess Again
          </RetroButton>
        </div>
        
        {!user && (
          <div className="mt-2 p-3 bg-terminal-purple/10 border-l-2 border-terminal-purple">
            <RetroText className="text-terminal-purple">
              Please <a href="/auth" className="underline">sign in</a> to submit your confession
            </RetroText>
          </div>
        )}
      </form>
    </PixelContainer>
  );
};

export default ConfessionForm;
