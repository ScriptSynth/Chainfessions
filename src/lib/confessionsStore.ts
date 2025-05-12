
import { Confession } from "@/components/ConfessionForm";

// Local storage key for storing confessions
const STORAGE_KEY = 'chainfessions';

// Sample confessions for initial content
const sampleConfessions: Confession[] = [
  {
    id: '1',
    text: "I put my life savings into a memecoin because a TikTok influencer told me to. Now I eat ramen every day.",
    chain: "eth",
    degenRating: 5,
    timestamp: Date.now() - 86400000 * 2 // 2 days ago
  },
  {
    id: '2',
    text: "I told everyone I was diamond hands during the crash, but secretly sold everything and bought back lower.",
    chain: "sol",
    degenRating: 3,
    timestamp: Date.now() - 86400000 // 1 day ago
  },
  {
    id: '3',
    text: "I spent $500 on gas fees trying to mint an NFT that turned out to be worthless.",
    chain: "eth",
    degenRating: 4,
    timestamp: Date.now() - 43200000 // 12 hours ago
  }
];

export const loadConfessions = (): Confession[] => {
  if (typeof window === 'undefined') return sampleConfessions;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with sample data if nothing exists
    saveConfessions(sampleConfessions);
    return sampleConfessions;
  } catch (error) {
    console.error('Error loading confessions:', error);
    return sampleConfessions;
  }
};

export const saveConfessions = (confessions: Confession[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(confessions));
  } catch (error) {
    console.error('Error saving confessions:', error);
  }
};

export const addConfession = (confession: Confession): Confession[] => {
  const current = loadConfessions();
  const updated = [confession, ...current];
  saveConfessions(updated);
  return updated;
};
