import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameContextType, User, Shadow, Battle, BattleTurn, Skill } from '../types/game';
import { toast } from 'sonner';
import { generateShadowImageUrl } from '@/lib/imageApi';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

// Shadow skills database
const SHADOW_SKILLS: Record<Shadow['class'], Skill[]> = {
  warrior: [
    { id: 'slash', name: 'Slash', description: 'Basic sword attack', damage: 25, manaCost: 10, cooldown: 0, type: 'attack' },
    { id: 'shield_bash', name: 'Shield Bash', description: 'Stun enemy and deal damage', damage: 20, manaCost: 15, cooldown: 2, type: 'attack' },
    { id: 'berserker_rage', name: 'Berserker Rage', description: 'Increase attack for 3 turns', manaCost: 20, cooldown: 4, type: 'buff' }
  ],
  mage: [
    { id: 'fireball', name: 'Fireball', description: 'Cast a fireball', damage: 30, manaCost: 15, cooldown: 0, type: 'attack' },
    { id: 'ice_shard', name: 'Ice Shard', description: 'Freeze enemy for 1 turn', damage: 20, manaCost: 18, cooldown: 3, type: 'attack' },
    { id: 'heal', name: 'Heal', description: 'Restore health', manaCost: 12, cooldown: 2, type: 'heal' }
  ],
  archer: [
    { id: 'arrow_shot', name: 'Arrow Shot', description: 'Precise ranged attack', damage: 22, manaCost: 8, cooldown: 0, type: 'attack' },
    { id: 'poison_arrow', name: 'Poison Arrow', description: 'Poison enemy for 3 turns', damage: 15, manaCost: 15, cooldown: 3, type: 'attack' },
    { id: 'multi_shot', name: 'Multi Shot', description: 'Attack multiple times', damage: 18, manaCost: 20, cooldown: 4, type: 'attack' }
  ],
  assassin: [
    { id: 'backstab', name: 'Backstab', description: 'Critical stealth attack', damage: 35, manaCost: 12, cooldown: 0, type: 'attack' },
    { id: 'smoke_bomb', name: 'Smoke Bomb', description: 'Become invisible for 2 turns', manaCost: 18, cooldown: 5, type: 'buff' },
    { id: 'poison_blade', name: 'Poison Blade', description: 'Poison on hit', damage: 20, manaCost: 15, cooldown: 3, type: 'attack' }
  ]
};

