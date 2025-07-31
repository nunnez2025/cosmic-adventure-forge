import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Sword, Users, Trophy, Lock } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { AdventureStage, AdventureProgress } from '@/types/adventure';
import { cn } from '@/lib/utils';
import { AdventureStageDetail } from './AdventureStageDetail';
import { toast } from 'sonner';

interface AdventureMapProps {
  onStageSelect: (stage: AdventureStage) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({ onStageSelect }) => {
  const { user } = useGameContext();
  const [stages, setStages] = useState<AdventureStage[]>([]);
  const [progress, setProgress] = useState<AdventureProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStage, setSelectedStage] = useState<AdventureStage | null>(null);

  // Mock initial stages - later will be AI generated
  useEffect(() => {
    const initialStages: AdventureStage[] = [
      {
        id: 'mystical_forest_1',
        name: 'Whispering Woods',
        description: 'Ancient forest where shadows first learned to dance with moonlight',
        background: 'linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 50%, #1a2a3a 100%)',
        enemies: [],
        npcs: [],
        rewards: [],
        isCompleted: false
      },
      {
        id: 'shadow_caverns_1',
        name: 'Echoing Caverns',
        description: 'Deep underground caves where shadow magic resonates',
        background: 'linear-gradient(135deg, #2a1a3a 0%, #3a2a5a 50%, #1a1a2a 100%)',
        enemies: [],
        npcs: [],
        rewards: [],
        isCompleted: false,
        unlockRequirements: ['mystical_forest_1']
      },
      {
        id: 'blood_moon_peaks',
        name: 'Blood Moon Peaks',
        description: 'Treacherous mountains where the blood moon rises',
        background: 'linear-gradient(135deg, #3a1a1a 0%, #5a2a2a 50%, #2a1a3a 100%)',
        enemies: [],
        npcs: [],
        rewards: [],
        isCompleted: false,
        unlockRequirements: ['shadow_caverns_1']
      }
    ];

    // Load progress from localStorage if available
    const savedProgress = localStorage.getItem('shadowmage_adventure_progress');
    const savedStages = localStorage.getItem('shadowmage_adventure_stages');
    
    if (savedProgress && savedStages) {
      setProgress(JSON.parse(savedProgress));
      setStages(JSON.parse(savedStages));
    } else {
      setStages(initialStages);
      setProgress({
        currentStage: 'mystical_forest_1',
        completedStages: [],
        unlockedStages: ['mystical_forest_1'],
        totalExperience: 0,
        shadowsDiscovered: 0,
        battlesWon: 0,
        achievements: []
      });
    }
  }, []);

  // Save progress and stages to localStorage when they change
  useEffect(() => {
    if (progress) {
      localStorage.setItem('shadowmage_adventure_progress', JSON.stringify(progress));
    }
    if (stages.length > 0) {
      localStorage.setItem('shadowmage_adventure_stages', JSON.stringify(stages));
    }
  }, [progress, stages]);

  const isStageUnlocked = (stage: AdventureStage): boolean => {
    if (!stage.unlockRequirements) return true;
    return stage.unlockRequirements.every(req => 
      progress?.completedStages.includes(req)
    );
  };

  const generateAIStage = async (baseStage: AdventureStage) => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Set the selected stage to enter it
    const stageToEnter = stages.find(s => s.id === baseStage.id);
    if (stageToEnter) {
      setSelectedStage(stageToEnter);
    }
    
