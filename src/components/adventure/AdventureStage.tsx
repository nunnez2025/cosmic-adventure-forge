import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Sword, User, Sparkles } from 'lucide-react';
import { AdventureStage as AdventureStageType, AINPC, AIEnemy } from '@/types/adventure';
import { PokemonBattle } from './PokemonBattle';
import { NPCDialogue } from './NPCDialogue';
import { cn } from '@/lib/utils';

interface AdventureStageProps {
  stage: AdventureStageType;
  onBack: () => void;
  onComplete: () => void;
}

export const AdventureStage: React.FC<AdventureStageProps> = ({
  stage,
  onBack,
  onComplete
}) => {
  const [currentMode, setCurrentMode] = useState<'explore' | 'battle' | 'dialogue'>('explore');
  const [selectedNPC, setSelectedNPC] = useState<AINPC | null>(null);
  const [selectedEnemy, setSelectedEnemy] = useState<AIEnemy | null>(null);
  const [stageNarration, setStageNarration] = useState<string>('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(true);

  useEffect(() => {
    generateStageContent();
  }, [stage]);

  const generateStageContent = async () => {
    setIsGeneratingContent(true);
    
    // Mock AI-generated content for now
    setTimeout(() => {
      setStageNarration(
        `As you step into the ${stage.name}, the air shimmers with ancient magic. ` +
        `Shadows dance between the trees, whispering secrets of times long past. ` +
        `The very ground beneath your feet pulses with mystical energy, and you can sense ` +
        `that this place holds both great danger and incredible power.`
      );
      setIsGeneratingContent(false);
    }, 2000);
  };

  const handleNPCInteraction = (npc: AINPC) => {
    setSelectedNPC(npc);
    setCurrentMode('dialogue');
  };

  const handleEnemyEncounter = (enemy: AIEnemy) => {
    setSelectedEnemy(enemy);
    setCurrentMode('battle');
  };

  const handleBattleComplete = (victory: boolean) => {
    setCurrentMode('explore');
    setSelectedEnemy(null);
    if (victory) {
      // Handle rewards, XP, etc.
    }
  };

  const handleDialogueComplete = () => {
    setCurrentMode('explore');
    setSelectedNPC(null);
  };

  if (currentMode === 'battle' && selectedEnemy) {
    return (
      <PokemonBattle
        enemy={selectedEnemy}
        onComplete={handleBattleComplete}
        onBack={() => setCurrentMode('explore')}
      />
    );
  }

  if (currentMode === 'dialogue' && selectedNPC) {
    return (
      <NPCDialogue
        npc={selectedNPC}
        onComplete={handleDialogueComplete}
        onBack={() => setCurrentMode('explore')}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: stage.background }}
      />
      
      {/* Animated overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={onBack}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              {stage.name}
            </h1>
            <p className="text-white/80 drop-shadow">
              {stage.description}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Story Panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Adventure Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGeneratingContent ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      AI is weaving your story...
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  </div>
                ) : (
                  <p className="text-foreground leading-relaxed">
                    {stageNarration}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Exploration Actions */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105",
                  "bg-gradient-to-br from-green-500/20 to-green-700/20",
                  "border-green-500/30 hover:border-green-400/50 hover:shadow-glow"
                )}
                onClick={() => {
                  // Mock exploration
                  console.log('Exploring for items...');
                }}
              >
                <CardContent className="p-4 text-center space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-green-400" />
                  <h3 className="font-semibold text-green-100">Explore</h3>
                  <p className="text-xs text-green-200/80">
                    Search for hidden treasures and secrets
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105",
                  "bg-gradient-to-br from-blue-500/20 to-blue-700/20",
                  "border-blue-500/30 hover:border-blue-400/50 hover:shadow-glow"
                )}
                onClick={() => {
                  // Mock shadow summoning
                  console.log('Attempting to summon shadows...');
                }}
              >
                <CardContent className="p-4 text-center space-y-2">
                  <User className="w-8 h-8 mx-auto text-blue-400" />
                  <h3 className="font-semibold text-blue-100">Summon</h3>
                  <p className="text-xs text-blue-200/80">
                    Call forth new shadows from the realm
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* NPCs */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Characters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stage.npcs.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No characters here yet...</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => console.log('Generate NPCs')}
                    >
                      Generate Characters
                    </Button>
                  </div>
                ) : (
                  stage.npcs.map(npc => (
                    <Button
                      key={npc.id}
                      variant="outline"
                      className="w-full justify-start p-3 h-auto"
                      onClick={() => handleNPCInteraction(npc)}
                    >
                      <div className="text-left space-y-1">
                        <div className="font-medium">{npc.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {npc.role}
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Enemies */}
            <Card className="bg-card/80 backdrop-blur-sm border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sword className="w-5 h-5 text-red-400" />
                  Enemies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stage.enemies.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No enemies detected...</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => console.log('Generate enemies')}
                    >
                      Generate Enemies
                    </Button>
                  </div>
                ) : (
                  stage.enemies.map(enemy => (
                    <Button
                      key={enemy.id}
                      variant="outline"
                      className="w-full justify-start p-3 h-auto border-red-500/30 text-red-100 hover:bg-red-500/10"
                      onClick={() => handleEnemyEncounter(enemy)}
                    >
                      <div className="text-left space-y-1">
                        <div className="font-medium">{enemy.name}</div>
                        <div className="text-xs text-red-300/70">
                          Level {enemy.level}
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Stage Progress */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={onComplete}
                  className="w-full"
                  disabled={true}
                >
                  Complete Stage
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};