// Shadow emotions for image generation
const SHADOW_EMOTIONS: Record<Shadow['class'], string> = {
  warrior: 'courage',
  mage: 'wisdom',
  archer: 'precision',
  assassin: 'stealth'
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [shadows, setShadows] = useState<Shadow[]>([]);
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('shadowmage_user');
    const savedShadows = localStorage.getItem('shadowmage_shadows');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedShadows) {
      setShadows(JSON.parse(savedShadows));
    }
    
    setIsLoading(false);
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('shadowmage_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shadowmage_shadows', JSON.stringify(shadows));
  }, [shadows]);

  const login = async (): Promise<boolean> => {
    // Auto-login with guest user
    const guestUser: User = {
      id: 'guest_' + Date.now().toString(),
      username: 'Shadow Mage',
      email: 'guest@shadowrealm.com',
      level: 1,
      experience: 0,
      shadowTokens: 100,
      createdAt: new Date()
    };
    
    setUser(guestUser);
    toast.success('Welcome to the Shadow Realm!');
    return true;
  };

  const register = async (): Promise<boolean> => {
    return login(); // Same as login for guest mode
  };

  const logout = () => {
    setUser(null);
    setShadows([]);
    setCurrentBattle(null);
    localStorage.removeItem('shadowmage_user');
    localStorage.removeItem('shadowmage_shadows');
    toast.success('May the shadows guide you back');
  };

  const generateShadowStats = (rarity: Shadow['rarity'], shadowClass: Shadow['class']) => {
    const baseStats = {
      warrior: { health: 120, attack: 25, defense: 20, speed: 15, mana: 50 },
      mage: { health: 80, attack: 30, defense: 10, speed: 20, mana: 100 },
      archer: { health: 100, attack: 28, defense: 15, speed: 25, mana: 70 },
      assassin: { health: 90, attack: 32, defense: 12, speed: 30, mana: 60 }
    };
    
    const rarityMultiplier = {
      common: 1,
      rare: 1.2,
      epic: 1.5,
      legendary: 2
    };
    
    const base = baseStats[shadowClass];
    const multiplier = rarityMultiplier[rarity];
    
    return {
      health: Math.floor(base.health * multiplier),
      maxHealth: Math.floor(base.health * multiplier),
      attack: Math.floor(base.attack * multiplier),
      defense: Math.floor(base.defense * multiplier),
      speed: Math.floor(base.speed * multiplier),
      mana: Math.floor(base.mana * multiplier),
      maxMana: Math.floor(base.mana * multiplier)
    };
  };

  const createShadow = async (name: string, shadowClass: Shadow['class']): Promise<Shadow> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Determine rarity (random with weighted probability)
    const rarityRoll = Math.random();
    let rarity: Shadow['rarity'];
    if (rarityRoll < 0.5) rarity = 'common';
    else if (rarityRoll < 0.8) rarity = 'rare';
    else if (rarityRoll < 0.95) rarity = 'epic';
    else rarity = 'legendary';
    
    // Generate image URL for the shadow
    const imageUrl = generateShadowImageUrl(name, shadowClass, rarity);
    
    const newShadow: Shadow = {
      id: Date.now().toString(),
      name,
      rarity,
      class: shadowClass,
      level: 1,
      experience: 0,
      stats: generateShadowStats(rarity, shadowClass),
      skills: SHADOW_SKILLS[shadowClass],
      ownerId: user.id,
      createdAt: new Date(),
      imageUrl // Add the generated image URL
    };
    
    setShadows(prev => [...prev, newShadow]);
    toast.success(`${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${shadowClass} shadow "${name}" has joined your realm!`);
    setIsLoading(false);
    
    return newShadow;
  };

  const getShadows = (): Shadow[] => {
    return shadows.filter(shadow => shadow.ownerId === user?.id);
  };

  const levelUpShadow = (shadowId: string) => {
    setShadows(prev => prev.map(shadow => {
      if (shadow.id === shadowId) {
        const newLevel = shadow.level + 1;
        const statIncrease = Math.floor(newLevel * 0.1);
        
        return {
          ...shadow,
          level: newLevel,
          experience: 0,
          stats: {
            ...shadow.stats,
            maxHealth: shadow.stats.maxHealth + statIncrease * 10,
            health: shadow.stats.maxHealth + statIncrease * 10,
            attack: shadow.stats.attack + statIncrease * 2,
            defense: shadow.stats.defense + statIncrease * 2,
            speed: shadow.stats.speed + statIncrease,
            maxMana: shadow.stats.maxMana + statIncrease * 5,
            mana: shadow.stats.maxMana + statIncrease * 5
          }
        };
      }
      return shadow;
    }));
    
    toast.success('Shadow has ascended to a new level!');
  };

  const generateOpponent = (playerShadow: Shadow): Shadow => {
    const classes: Shadow['class'][] = ['warrior', 'mage', 'archer', 'assassin'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const opponentName = `Dark ${randomClass.charAt(0).toUpperCase() + randomClass.slice(1)}`;
    
    // Generate image URL for the opponent
    const imageUrl = generateShadowImageUrl(opponentName, randomClass, playerShadow.rarity);
    
    return {
      id: 'opponent_' + Date.now(),
      name: opponentName,
      rarity: playerShadow.rarity,
      class: randomClass,
      level: playerShadow.level,
      experience: 0,
      stats: generateShadowStats(playerShadow.rarity, randomClass),
      skills: SHADOW_SKILLS[randomClass],
      ownerId: 'ai',
      createdAt: new Date(),
      imageUrl // Add the generated image URL
    };
  };

  const startBattle = async (shadowId: string, type: 'pve' | 'pvp'): Promise<Battle> => {
    const playerShadow = shadows.find(s => s.id === shadowId);
    if (!playerShadow) throw new Error('Shadow not found');
    
    setIsLoading(true);
    
    // Simulate battle preparation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const opponentShadow = generateOpponent(playerShadow);
    
    const battle: Battle = {
      id: Date.now().toString(),
      type,
      playerShadow: { ...playerShadow },
      opponentShadow,
      status: 'preparation',
      currentTurn: 'player',
      turns: [],
      createdAt: new Date()
    };
    
    setCurrentBattle(battle);
    setIsLoading(false);
    toast.success('Battle arena prepared. Choose your strategy!');
    
    return battle;
  };

  const performBattleAction = async (action: BattleTurn['action']): Promise<BattleTurn> => {
    if (!currentBattle) throw new Error('No active battle');
    
    const turnNumber = currentBattle.turns.length + 1;
    let damage = 0;
    let healing = 0;
    
    if (action.type === 'attack') {
      damage = currentBattle.playerShadow.stats.attack + Math.floor(Math.random() * 10);
    } else if (action.type === 'skill' && action.skillId) {
      const skill = currentBattle.playerShadow.skills.find(s => s.id === action.skillId);
      if (skill) {
        if (skill.type === 'attack') {
          damage = (skill.damage || 0) + Math.floor(Math.random() * 10);
        } else if (skill.type === 'heal') {
          healing = 30 + Math.floor(Math.random() * 20);
        }
      }
    }
    
    const turn: BattleTurn = {
      turnNumber,
      actor: 'player',
      action,
      result: { damage, healing }
    };
    
    // Apply damage/healing
    const updatedBattle = { ...currentBattle };
    if (damage > 0) {
      updatedBattle.opponentShadow.stats.health = Math.max(0, 
        updatedBattle.opponentShadow.stats.health - damage);
    }
    if (healing > 0) {
      updatedBattle.playerShadow.stats.health = Math.min(
        updatedBattle.playerShadow.stats.maxHealth,
        updatedBattle.playerShadow.stats.health + healing);
    }
    
    updatedBattle.turns.push(turn);
    
    // Check for battle end
    if (updatedBattle.opponentShadow.stats.health <= 0) {
      updatedBattle.status = 'finished';
      updatedBattle.winner = 'player';
      updatedBattle.rewards = {
        experience: 50 + Math.floor(Math.random() * 30),
        shadowTokens: 10 + Math.floor(Math.random() * 15)
      };
      toast.success('Victory! The shadow realm bows to your power!');
    } else if (updatedBattle.playerShadow.stats.health <= 0) {
      updatedBattle.status = 'finished';
      updatedBattle.winner = 'opponent';
      toast.error('Defeat... but shadows learn from every battle.');
    } else {
      updatedBattle.currentTurn = 'opponent';
      
      // Simple AI turn
      setTimeout(() => {
        const aiDamage = updatedBattle.opponentShadow.stats.attack + Math.floor(Math.random() * 10);
        const aiTurn: BattleTurn = {
          turnNumber: turnNumber + 1,
          actor: 'opponent',
          action: { type: 'attack' },
          result: { damage: aiDamage }
        };
        
        updatedBattle.playerShadow.stats.health = Math.max(0,
          updatedBattle.playerShadow.stats.health - aiDamage);
        updatedBattle.turns.push(aiTurn);
        
        if (updatedBattle.playerShadow.stats.health <= 0) {
          updatedBattle.status = 'finished';
          updatedBattle.winner = 'opponent';
          toast.error('Defeat... but shadows learn from every battle.');
        } else {
          updatedBattle.currentTurn = 'player';
        }
        
        setCurrentBattle({ ...updatedBattle });
      }, 2000);
    }
    
    setCurrentBattle(updatedBattle);
    return turn;
  };

  const endBattle = () => {
    if (currentBattle?.winner === 'player' && currentBattle.rewards) {
      // Apply rewards
      if (user) {
        setUser(prev => prev ? {
          ...prev,
          shadowTokens: prev.shadowTokens + currentBattle.rewards!.shadowTokens
        } : null);
      }
      
      // Give experience to shadow
      const shadowIndex = shadows.findIndex(s => s.id === currentBattle.playerShadow.id);
      if (shadowIndex !== -1) {
        setShadows(prev => prev.map((shadow, index) => {
          if (index === shadowIndex) {
            const newExp = shadow.experience + currentBattle.rewards!.experience;
            const expToNextLevel = shadow.level * 100;
            
            if (newExp >= expToNextLevel) {
              levelUpShadow(shadow.id);
              return shadow;
            }
            
            return { ...shadow, experience: newExp };
          }
          return shadow;
        }));
      }
    }
    
    setCurrentBattle(null);
  };

  const value: GameContextType = {
    user,
    shadows,
    currentBattle,
    isLoading,
    login,
    register,
    logout,
    createShadow,
    getShadows,
    levelUpShadow,
    startBattle,
    performBattleAction,
    endBattle
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};