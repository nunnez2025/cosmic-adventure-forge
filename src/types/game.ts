export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  experience: number;
  shadowTokens: number;
  createdAt: Date;
}

export interface Shadow {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  class: 'warrior' | 'mage' | 'archer' | 'assassin';
  level: number;
  experience: number;
  stats: {
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    speed: number;
    mana: number;
    maxMana: number;
  };
  skills: Skill[];
  ownerId: string;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  damage?: number;
  manaCost: number;
  cooldown: number;
  type: 'attack' | 'defense' | 'heal' | 'buff' | 'debuff';
}

export interface Battle {
  id: string;
  type: 'pve' | 'pvp';
  playerShadow: Shadow;
  opponentShadow: Shadow;
  status: 'preparation' | 'active' | 'finished';
  currentTurn: 'player' | 'opponent';
  winner?: 'player' | 'opponent';
  rewards?: {
    experience: number;
    shadowTokens: number;
  };
  turns: BattleTurn[];
  createdAt: Date;
}

export interface BattleTurn {
  turnNumber: number;
  actor: 'player' | 'opponent';
  action: {
    type: 'attack' | 'skill' | 'defend';
    skillId?: string;
    damage?: number;
    healing?: number;
  };
  result: {
    damage?: number;
    healing?: number;
    statusEffects?: StatusEffect[];
  };
}

export interface StatusEffect {
  type: 'poison' | 'burn' | 'freeze' | 'stun' | 'boost' | 'shield';
  duration: number;
  value: number;
}

export interface GameContextType {
  user: User | null;
  shadows: Shadow[];
  currentBattle: Battle | null;
  isLoading: boolean;
  
  // Auth functions
  login: () => Promise<boolean>;
  register: () => Promise<boolean>;
  logout: () => void;
  
  // Shadow functions
  createShadow: (name: string, shadowClass: Shadow['class']) => Promise<Shadow>;
  getShadows: () => Shadow[];
  levelUpShadow: (shadowId: string) => void;
  
  // Battle functions
  startBattle: (shadowId: string, type: 'pve' | 'pvp') => Promise<Battle>;
  performBattleAction: (action: BattleTurn['action']) => Promise<BattleTurn>;
  endBattle: () => void;
}