
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

export async function addConfession(confession: Omit<Confession, 'id' | 'timestamp'>): Promise<Confession | null> {
  const { data, error } = await supabase
    .from('confessions')
    .insert({
      text: confession.text,
      chain: confession.chain,
      degen_rating: confession.degenRating
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding confession:', error);
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

// Reaction functions
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
