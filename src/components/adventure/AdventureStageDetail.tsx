import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useGameContext } from '@/context/GameContext';
import { AdventureStage, AIEnemy, AINPC } from '@/types/adventure';
import { Shadow } from '@/types/game';
import { ShadowCard } from '../game/ShadowCard';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Sword, 
  Users, 
  MessageCircle, 
  Sparkles, 
  Trophy, 
  ShieldAlert,
  Skull,
  Coins,
  Heart
} from 'lucide-react';

interface AdventureStageDetailProps {
  stage: AdventureStage;
  onBack: () => void;
  onComplete: (stageId: string) => void;
}

export const AdventureStageDetail: React.FC<AdventureStageDetailProps> = ({ 
  stage, 
  onBack,
  onComplete
}) => {
  const { getShadows, startBattle, currentBattle, performBattleAction, endBattle } = useGameContext();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedShadowId, setSelectedShadowId] = useState<string>('');
  const [selectedEnemy, setSelectedEnemy] = useState<AIEnemy | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<AINPC | null>(null);
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const shadows = getShadows();

  // Generate mock enemies if none exist
  useEffect(() => {
    if (stage.enemies.length === 0) {
      const mockEnemies: AIEnemy[] = [
        {
          id: `enemy_${stage.id}_1`,
          name: 'Shadow Sentinel',
          description: 'A guardian of the ancient forest, corrupted by dark magic.',
          avatar: 'sentinel',
          level: 5,
          shadows: [],
          personality: 'Stoic and determined',
          battleDialogue: [
            'You dare enter these sacred grounds?',
            'The shadows will consume you!',
            'Your journey ends here, mortal.'
          ],
          defeatDialogue: [
            'How... is this possible?',
            'The darkness... it fades...',
            'Perhaps you are the one foretold...'
          ],
          aiModel: 'openai'
        },
        {
          id: `enemy_${stage.id}_2`,
          name: 'Mist Weaver',
          description: 'A mysterious entity that manipulates the mists and shadows.',
          avatar: 'weaver',
          level: 6,
          shadows: [],
          personality: 'Enigmatic and cunning',
          battleDialogue: [
            'The mist reveals all truths...',
            'Your fears will become reality!',
            'Dance with the shadows, if you dare.'
          ],
          defeatDialogue: [
            'The mist... it clears...',
            'You have strength I did not foresee.',
            'This is but one battle in a greater war.'
          ],
          aiModel: 'openai'
        }
      ];
      
      // Update stage with mock enemies
      stage.enemies = mockEnemies;
    }
    
    // Generate mock NPCs if none exist
    if (stage.npcs.length === 0) {
      const mockNPCs: AINPC[] = [
        {
          id: `npc_${stage.id}_1`,
          name: 'Elder Whisper',
          description: 'An ancient keeper of forest lore and shadow magic.',
          avatar: 'elder',
          role: 'guide',
          dialogue: [
            'Welcome, shadow walker. Few venture this deep into the Whispering Woods.',
            'The shadows here have grown restless since the Blood Moon appeared.',
            'If you seek to restore balance, you must first defeat the corrupted guardians.',
            'Take this knowledge with you: shadows fear not the light, but the truth it reveals.'
          ],
          personality: 'Wise and mysterious',
          aiModel: 'openai'
        },
        {
          id: `npc_${stage.id}_2`,
          name: 'Raven Merchant',
          description: 'A traveling merchant who deals in rare shadow artifacts.',
          avatar: 'merchant',
          role: 'merchant',
          dialogue: [
            'Ah, a customer! Rare to find the living in these parts.',
            'I have wares from across the shadow realms. What catches your eye?',
            'These potions? Made from the essence of moonlight and shadow. Very potent.',
            'Return when you have more shadow tokens. I might have... special items for a discerning collector.'
          ],
          personality: 'Shrewd and knowledgeable',
          aiModel: 'openai',
          services: [
            {
              type: 'shop',
              items: [
                {
                  id: 'health_potion',
                  name: 'Shadow Essence Potion',
                  description: 'Restores 50 health to a shadow',
                  cost: 15,
                  type: 'potion',
                  effect: 'heal_50'
                },
                {
                  id: 'mana_potion',
                  name: 'Moonlight Vial',
                  description: 'Restores 30 mana to a shadow',
                  cost: 12,
                  type: 'potion',
                  effect: 'mana_30'
                }
              ]
            }
          ]
        }
      ];
      
      // Update stage with mock NPCs
      stage.npcs = mockNPCs;
    }
    
    // Add rewards if none exist
    if (stage.rewards.length === 0) {
      stage.rewards = [
        {
          type: 'experience',
          amount: 100
        },
        {
          type: 'shadowTokens',
          amount: 25
        }
      ];
    }
  }, [stage]);

  const handleStartBattle = async (enemy: AIEnemy) => {
    if (!selectedShadowId) {
      toast.error('Select a shadow to battle with');
      return;
    }
    
    setSelectedEnemy(enemy);
    setIsBattleMode(true);
    
    try {
      await startBattle(selectedShadowId, 'pve');
    } catch (error) {
      console.error('Failed to start battle:', error);
      toast.error('Failed to start battle');
      setIsBattleMode(false);
    }
  };

  const handleAttack = async () => {
    if (!currentBattle || currentBattle.currentTurn !== 'player') return;
    
    try {
      await performBattleAction({ type: 'attack' });
      setStageProgress(prev => Math.min(prev + 10, 100));
    } catch (error) {
      console.error('Attack failed:', error);
    }
  };

  const handleSkill = async (skillId: string) => {
    if (!currentBattle || currentBattle.currentTurn !== 'player') return;
    
    try {
      await performBattleAction({ type: 'skill', skillId });
      setStageProgress(prev => Math.min(prev + 15, 100));
    } catch (error) {
      console.error('Skill use failed:', error);
    }
  };

  const handleEndBattle = () => {
    endBattle();
    setIsBattleMode(false);
    
    // If all enemies are defeated, mark stage as complete
    if (stageProgress >= 100) {
      setIsCompleting(true);
      setTimeout(() => {
        onComplete(stage.id);
      }, 2000);
    }
  };

  const handleTalkToNPC = (npc: AINPC) => {
    setSelectedNPC(npc);
    setDialogueIndex(0);
    setSelectedTab('dialogue');
  };

  const handleNextDialogue = () => {
    if (selectedNPC && dialogueIndex < selectedNPC.dialogue.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      // End of dialogue
      setDialogueIndex(0);
      setStageProgress(prev => Math.min(prev + 20, 100));
    }
  };

  const handleCompleteStage = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onComplete(stage.id);
    }, 2000);
  };

  // Render battle interface
  if (isBattleMode && currentBattle) {
    const playerShadow = currentBattle.playerShadow;
    const opponentShadow = currentBattle.opponentShadow;
    const playerHealthPercent = (playerShadow.stats.health / playerShadow.stats.maxHealth) * 100;
    const opponentHealthPercent = (opponentShadow.stats.health / opponentShadow.stats.maxHealth) * 100;
    
    return (
      <div className="space-y-6">
        <Card className="shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-foreground">
                {currentBattle.status === 'finished' 
                  ? (currentBattle.winner === 'player' ? '🎉 Victory!' : '💀 Defeat')
                  : `⚔️ Battle: ${selectedEnemy?.name || 'Enemy'}`
                }
              </CardTitle>
              <CardDescription>
                {stage.name} - {selectedEnemy?.description || 'A powerful foe appears'}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleEndBattle}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentBattle.status === 'finished' ? 'Return' : 'Retreat'}
            </Button>
          </CardHeader>
        </Card>

        {/* Battle Field */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Player Shadow */}
          <Card className="border-primary/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Heart className="w-5 h-5" />
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
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Skull className="w-5 h-5" />
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

        {/* Enemy Dialogue */}
        {selectedEnemy && currentBattle.status !== 'finished' && (
          <Card className="border-border/30 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Skull className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="font-semibold text-red-400">{selectedEnemy.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedEnemy.battleDialogue[Math.floor(Math.random() * selectedEnemy.battleDialogue.length)]}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Panel */}
        {currentBattle.status === 'active' && currentBattle.currentTurn === 'player' && (
          <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-sm">Choose Your Action</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Button 
                  onClick={handleAttack}
                  variant="destructive"
                  className="h-12"
                >
                  <Sword className="w-4 h-4 mr-2" />
                  Attack
                </Button>
                <Button 
                  onClick={() => {}}
                  variant="secondary"
                  className="h-12"
                  disabled
                >
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Defend
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-sm">Skills:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {playerShadow.skills.map((skill) => (
                    <Button
                      key={skill.id}
                      onClick={() => handleSkill(skill.id)}
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
                  <div className="mt-4 text-sm text-muted-foreground">
                    {selectedEnemy?.defeatDialogue[Math.floor(Math.random() * selectedEnemy.defeatDialogue.length)]}
                  </div>
                </div>
              )}
              {currentBattle.winner === 'opponent' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-red-400">Defeat</h3>
                  <p className="text-muted-foreground">
                    Your shadow has been defeated, but the experience will make it stronger.
                  </p>
                </div>
              )}
              <Button onClick={handleEndBattle} variant="mystical" className="mt-4">
                Continue Journey
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Render dialogue interface
  if (selectedTab === 'dialogue' && selectedNPC) {
    return (
      <div className="space-y-6">
        <Card className="shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-foreground">
                {selectedNPC.name}
              </CardTitle>
              <CardDescription>
                {selectedNPC.description}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedTab('npcs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </CardHeader>
        </Card>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-4 flex-1">
                <div className="text-lg font-medium">{selectedNPC.dialogue[dialogueIndex]}</div>
                <Button 
                  onClick={handleNextDialogue} 
                  variant="mystical"
                  className="mt-4"
                >
                  {dialogueIndex < selectedNPC.dialogue.length - 1 ? 'Continue' : 'End Conversation'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedNPC.services && selectedNPC.services.length > 0 && (
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-sm">Available Services</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNPC.services.map((service, index) => (
                <div key={index} className="space-y-3">
                  {service.type === 'shop' && service.items && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.items.map(item => (
                        <Card key={item.id} className="border-border/30 bg-card/30">
                          <CardContent className="p-3 flex justify-between items-center">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              {item.cost}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Render stage detail interface
  return (
    <div className="space-y-6">
      <Card className="shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg" style={{ background: stage.background }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-white">
              {stage.name}
            </CardTitle>
            <CardDescription className="text-white/80">
              {stage.description}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onBack} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Stage Progress</span>
                <span>{stageProgress}%</span>
              </div>
              <Progress value={stageProgress} className="h-2 bg-white/10">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${stageProgress}%` }}
                />
              </Progress>
            </div>
            {stageProgress >= 100 && !stage.isCompleted && (
              <Button 
                variant="mystical" 
                size="sm" 
                onClick={handleCompleteStage}
                disabled={isCompleting}
              >
                {isCompleting ? 'Completing...' : 'Complete Stage'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enemies">Enemies</TabsTrigger>
          <TabsTrigger value="npcs">NPCs</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Stage Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {stage.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <Card className="border-border/30 bg-card/30">
                  <CardContent className="p-4">
                    <Sword className="w-6 h-6 mx-auto text-red-400 mb-2" />
                    <div className="text-sm font-medium">{stage.enemies.length}</div>
                    <div className="text-xs text-muted-foreground">Enemies</div>
                  </CardContent>
                </Card>
                <Card className="border-border/30 bg-card/30">
                  <CardContent className="p-4">
                    <Users className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                    <div className="text-sm font-medium">{stage.npcs.length}</div>
                    <div className="text-xs text-muted-foreground">NPCs</div>
                  </CardContent>
                </Card>
                <Card className="border-border/30 bg-card/30">
                  <CardContent className="p-4">
                    <Trophy className="w-6 h-6 mx-auto text-amber-400 mb-2" />
                    <div className="text-sm font-medium">
                      {stage.rewards.reduce((total, reward) => 
                        reward.type === 'shadowTokens' ? total + (reward.amount || 0) : total, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Tokens</div>
                  </CardContent>
                </Card>
                <Card className="border-border/30 bg-card/30">
                  <CardContent className="p-4">
                    <Sparkles className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                    <div className="text-sm font-medium">
                      {stage.rewards.reduce((total, reward) => 
                        reward.type === 'experience' ? total + (reward.amount || 0) : total, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Your Shadow</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shadows.length === 0 ? (
                    <Card className="col-span-full border-border/30 bg-card/30 p-4 text-center">
                      <p className="text-muted-foreground">
                        You need at least one shadow to explore this stage.
                      </p>
                    </Card>
                  ) : (
                    shadows.map((shadow) => (
                      <ShadowCard
                        key={shadow.id}
                        shadow={shadow}
                        selected={selectedShadowId === shadow.id}
                        onClick={() => setSelectedShadowId(shadow.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="enemies" className="space-y-4">
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Enemies</CardTitle>
            </CardHeader>
            <CardContent>
              {stage.enemies.length === 0 ? (
                <p className="text-muted-foreground text-center">No enemies discovered yet.</p>
              ) : (
                <div className="space-y-4">
                  {stage.enemies.map((enemy) => (
                    <Card key={enemy.id} className="border-blood/30 bg-card/30">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Skull className="w-5 h-5 text-red-400" />
                              <h3 className="font-semibold text-foreground">{enemy.name}</h3>
                              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                                Level {enemy.level}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{enemy.description}</p>
                            <div className="text-xs text-muted-foreground">
                              Personality: {enemy.personality}
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            disabled={!selectedShadowId}
                            onClick={() => handleStartBattle(enemy)}
                          >
                            <Sword className="w-4 h-4 mr-2" />
                            Battle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="npcs" className="space-y-4">
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">NPCs</CardTitle>
            </CardHeader>
            <CardContent>
              {stage.npcs.length === 0 ? (
                <p className="text-muted-foreground text-center">No NPCs discovered yet.</p>
              ) : (
                <div className="space-y-4">
                  {stage.npcs.map((npc) => (
                    <Card key={npc.id} className="border-primary/30 bg-card/30">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold text-foreground">{npc.name}</h3>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 capitalize">
                                {npc.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{npc.description}</p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => handleTalkToNPC(npc)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Talk
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-4">
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Stage Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              {stage.rewards.length === 0 ? (
                <p className="text-muted-foreground text-center">No rewards discovered yet.</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stage.rewards.map((reward, index) => (
                      <Card key={index} className="border-amber-500/30 bg-card/30">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {reward.type === 'experience' && (
                                <Sparkles className="w-5 h-5 text-purple-400" />
                              )}
                              {reward.type === 'shadowTokens' && (
                                <Coins className="w-5 h-5 text-amber-400" />
                              )}
                              {reward.type === 'item' && reward.item && (
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                  <span className="text-blue-400 text-xs">I</span>
                                </div>
                              )}
                              <h3 className="font-semibold text-foreground capitalize">
                                {reward.type === 'experience' ? 'Experience' : 
                                 reward.type === 'shadowTokens' ? 'Shadow Tokens' :
                                 reward.type === 'item' && reward.item ? reward.item.name : 
                                 reward.type}
                              </h3>
                            </div>
                            {reward.type === 'item' && reward.item && (
                              <p className="text-xs text-muted-foreground">{reward.item.description}</p>
                            )}
                          </div>
                          <div className="text-lg font-bold text-amber-400">
                            {reward.amount && `+${reward.amount}`}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Complete the stage by defeating enemies and talking to NPCs to claim these rewards.
                    </p>
                    {stageProgress >= 100 && !stage.isCompleted && (
                      <Button 
                        variant="mystical" 
                        className="mt-4"
                        onClick={handleCompleteStage}
                        disabled={isCompleting}
                      >
                        {isCompleting ? 'Completing...' : 'Complete Stage & Claim Rewards'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};