
import React, { useState, useEffect } from 'react';
import { Confession } from './ConfessionForm';
import PixelContainer from './PixelContainer';
import RetroText from './RetroText';
import DegenRating from './DegenRating';
import ReactionButton from './ReactionButton';
import ReplyForm from './ReplyForm';
import { 
  addReaction,
  getReactions,
  getReplies, 
  getConfessionMedia,
  ReactionType, 
  Reaction, 
  Reply,
  Media
} from '@/services/confessionService';
import { useToast } from "@/hooks/use-toast";

interface ConfessionCardProps {
  confession: Confession;
  isRandom?: boolean;
}

const getChainIcon = (chain: string) => {
  switch (chain.toLowerCase()) {
    case 'eth':
      return '🟣';
    case 'sol':
      return '🔵';
    case 'bnb':
      return '🟡';
    case 'avax':
      return '🔴';
    case 'arb':
      return '🔵';
    case 'op':
      return '🔴';
    default:
      return '⚪';
  }
};

const getChainName = (chain: string) => {
  switch (chain.toLowerCase()) {
    case 'eth':
      return 'Ethereum';
    case 'sol':
      return 'Solana';
    case 'bnb':
      return 'Binance';
    case 'avax':
      return 'Avalanche';
    case 'arb':
      return 'Arbitrum';
    case 'op':
      return 'Optimism';
    default:
      return 'Other Chain';
  }
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toUTCString();
};

const ConfessionCard = ({ confession, isRandom = false }: ConfessionCardProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLoadingReactions, setIsLoadingReactions] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [media, setMedia] = useState<Media | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isRandom) {
      loadReactions();
      loadMedia();
    }
  }, [confession.id, isRandom]);

  const loadReactions = async () => {
    setIsLoadingReactions(true);
    try {
      const data = await getReactions(confession.id);
      setReactions(data);
    } catch (error) {
      console.error('Error loading reactions:', error);
    } finally {
      setIsLoadingReactions(false);
    }
  };

  const loadMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const media = await getConfessionMedia(confession.id);
      setMedia(media);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const loadReplies = async () => {
    if (replies.length > 0) return;
    
    setIsLoadingReplies(true);
    try {
      const data = await getReplies(confession.id);
      setReplies(data);
    } catch (error) {
      console.error('Error loading replies:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleReaction = async (type: ReactionType) => {
    try {
      const reaction = await addReaction(confession.id, type);
      if (reaction) {
        setReactions(prev => [...prev, reaction]);
        toast({
          title: "Reaction added",
          description: "Your reaction has been added!",
        });
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add your reaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShowReplies = () => {
    setShowReplies(true);
    loadReplies();
  };

  const getReactionCount = (type: ReactionType) => {
    return reactions.filter(r => r.reactionType === type).length;
  };

  const handleReplyAdded = async () => {
    await loadReplies();
  };

  const isMediaImage = (mediaType?: string) => {
    return mediaType?.startsWith('image/');
  };

  return (
    <PixelContainer 
      className={`w-full mb-4 transition-all ${isRandom ? 'animate-glitch' : 'hover:scale-[1.01]'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getChainIcon(confession.chain)}</span>
          <RetroText className="text-terminal-cyan">
            {getChainName(confession.chain)}
          </RetroText>
        </div>
        
        <DegenRating rating={confession.degenRating} readOnly />
      </div>
      
      <RetroText className={`my-4 text-xl ${isRandom ? 'typewriter-text' : ''}`}>
        {confession.text}
      </RetroText>
      
      {!isLoadingMedia && media && isMediaImage(media.mediaType) && (
        <div className="mt-4 mb-4 border-2 border-terminal-purple p-2 bg-terminal-darkgray/30">
          <img 
            src={media.mediaUrl} 
            alt="Confession media" 
            className="max-h-80 mx-auto"
            loading="lazy"
          />
        </div>
      )}
      
      {!isRandom && (
        <div className="mt-6 border-t border-terminal-purple/20 pt-3">
          <div className="flex flex-wrap gap-2">
            <ReactionButton 
              type="laugh" 
              count={getReactionCount('laugh')} 
              onClick={() => handleReaction('laugh')} 
            />
            <ReactionButton 
              type="fire" 
              count={getReactionCount('fire')} 
              onClick={() => handleReaction('fire')} 
            />
            <ReactionButton 
              type="skull" 
              count={getReactionCount('skull')} 
              onClick={() => handleReaction('skull')} 
            />
            <ReactionButton 
              type="flag" 
              count={getReactionCount('flag')} 
              onClick={() => handleReaction('flag')} 
            />
            <ReactionButton 
              type="reply" 
              count={replies.length} 
              onClick={() => {
                if (!showReplies) {
                  handleShowReplies();
                }
                setShowReplyForm(!showReplyForm);
              }}
              active={showReplyForm}
            />
          </div>
        </div>
      )}
      
      {showReplies && (
        <div className="mt-4 border-t border-terminal-purple/20 pt-3">
          <RetroText className="text-terminal-purple mb-2">Hot Takes</RetroText>
          
          {isLoadingReplies ? (
            <div className="py-4 text-center">
              <RetroText className="text-terminal-green animate-pulse">Loading replies...</RetroText>
            </div>
          ) : replies.length === 0 ? (
            <RetroText className="text-terminal-purple/50 text-sm">No replies yet. Be the first!</RetroText>
          ) : (
            <div className="space-y-3">
              {replies.map(reply => (
                <div key={reply.id} className="px-3 py-2 bg-terminal-purple/5 rounded border-l-2 border-terminal-purple">
                  <RetroText className="text-terminal-green">
                    {reply.text}
                  </RetroText>
                  <div className="text-right mt-1">
                    <RetroText className="text-terminal-purple/40 text-xs">
                      {new Date(reply.createdAt).toLocaleTimeString()}
                    </RetroText>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {showReplyForm && (
        <div className="mt-3 animate-fade-in">
          <ReplyForm confessionId={confession.id} onReplyAdded={handleReplyAdded} />
        </div>
      )}
      
      <div className="text-right mt-4">
        <RetroText className="text-terminal-purple/60 text-sm">
          {formatDate(confession.timestamp)}
        </RetroText>
      </div>
    </PixelContainer>
  );
};

export default ConfessionCard;
