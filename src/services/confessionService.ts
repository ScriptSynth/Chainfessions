
import { supabase } from "@/integrations/supabase/client";
import { Confession } from "@/components/ConfessionForm";

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
