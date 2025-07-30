import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap, Shield, Heart, Sparkles } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { AIEnemy, AIMove } from '@/types/adventure';
import { Shadow } from '@/types/game';
import { cn } from '@/lib/utils';

interface PokemonBattleProps {
  enemy: AIEnemy;
  onComplete: (victory: boolean) => void;
  onBack: () => void;
}

interface BattleState {
  playerShadow: Shadow | null;
  enemyShadow: any;
  currentTurn: 'player' | 'enemy';
  battleLog: string[];
  isAnimating: boolean;
  playerAction: string | null;
  enemyAction: string | null;
}

export const PokemonBattle: React.FC<PokemonBattleProps> = ({
  enemy,
  onComplete,
  onBack
}) => {
  const { getShadows } = useGameContext();
  const [selectedShadow, setSelectedShadow] = useState<Shadow | null>(null);
  const [battleState, setBattleState] = useState<BattleState>({
    playerShadow: null,
    enemyShadow: enemy.shadows[0] || null,
    currentTurn: 'player',
    battleLog: [],
    isAnimating: false,
    playerAction: null,
    enemyAction: null
  });
  const [battlePhase, setBattlePhase] = useState<'selection' | 'battle' | 'result'>('selection');
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);

  const userShadows = getShadows();

  const startBattle = (shadow: Shadow) => {
    setSelectedShadow(shadow);
    setBattleState(prev => ({
      ...prev,
      playerShadow: { ...shadow },
      battleLog: [`${shadow.name} enters the battle!`, `Wild ${enemy.name} appears!`]
    }));
    setBattlePhase('battle');
  };

  const executePlayerAction = async (move: any) => {
    if (battleState.isAnimating || battleState.currentTurn !== 'player') return;

    setBattleState(prev => ({ ...prev, isAnimating: true, playerAction: move.name }));

    // Simulate move animation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Calculate damage
    const damage = Math.max(1, move.damage || 20 + Math.floor(Math.random() * 15));
    
    setBattleState(prev => {
      const newEnemyShadow = { 
        ...prev.enemyShadow, 
        stats: { 
          ...prev.enemyShadow.stats, 
          health: Math.max(0, prev.enemyShadow.stats.health - damage) 
        }
      };

      const newLog = [
        ...prev.battleLog,
        `${prev.playerShadow?.name} used ${move.name}!`,
        `Dealt ${damage} damage!`
      ];

      // Check if enemy is defeated
      if (newEnemyShadow.stats.health <= 0) {
        setBattlePhase('result');
        setBattleResult('victory');
        return {
          ...prev,
          enemyShadow: newEnemyShadow,
          battleLog: [...newLog, `${enemy.name} is defeated!`],
          isAnimating: false,
          playerAction: null
        };
      }

      return {
        ...prev,
        enemyShadow: newEnemyShadow,
        battleLog: newLog,
        currentTurn: 'enemy',
        isAnimating: false,
        playerAction: null
      };
    });
  };

  // Enemy AI turn
  useEffect(() => {
    if (battleState.currentTurn === 'enemy' && !battleState.isAnimating && battlePhase === 'battle') {
      const executeEnemyTurn = async () => {
        setBattleState(prev => ({ ...prev, isAnimating: true }));
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simple AI: random move
        const enemyMoves = battleState.enemyShadow?.moves || [
          { name: 'Shadow Strike', damage: 25 },
          { name: 'Dark Pulse', damage: 20 }
        ];
        const selectedMove = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
        const damage = Math.max(1, selectedMove.damage + Math.floor(Math.random() * 10));

        setBattleState(prev => {
          if (!prev.playerShadow) return prev;

          const newPlayerShadow = {
            ...prev.playerShadow,
            stats: {
              ...prev.playerShadow.stats,
              health: Math.max(0, prev.playerShadow.stats.health - damage)
            }
          };

          const newLog = [
            ...prev.battleLog,
            `${enemy.name} used ${selectedMove.name}!`,
            `${prev.playerShadow.name} took ${damage} damage!`
          ];

          // Check if player is defeated
          if (newPlayerShadow.stats.health <= 0) {
            setBattlePhase('result');
            setBattleResult('defeat');
            return {
              ...prev,
              playerShadow: newPlayerShadow,
              battleLog: [...newLog, `${prev.playerShadow.name} is defeated!`],
              isAnimating: false,
              enemyAction: null
            };
          }

          return {
            ...prev,
            playerShadow: newPlayerShadow,
            battleLog: newLog,
            currentTurn: 'player',
            isAnimating: false,
            enemyAction: null
          };
        });
      };

      executeEnemyTurn();
    }
  }, [battleState.currentTurn, battleState.isAnimating, battlePhase, enemy.name]);

  if (battlePhase === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-shadow p-6">
        <div className="container mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gradient">Choose Your Shadow</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userShadows.map(shadow => (
              <Card 
                key={shadow.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-mystical",
                  "bg-gradient-card border-primary/20"
                )}
                onClick={() => startBattle(shadow)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{shadow.name}</span>
                    <Badge variant="outline" className="capitalize">
                      {shadow.rarity}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Health</span>
                      <span>{shadow.stats.health}/{shadow.stats.maxHealth}</span>
                    </div>
                    <Progress 
                      value={(shadow.stats.health / shadow.stats.maxHealth) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Attack: {shadow.stats.attack}</div>
                    <div>Defense: {shadow.stats.defense}</div>
                    <div>Speed: {shadow.stats.speed}</div>
                    <div>Level: {shadow.level}</div>
                  </div>

                  <Button className="w-full">
                    Enter Battle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (battlePhase === 'result') {
    return (
      <div className="min-h-screen bg-gradient-shadow flex items-center justify-center p-6">
        <Card className="max-w-md mx-auto bg-gradient-card border-primary/20">
          <CardContent className="p-8 text-center space-y-6">
            <div className={cn(
              "text-6xl font-bold animate-bounce-slow",
              battleResult === 'victory' ? "text-green-400" : "text-red-400"
            )}>
              {battleResult === 'victory' ? '🏆' : '💀'}
            </div>
            
            <h2 className={cn(
              "text-3xl font-bold",
              battleResult === 'victory' ? "text-green-400" : "text-red-400"
            )}>
              {battleResult === 'victory' ? 'Victory!' : 'Defeat'}
            </h2>
            
            <p className="text-muted-foreground">
              {battleResult === 'victory' 
                ? 'Your shadow emerges victorious from the battle!'
                : 'Your shadow fought bravely but was defeated.'}
            </p>

            <div className="space-y-2">
              <Button 
                onClick={() => onComplete(battleResult === 'victory')}
                className="w-full"
              >
                Continue Adventure
              </Button>
              <Button 
                onClick={onBack}
                variant="outline"
                className="w-full"
              >
                Return to Stage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Battle Arena Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Flee
          </Button>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Battle Arena
          </Badge>
        </div>

        {/* Battle Field */}
        <div className="flex-1 grid grid-rows-2 gap-8">
          {/* Enemy Shadow */}
          <div className="flex items-start justify-center">
            <div className="space-y-4 text-center">
              <div className={cn(
                "w-32 h-32 rounded-full bg-gradient-to-br from-red-500/20 to-red-700/20",
                "border-2 border-red-500/50 flex items-center justify-center text-6xl",
                "animate-float",
                battleState.isAnimating && battleState.currentTurn === 'enemy' && "animate-shake"
              )}>
                👹
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{enemy.name}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-white/80">
                    <span>HP</span>
                    <span>
                      {battleState.enemyShadow?.stats.health}/{battleState.enemyShadow?.stats.maxHealth}
                    </span>
                  </div>
                  <Progress 
                    value={
                      battleState.enemyShadow 
                        ? (battleState.enemyShadow.stats.health / battleState.enemyShadow.stats.maxHealth) * 100 
                        : 100
                    }
                    className="h-3 bg-red-900/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Player Shadow */}
          <div className="flex items-end justify-center">
            <div className="space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{battleState.playerShadow?.name}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-white/80">
                    <span>HP</span>
                    <span>
                      {battleState.playerShadow?.stats.health}/{battleState.playerShadow?.stats.maxHealth}
                    </span>
                  </div>
                  <Progress 
                    value={
                      battleState.playerShadow 
                        ? (battleState.playerShadow.stats.health / battleState.playerShadow.stats.maxHealth) * 100 
                        : 100
                    }
                    className="h-3"
                  />
                </div>
              </div>
              <div className={cn(
                "w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40",
                "border-2 border-primary/50 flex items-center justify-center text-6xl",
                "animate-float",
                battleState.isAnimating && battleState.currentTurn === 'player' && "animate-battle-entrance"
              )}>
                🌟
              </div>
            </div>
          </div>
        </div>

        {/* Battle Controls */}
        <div className="space-y-4">
          {/* Battle Log */}
          <Card className="bg-black/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="h-24 overflow-y-auto space-y-1">
                {battleState.battleLog.slice(-4).map((log, index) => (
                  <p key={index} className="text-sm text-white/90">
                    {log}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {battleState.playerShadow?.skills.slice(0, 4).map((skill, index) => (
              <Button
                key={skill.id}
                onClick={() => executePlayerAction(skill)}
                disabled={battleState.isAnimating || battleState.currentTurn !== 'player'}
                className={cn(
                  "h-16 flex flex-col items-center justify-center space-y-1",
                  "bg-gradient-to-br from-primary/20 to-primary/40 border-primary/50",
                  "hover:from-primary/30 hover:to-primary/50"
                )}
              >
                <div className="flex items-center gap-2">
                  {index === 0 && <Zap className="w-4 h-4" />}
                  {index === 1 && <Shield className="w-4 h-4" />}
                  {index === 2 && <Heart className="w-4 h-4" />}
                  {index === 3 && <Sparkles className="w-4 h-4" />}
                  <span className="font-medium text-sm">{skill.name}</span>
                </div>
                <span className="text-xs text-white/70">
                  {skill.manaCost} MP
                </span>
              </Button>
            ))}
          </div>

          {/* Turn Indicator */}
          <div className="text-center">
            <Badge 
              variant={battleState.currentTurn === 'player' ? 'default' : 'secondary'}
              className="px-4 py-2"
            >
              {battleState.isAnimating 
                ? 'Executing action...' 
                : battleState.currentTurn === 'player' 
                  ? 'Your turn' 
                  : 'Enemy turn'
              }
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};