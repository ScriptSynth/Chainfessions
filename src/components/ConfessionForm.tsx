
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import PixelContainer from './PixelContainer';
import RetroText from './RetroText';
import RetroButton from './RetroButton';
import { Upload, ImageIcon, X } from 'lucide-react';
import { Button } from "./ui/button";

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
      degenRating: 1 // Add default degenRating to fix the null constraint issue
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
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-terminal-purple/10 to-terminal-darkgray p-6 rounded-lg shadow-xl backdrop-blur-sm border border-terminal-purple/30">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl mb-4 text-white font-bold flex items-center">
            <span className="bg-terminal-purple text-white px-3 py-1 rounded mr-2">NEW</span> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-terminal-purple to-terminal-cyan">CONFESSION</span>
          </h2>
          
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full h-40 bg-terminal-darkgray/80 text-terminal-green border border-terminal-purple/50 p-4 rounded-md font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple transition-all shadow-inner"
            placeholder="I panic sold at the bottom and told everyone I diamond handed..."
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label className="block mb-2 text-terminal-cyan font-medium">SELECT CHAIN</label>
          <select
            value={formData.chain}
            onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
            className="w-full bg-terminal-darkgray/80 text-terminal-green border border-terminal-purple/50 p-3 rounded-md font-vt323 text-lg focus:outline-none focus:ring-2 focus:ring-terminal-purple transition-all"
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
          <label className="block mb-2 text-terminal-cyan font-medium">ATTACH MEDIA (OPTIONAL)</label>
          
          {mediaPreview ? (
            <div className="relative border border-terminal-purple/50 rounded-md p-2 mb-4 bg-terminal-darkgray/40">
              <img src={mediaPreview} alt="Preview" className="max-h-64 mx-auto rounded" />
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-terminal-purple text-white p-1 rounded-full hover:bg-terminal-purple/80 transition-colors"
                disabled={isSubmitting}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-terminal-purple/50 bg-terminal-darkgray/40 rounded-md cursor-pointer hover:bg-terminal-darkgray/60 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-10 h-10 mb-3 text-terminal-purple" />
                <p className="mb-2 text-sm text-terminal-purple"><span className="font-semibold">Click to upload</span> image or GIF</p>
                <p className="text-xs text-terminal-purple/60">PNG, JPG, WEBP or GIF (MAX. 5MB)</p>
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
        
        <div>
          <Button
            type="submit"
            disabled={isSubmitting || !user}
            className="w-full bg-gradient-to-r from-terminal-purple to-terminal-cyan hover:opacity-90 text-white font-bold py-3 px-8 rounded-md transition-all shadow-lg hover:shadow-terminal-purple/30 hover:translate-y-[-2px]"
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT CONFESSION'}
          </Button>
        </div>
        
        {!user && (
          <div className="mt-2 p-4 bg-terminal-purple/10 border-l-4 border-terminal-purple rounded">
            <p className="text-terminal-purple">
              Please <a href="/auth" className="underline font-medium">sign in</a> to submit your confession
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ConfessionForm;
