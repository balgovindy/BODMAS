
import { BgStyle, Difficulty, Platform, LogoPosition, FoodType } from './types';

export const FONTS = [
  { name: 'Poppins', family: "'Poppins', sans-serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
  { name: 'Bebas Neue', family: "'Bebas Neue', cursive" },
  { name: 'Anton', family: "'Anton', sans-serif" },
  { name: 'Comic Neue', family: "'Comic Neue', cursive" },
  { name: 'Fredoka', family: "'Fredoka', sans-serif" },
  { name: 'Luckiest Guy', family: "'Luckiest Guy', cursive" },
  { name: 'Pacifico', family: "'Pacifico', cursive" },
  { name: 'Lobster', family: "'Lobster', cursive" },
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Zeyada', family: "'Zeyada', cursive" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Playfair Display', family: "'Playfair Display', serif" },
  { name: 'Digital', family: "'Roboto Mono', monospace" }
];

export const HEADLINES = [
  "🧠 Can You Solve This?",
  "Only 1% Get This Right!",
  "BODMAS Challenge 🔥",
  "Math Genius Test ⚡",
  "Tricky Math Quiz 🧪"
];

// Provide multiple variants for each food type
export const FOOD_IMAGES: Record<FoodType, string[]> = {
  [FoodType.VEG]: [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"
  ],
  [FoodType.MEAL]: [
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
  ],
  [FoodType.DESSERT]: [
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80"
  ],
  [FoodType.SNACKS]: [
    "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80"
  ]
};

export const BG_PRESETS: Record<BgStyle, { colors: string[], class: string }> = {
  [BgStyle.GRADIENT]: { 
    colors: ['#4f46e5', '#9333ea'], 
    class: 'bg-gradient-to-br from-indigo-600 to-purple-600' 
  },
  [BgStyle.CHALKBOARD]: { 
    colors: ['#1e293b'], 
    class: 'bg-[#1a2e26] relative overflow-hidden before:content-[""] before:absolute before:inset-0 before:opacity-10 before:bg-[url("https://www.transparenttextures.com/patterns/chalkboard.png")]' 
  },
  [BgStyle.NEON]: { 
    colors: ['#000000'], 
    class: 'bg-black border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]' 
  },
  [BgStyle.MINIMAL]: { 
    colors: ['#ffffff'], 
    class: 'bg-white' 
  },
  [BgStyle.VIBRANT]: { 
    colors: ['#f59e0b', '#ef4444'], 
    class: 'bg-gradient-to-tr from-orange-400 to-red-500' 
  },
  [BgStyle.CUSTOM]: {
    colors: [],
    class: '' 
  },
  [BgStyle.FOOD]: {
    colors: [],
    class: 'bg-cover bg-center'
  }
};
