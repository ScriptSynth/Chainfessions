
import { supabase } from "@/integrations/supabase/client";
import { Confession } from "@/components/ConfessionForm";

export type ReactionType = 'laugh' | 'fire' | 'skull' | 'flag';

export interface Reaction {
  id: string;
  confessionId: string;
  reactionType: ReactionType;
  createdAt: number;
}

export interface Reply {
  id: string;
  confessionId: string;
  text: string;
  createdAt: number;
}

export interface Media {
  id: string;
  confessionId: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: number;
}

// Local storage key for tracking user reactions
const REACTIONS_STORAGE_KEY = 'user_reactions';

// Helper to get user's reactions from local storage
const getUserReactions = (): Record<string, ReactionType[]> => {
  try {
    const stored = localStorage.getItem(REACTIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading user reactions from local storage:', error);
    return {};
  }
};

// Helper to save user reactions to local storage
const saveUserReaction = (confessionId: string, reactionType: ReactionType): void => {
  try {
    const userReactions = getUserReactions();
    
    if (!userReactions[confessionId]) {
      userReactions[confessionId] = [];
    }
    
    // Only add if not already reacted with this type
    if (!userReactions[confessionId].includes(reactionType)) {
      userReactions[confessionId].push(reactionType);
      localStorage.setItem(REACTIONS_STORAGE_KEY, JSON.stringify(userReactions));
    }
  } catch (error) {
    console.error('Error saving user reaction to local storage:', error);
  }
};

// Helper to check if user already reacted
export const hasUserReacted = (confessionId: string, reactionType: ReactionType): boolean => {
  try {
    const userReactions = getUserReactions();
    return userReactions[confessionId]?.includes(reactionType) || false;
  } catch (error) {
    console.error('Error checking user reaction:', error);
    return false;
  }
};

export async function getConfessions(): Promise<Confession[]> {
  const { data, error } = await supabase
    .from('confessions')
    .select('*')
    .order('timestamp', { ascending: false });
    
  if (error) {
    console.error('Error fetching confessions:', error);
    return [];
  }
  
  return data.map(item => ({
    id: item.id,
    text: item.text,
    chain: item.chain,
    degenRating: item.degen_rating,
    timestamp: new Date(item.timestamp).getTime()
  }));
}

export async function uploadMedia(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `media/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('confession-media')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('confession-media')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading media:', error);
    return null;
  }
}

export async function addConfession(
  confession: Omit<Confession, 'id' | 'timestamp'>, 
  userId: string,
  mediaFile?: File
): Promise<Confession | null> {
  try {
    // First, upload media if provided
    let mediaUrl = null;
    if (mediaFile) {
      mediaUrl = await uploadMedia(mediaFile, userId);
    }
    
    // Insert confession
    const { data, error } = await supabase
      .from('confessions')
      .insert({
        text: confession.text,
        chain: confession.chain,
        degen_rating: confession.degenRating,
        user_id: userId
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding confession:', error);
      return null;
    }
    
    // If media was uploaded, link it to the confession
    if (mediaUrl && data.id) {
      const mediaType = mediaFile!.type;
      await supabase
        .from('media')
        .insert({
          confession_id: data.id,
          media_url: mediaUrl,
          media_type: mediaType
        });
    }
    
    return {
      id: data.id,
      text: data.text,
      chain: data.chain,
      degenRating: data.degen_rating,
      timestamp: new Date(data.timestamp).getTime()
    };
  } catch (error) {
    console.error('Error in addConfession:', error);
    return null;
  }
}

export async function getRandomConfession(): Promise<Confession | null> {
  // Get the count of confessions
  const { count, error: countError } = await supabase
    .from('confessions')
    .select('*', { count: 'exact', head: true });
    
  if (countError || !count) {
    console.error('Error getting confession count:', countError);
    return null;
  }
  
  // Get a random offset
  const randomOffset = Math.floor(Math.random() * count);
  
  // Get the confession at the random offset
  const { data, error } = await supabase
    .from('confessions')
    .select('*')
    .range(randomOffset, randomOffset)
    .single();
    
  if (error) {
    console.error('Error fetching random confession:', error);
    return null;
  }
  
  return {
    id: data.id,
    text: data.text,
    chain: data.chain,
    degenRating: data.degen_rating,
    timestamp: new Date(data.timestamp).getTime()
  };
}

// Media functions
export async function getConfessionMedia(confessionId: string): Promise<Media | null> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('confession_id', confessionId)
    .single();
    
  if (error) {
    // No media found is a normal case
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching media:', error);
    return null;
  }
  
  return {
    id: data.id,
    confessionId: data.confession_id,
    mediaUrl: data.media_url,
    mediaType: data.media_type,
    createdAt: new Date(data.created_at).getTime()
  };
}

// Updated reaction functions
export async function getReactions(confessionId: string): Promise<Reaction[]> {
  const { data, error } = await supabase
    .from('reactions')
    .select('*')
    .eq('confession_id', confessionId);
    
  if (error) {
    console.error('Error fetching reactions:', error);
    return [];
  }
  
  return data.map(item => ({
    id: item.id,
    confessionId: item.confession_id,
    reactionType: item.reaction_type as ReactionType,
    createdAt: new Date(item.created_at).getTime()
  }));
}

export async function addReaction(confessionId: string, reactionType: ReactionType): Promise<Reaction | null> {
  // Check if user already reacted with this type
  if (hasUserReacted(confessionId, reactionType)) {
    console.log('User already reacted with this type:', reactionType);
    return null;
  }
  
  const { data, error } = await supabase
    .from('reactions')
    .insert({
      confession_id: confessionId,
      reaction_type: reactionType
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding reaction:', error);
    return null;
  }
  
  // Save to local storage to prevent duplicate reactions
  saveUserReaction(confessionId, reactionType);
  
  return {
    id: data.id,
    confessionId: data.confession_id,
    reactionType: data.reaction_type as ReactionType,
    createdAt: new Date(data.created_at).getTime()
  };
}

// Reply functions
export async function getReplies(confessionId: string): Promise<Reply[]> {
  const { data, error } = await supabase
    .from('replies')
    .select('*')
    .eq('confession_id', confessionId)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching replies:', error);
    return [];
  }
  
  return data.map(item => ({
    id: item.id,
    confessionId: item.confession_id,
    text: item.text,
    createdAt: new Date(item.created_at).getTime()
  }));
}

export async function addReply(confessionId: string, text: string): Promise<Reply | null> {
  const { data, error } = await supabase
    .from('replies')
    .insert({
      confession_id: confessionId,
      text: text
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding reply:', error);
    return null;
  }
  
  return {
    id: data.id,
    confessionId: data.confession_id,
    text: data.text,
    createdAt: new Date(data.created_at).getTime()
  };
}
