export interface AdventureStage {
  id: string;
  name: string;
  description: string;
  background: string;
  music?: string;
  enemies: AIEnemy[];
  npcs: AINPC[];
  rewards: StageReward[];
  isCompleted: boolean;
  unlockRequirements?: string[];
}

export interface AIEnemy {
  id: string;
  name: string;
  description: string;
  avatar: string;
  level: number;
  shadows: AIShadow[];
  personality: string;
  battleDialogue: string[];
  defeatDialogue: string[];
  aiModel: 'openai' | 'gemini' | 'deepseek' | 'grok';
}

export interface AINPC {
  id: string;
  name: string;
  description: string;
  avatar: string;
  role: 'merchant' | 'trainer' | 'guide' | 'questgiver';
  dialogue: string[];
  personality: string;
  aiModel: 'openai' | 'gemini' | 'deepseek' | 'grok';
  services?: NPCService[];
}

export interface NPCService {
  type: 'heal' | 'shop' | 'train' | 'evolve' | 'quest';
  cost?: number;
  items?: ShopItem[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'potion' | 'equipment' | 'evolution_stone' | 'shadow_egg';
  effect?: string;
}

export interface AIShadow {
  id: string;
  name: string;
  species: string;
  type: ShadowType[];
  level: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';
  stats: ShadowStats;
  moves: AIMove[];
  personality: string;
  description: string;
  evolutionStage: number;
  evolutionRequirements?: EvolutionRequirement[];
  aiGenerated: boolean;
}

export interface ShadowType {
  name: string;
  color: string;
  effectiveness: Record<string, number>;
}

export interface AIMove {
  id: string;
  name: string;
  description: string;
  type: string;
  power: number;
  accuracy: number;
  manaCost: number;
  effects: MoveEffect[];
  animation: string;
}

export interface MoveEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'status';
  target: 'self' | 'enemy' | 'all';
  value: number;
  duration?: number;
}

export interface ShadowStats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  mana: number;
  maxMana: number;
  experience: number;
  experienceToNext: number;
}

export interface EvolutionRequirement {
  type: 'level' | 'item' | 'friendship' | 'condition';
  value: string | number;
  description: string;
}

export interface StageReward {
  type: 'experience' | 'shadowTokens' | 'item' | 'shadow';
  amount?: number;
  item?: ShopItem;
  shadow?: AIShadow;
}

export interface AdventureProgress {
  currentStage: string;
  completedStages: string[];
  unlockedStages: string[];
  totalExperience: number;
  shadowsDiscovered: number;
  battlesWon: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  isCompleted: boolean;
  reward?: StageReward;
}

export interface AIGenerationRequest {
  type: 'stage' | 'enemy' | 'npc' | 'shadow' | 'dialogue' | 'scenario';
  context: Record<string, any>;
  aiModel: 'openai' | 'gemini' | 'deepseek' | 'grok';
  parameters?: Record<string, any>;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  model: string;
  tokens?: number;
}