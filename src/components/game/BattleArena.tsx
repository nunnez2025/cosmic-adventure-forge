import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/context/GameContext';
import { ShadowCard } from './ShadowCard';
import { Skill } from '@/types/game';
import { toast } from 'sonner';
import { Sword, Shield, Heart, Sparkles, Clock, Target } from 'lucide-react';

export const BattleArena: React.FC = () => {
  const { getShadows, currentBattle, startBattle, performBattleAction, endBattle, isLoading } = useGameContext();
  const [selectedShadowId, setSelectedShadowId] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const shadows = getShadows();

  const handleStartBattle = async () => {
    if (!selectedShadowId) {
      toast.error('Please select a shadow for battle');
      return;
    }

    await startBattle(selectedShadowId, 'pve');
  };

  const handleAttack = async () => {
    if (!currentBattle || currentBattle.currentTurn !== 'player') return;
    
    await performBattleAction({ type: 'attack' });
  };

  const handleSkill = async (skill: Skill) => {
    if (!currentBattle || currentBattle.currentTurn !== 'player') return;
    
    if (currentBattle.playerShadow.stats.mana < skill.manaCost) {
      toast.error('Not enough mana for this skill');
      return;
    }
    
    await performBattleAction({ type: 'skill', skillId: skill.id });
  };

  const handleDefend = async () => {
    if (!currentBattle || currentBattle.currentTurn !== 'player') return;
    
    await performBattleAction({ type: 'defend' });
  };

  const handleEndBattle = () => {
    endBattle();
  };

  if (!currentBattle) {
    return (
      <div className="space-y-6">
        <Card className="shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Battle Arena
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose your shadow warrior and enter the arena to prove your worth
            </CardDescription>
          </CardHeader>
        </Card>

        {shadows.length === 0 ? (
          <Card className="text-center p-8 border-border/50 bg-card/50">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You need at least one shadow to enter battle
              </p>
              <p className="text-sm text-muted-foreground">
                Visit the Shadow Forge to create your first companion
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shadows.map((shadow) => (
                <ShadowCard
                  key={shadow.id}
                  shadow={shadow}
                  selected={selectedShadowId === shadow.id}
                  onClick={() => setSelectedShadowId(shadow.id)}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleStartBattle}
                disabled={!selectedShadowId || isLoading}
                variant="mystical"
                size="lg"
                className="px-8 py-3"
              >
                {isLoading ? 'Preparing Arena...' : 'Enter Battle'}
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Battle interface
  const playerShadow = currentBattle.playerShadow;
  const opponentShadow = currentBattle.opponentShadow;
  const playerHealthPercent = (playerShadow.stats.health / playerShadow.stats.maxHealth) * 100;
  const opponentHealthPercent = (opponentShadow.stats.health / opponentShadow.stats.maxHealth) * 100;
  const playerManaPercent = (playerShadow.stats.mana / playerShadow.stats.maxMana) * 100;

  return (
    <div className="space-y-6">
      <Card className="shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-foreground">
            {currentBattle.status === 'finished' 
              ? (currentBattle.winner === 'player' ? '🎉 Victory!' : '💀 Defeat')
              : '⚔️ Battle Arena'
            }
          </CardTitle>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Badge variant="outline">{currentBattle.type.toUpperCase()}</Badge>
            <span className="text-muted-foreground">Turn {currentBattle.turns.length + 1}</span>
            {currentBattle.status === 'active' && (
              <Badge variant={currentBattle.currentTurn === 'player' ? 'default' : 'secondary'}>
                {currentBattle.currentTurn === 'player' ? 'Your Turn' : 'Enemy Turn'}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Battle Field */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Shadow */}
        <Card className="border-primary/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Shield className="w-5 h-5" />
              {playerShadow.name}
              <Badge className="bg-green-500/20 text-green-400">You</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-red-400">
                  <Heart className="w-4 h-4" />
                  Health
                </span>
                <span>{playerShadow.stats.health}/{playerShadow.stats.maxHealth}</span>
              </div>
              <Progress value={playerHealthPercent} className="h-3">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{ width: `${playerHealthPercent}%` }}
                />
              </Progress>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  Mana
                </span>
                <span>{playerShadow.stats.mana}/{playerShadow.stats.maxMana}</span>
              </div>
              <Progress value={playerManaPercent} className="h-3">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ width: `${playerManaPercent}%` }}
                />
              </Progress>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="text-red-400 font-semibold">{playerShadow.stats.attack}</div>
                <div className="text-muted-foreground text-xs">ATK</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-semibold">{playerShadow.stats.defense}</div>
                <div className="text-muted-foreground text-xs">DEF</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold">{playerShadow.stats.speed}</div>
                <div className="text-muted-foreground text-xs">SPD</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opponent Shadow */}
        <Card className="border-blood/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Target className="w-5 h-5" />
              {opponentShadow.name}
              <Badge className="bg-red-500/20 text-red-400">Enemy</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-red-400">
                  <Heart className="w-4 h-4" />
                  Health
                </span>
                <span>{opponentShadow.stats.health}/{opponentShadow.stats.maxHealth}</span>
              </div>
              <Progress value={opponentHealthPercent} className="h-3">
                <div 
                  className="h-full bg-gradient-blood transition-all duration-500"
                  style={{ width: `${opponentHealthPercent}%` }}
                />
              </Progress>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="text-red-400 font-semibold">{opponentShadow.stats.attack}</div>
                <div className="text-muted-foreground text-xs">ATK</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-semibold">{opponentShadow.stats.defense}</div>
                <div className="text-muted-foreground text-xs">DEF</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold">{opponentShadow.stats.speed}</div>
                <div className="text-muted-foreground text-xs">SPD</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Panel */}
      {currentBattle.status === 'active' && currentBattle.currentTurn === 'player' && (
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Choose Your Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Button 
                onClick={handleAttack}
                variant="destructive"
                className="h-12"
              >
                <Sword className="w-4 h-4 mr-2" />
                Attack
              </Button>
              <Button 
                onClick={handleDefend}
                variant="secondary"
                className="h-12"
              >
                <Shield className="w-4 h-4 mr-2" />
                Defend
              </Button>
              <Button 
                onClick={() => {}}
                variant="outline"
                disabled
                className="h-12"
              >
                <Clock className="w-4 h-4 mr-2" />
                Wait
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Skills:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {playerShadow.skills.map((skill) => (
                  <Button
                    key={skill.id}
                    onClick={() => handleSkill(skill)}
                    variant="outline"
                    disabled={playerShadow.stats.mana < skill.manaCost}
                    className="justify-start text-left h-auto p-3"
                  >
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.manaCost} MP
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {skill.description}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Battle Finished */}
      {currentBattle.status === 'finished' && (
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm text-center">
          <CardContent className="pt-6">
            {currentBattle.winner === 'player' && currentBattle.rewards && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-green-400">Victory Rewards</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-primary font-semibold">+{currentBattle.rewards.experience}</div>
                    <div className="text-muted-foreground">Experience</div>
                  </div>
                  <div>
                    <div className="text-primary font-semibold">+{currentBattle.rewards.shadowTokens}</div>
                    <div className="text-muted-foreground">Shadow Tokens</div>
                  </div>
                </div>
              </div>
            )}
            <Button onClick={handleEndBattle} variant="mystical" className="mt-4">
              Continue Journey
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Battle Log */}
      {currentBattle.turns.length > 0 && (
        <Card className="border-border/30 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm">Battle Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {currentBattle.turns.slice(-5).map((turn, index) => (
                <div key={index} className="text-sm flex items-center gap-2">
                  <Badge variant={turn.actor === 'player' ? 'default' : 'secondary'} className="text-xs">
                    {turn.actor === 'player' ? 'You' : 'Enemy'}
                  </Badge>
                  <span className="text-muted-foreground">
                    used {turn.action.type}
                    {turn.result.damage && ` for ${turn.result.damage} damage`}
                    {turn.result.healing && ` healing ${turn.result.healing} HP`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};