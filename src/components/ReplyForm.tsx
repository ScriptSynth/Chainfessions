
import React, { useState } from 'react';
import { addReply } from '@/services/confessionService';
import RetroButton from './RetroButton';
import RetroText from './RetroText';
import { useToast } from "@/hooks/use-toast";

interface ReplyFormProps {
  confessionId: string;
  onReplyAdded: () => void;
}

const ReplyForm = ({ confessionId, onReplyAdded }: ReplyFormProps) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const reply = await addReply(confessionId, replyText);
      if (reply) {
        setReplyText('');
        onReplyAdded();
        toast({
          title: "Reply added",
          description: "Your hot take has been posted!",
        });
      } else {
        throw new Error('Failed to add reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post your reply. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Drop your hot take..."
          className="w-full h-20 rounded-md border border-terminal-purple/30 bg-black/20 p-2 text-terminal-green font-vt323 resize-none focus:outline-none focus:ring-1 focus:ring-terminal-purple"
          maxLength={200}
          disabled={isSubmitting}
        />
        <div className="absolute bottom-2 right-2 text-terminal-purple/50 text-xs font-vt323">
          {replyText.length}/200
        </div>
      </div>
      
      <div className="flex justify-end">
        <RetroButton 
          type="submit" 
          className="px-3 py-1 text-sm"
          disabled={isSubmitting || !replyText.trim()}
        >
          {isSubmitting ? (
            <RetroText className="animate-pulse">
              Posting...
            </RetroText>
          ) : (
            'Post Reply'
          )}
        </RetroButton>
      </div>
    </form>
  );
};

export default ReplyForm;