    setIsGenerating(false);
  };

  const handleStageComplete = (stageId: string) => {
    // Find the stage
    const completedStage = stages.find(s => s.id === stageId);
    if (!completedStage) return;
    
    // Update stage completion status
    setStages(prev => prev.map(s => 
      s.id === stageId ? { ...s, isCompleted: true } : s
    ));
    
    // Update progress
    if (progress) {
      const updatedProgress = { ...progress };
      
      // Add to completed stages if not already there
      if (!updatedProgress.completedStages.includes(stageId)) {
        updatedProgress.completedStages.push(stageId);
      }
      
      // Unlock next stages
      const nextStages = stages.filter(s => 
        s.unlockRequirements?.some(req => req === stageId) &&
        !updatedProgress.unlockedStages.includes(s.id)
      );
      
      nextStages.forEach(s => {
        updatedProgress.unlockedStages.push(s.id);
      });
      
      // Update current stage to the next unlocked stage
      if (nextStages.length > 0) {
        updatedProgress.currentStage = nextStages[0].id;
      }
      
      // Add rewards
      const experienceReward = completedStage.rewards
        .filter(r => r.type === 'experience')
        .reduce((sum, r) => sum + (r.amount || 0), 0);
      
      updatedProgress.totalExperience += experienceReward;
      updatedProgress.battlesWon += 2; // Assume 2 battles won per stage
      updatedProgress.shadowsDiscovered += 1; // Assume 1 new shadow discovered
      
      setProgress(updatedProgress);
      
      // Show completion message
      toast.success(`Stage completed! Unlocked ${nextStages.length} new areas.`);
    }
    
    // Return to map
    setSelectedStage(null);
  };

  // If a stage is selected, show the stage detail view
  if (selectedStage) {
    return (
      <AdventureStageDetail 
        stage={selectedStage} 
        onBack={() => setSelectedStage(null)}
        onComplete={handleStageComplete}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gradient bg-gradient-primary bg-clip-text text-transparent">
          Shadow Realm Adventure
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Embark on an epic journey through mystical lands. Each stage is dynamically generated by AI, 
          creating unique encounters, stories, and challenges.
        </p>
      </div>

      {progress && (
        <Card className="bg-gradient-primary border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <Trophy className="w-8 h-8 mx-auto text-primary-glow" />
                <div className="text-2xl font-bold">{progress.completedStages.length}</div>
                <div className="text-sm text-primary-foreground/80">Stages Complete</div>
              </div>
              <div className="space-y-2">
                <Sword className="w-8 h-8 mx-auto text-primary-glow" />
                <div className="text-2xl font-bold">{progress.battlesWon}</div>
                <div className="text-sm text-primary-foreground/80">Battles Won</div>
              </div>
              <div className="space-y-2">
                <Users className="w-8 h-8 mx-auto text-primary-glow" />
                <div className="text-2xl font-bold">{progress.shadowsDiscovered}</div>
                <div className="text-sm text-primary-foreground/80">Shadows Found</div>
              </div>
              <div className="space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-primary-glow" />
                <div className="text-2xl font-bold">{progress.totalExperience}</div>
                <div className="text-sm text-primary-foreground/80">Total XP</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stages.map((stage, index) => {
          const unlocked = isStageUnlocked(stage);
          const completed = progress?.completedStages.includes(stage.id);
          const current = progress?.currentStage === stage.id;

          return (
            <Card 
              key={stage.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300 cursor-pointer",
                "hover:scale-105 hover:shadow-mystical",
                unlocked ? "opacity-100" : "opacity-50",
                current && "ring-2 ring-primary shadow-glow",
                completed && "border-green-500/50"
              )}
              style={{ background: stage.background }}
              onClick={() => unlocked && setSelectedStage(stage)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-bold text-white">{stage.name}</h3>
                    <p className="text-sm text-white/80 line-clamp-3">
                      {stage.description}
                    </p>
                  </div>
                  {!unlocked && (
                    <Lock className="w-6 h-6 text-white/50 flex-shrink-0" />
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {completed && (
                    <Badge variant="outline" className="bg-green-500/20 border-green-500 text-green-400">
                      Completed
                    </Badge>
                  )}
                  {current && (
                    <Badge variant="outline" className="bg-primary/20 border-primary text-primary-glow">
                      Current
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                    Stage {index + 1}
                  </Badge>
                </div>

                {unlocked && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      generateAIStage(stage);
                    }}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Enter Stage'}
                  </Button>
                )}

                {stage.unlockRequirements && !unlocked && (
                  <div className="text-xs text-white/60 space-y-1">
                    <div>Requires completion of:</div>
                    {stage.unlockRequirements.map(req => (
                      <div key={req} className="text-white/40">
                        • {stages.find(s => s.id === req)?.name || req}
                      </div>
                    ))}
                  </div>
                )}

                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Generation Status */}
      {isGenerating && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-primary">AI is crafting your adventure...</p>
              <p className="text-xs text-muted-foreground">
                Generating unique enemies, NPCs, dialogue, and scenarios
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};