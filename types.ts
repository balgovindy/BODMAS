
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  TRICKY = 'Tricky',
  ULTRA_TRICKY = 'Ultra-Tricky (Viral)'
}

export enum Platform {
  SQUARE = '1:1 (Post)',
  PORTRAIT = '9:16 (Reel/Shorts)'
}

export enum BgStyle {
  GRADIENT = 'Gradient',
  CHALKBOARD = 'Chalkboard',
  NEON = 'Neon Glow',
  MINIMAL = 'Minimal White',
  VIBRANT = 'Vibrant Pattern',
  CUSTOM = 'Custom Color',
  FOOD = 'Food Background'
}

export enum FoodType {
  VEG = 'Veg',
  MEAL = 'Starter + Main Course',
  DESSERT = 'Dessert',
  SNACKS = 'Snacks'
}

export enum LogoPosition {
  TOP_LEFT = 'Top-Left',
  TOP_RIGHT = 'Top-Right',
  BOTTOM_RIGHT = 'Bottom-Right'
}

export enum RankPosition {
  TOP_LEFT = 'Top-Left',
  TOP_RIGHT = 'Top-Right',
  BOTTOM_LEFT = 'Bottom-Left',
  CENTER_RIGHT = 'Center-Right'
}

export type ContainerStyle = 'none' | 'ribbon' | 'badge' | 'glass' | 'minimal';

export interface AppState {
  question: string;
  answer: number;
  difficulty: Difficulty;
  platform: Platform;
  
  // Advanced Math
  useFactorials: boolean;
  useExponents: boolean;
  useFractions: boolean;

  // Typography
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  letterSpacing: number;
  lineSpacing: number;
  fontColor: string;
  autoColor: boolean;

  // Header
  headerEnabled: boolean;
  headerText: string;
  headerFont: string;
  headerStyle: 'ribbon' | 'badge' | 'glow' | 'minimal';

  // Question Styling
  questionBgStyle: ContainerStyle;
  questionPaddingX: number;
  questionPaddingY: number;
  questionYOffset: number;
  questionBorderRadius: number;

  // Background
  bgStyle: BgStyle;
  bgColors: string[];
  customBgColor: string;
  foodType: FoodType;
  foodVariant: number; // For shuffling food images
  
  // Brand
  logoUrl: string | null;
  logoPosition: LogoPosition;

  // Viral Boosters
  showGlow: boolean;
  showShadow: boolean;
  showCommentFooter: boolean;
  showRankBadge: boolean;
  rankPosition: RankPosition;

  // Watermark
  showWatermark: boolean;
  watermarkText: string;
  watermarkAlign: 'left' | 'center' | 'right';
  watermarkOffset: number;
}

export interface ViralityAnalysis {
  score: number;
  suggestion: string;
  bestHeadline: string;
}
