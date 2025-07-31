// src/context/GameContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Shadow } from '@/types/game';
import { generateShadowId } from '@/lib/shadow'; // ✅ fix import

// ---------- TYPES ----------
type User = {
  id: string;
  name: string;
  shadowTokens: number;
};

type GameState = {
  user: User | null;
  shadows: Shadow[];
  isLoading: boolean;
};

type GameAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_SHADOW'; payload: Shadow }
  | { type: 'UPDATE_TOKENS'; payload: number };

// ---------- REDUCER ----------
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_SHADOW':
      return { ...state, shadows: [...state.shadows, action.payload] };
    case 'UPDATE_TOKENS':
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, shadowTokens: state.user.shadowTokens + action.payload },
      };
    default:
      return state;
  }
};

// ---------- CONTEXT ----------
const GameContext = createContext<{
  state: GameState;
  createShadow: (name: string, cls: Shadow['class']) => Promise<void>;
  login: () => Promise<void>;
} | null>(null);

// ---------- PROVIDER ----------
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    user: null,
    shadows: [],
    isLoading: false,
  });

  // simula login
  const login = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await new Promise((r) => setTimeout(r, 800));
    dispatch({
      type: 'SET_USER',
      payload: { id: 'player-1', name: 'ShadowLord', shadowTokens: 100 },
    });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  // criação de sombra com ID seguro
  const createShadow = async (name: string, cls: Shadow['class']) => {
    if (!state.user || state.user.shadowTokens < 20) return;

    const newShadow: Shadow = {
      id: generateShadowId(), // ✅ substitui crypto.randomUUID()
      name,
      class: cls,
      level: 1,
      health: Math.floor(Math.random() * 50) + 50,
      attack: Math.floor(Math.random() * 30) + 20,
      defense: Math.floor(Math.random() * 30) + 10,
      speed: Math.floor(Math.random() * 20) + 10,
      rarity: ['common', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 4)] as Shadow['rarity'],
      skills: [],
    };

    dispatch({ type: 'ADD_SHADOW', payload: newShadow });
    dispatch({ type: 'UPDATE_TOKENS', payload: -20 });

    // salva no localStorage
    const updatedShadows = [...state.shadows, newShadow];
    localStorage.setItem('shadows', JSON.stringify(updatedShadows));
    localStorage.setItem(
      'user',
      JSON.stringify({ ...state.user, shadowTokens: state.user.shadowTokens - 20 })
    );
  };

  // carrega dados ao montar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedShadows = localStorage.getItem('shadows');
    if (savedUser) dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    if (savedShadows) dispatch({ type: 'ADD_SHADOW', payload: JSON.parse(savedShadows) });
  }, []);

  return (
    <GameContext.Provider value={{ state, createShadow, login }}>
      {children}
    </GameContext.Provider>
  );
};

// ---------- HOOK ----------
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameContext must be used within GameProvider');
  return context;
};