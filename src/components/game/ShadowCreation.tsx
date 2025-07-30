import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameContext } from '@/context/GameContext';
import { Shadow } from '@/types/game';
import { toast } from 'sonner';
import { Sword, Sparkles, Zap, Shield, Coins } from 'lucide-react';

const classDescriptions = {
  warrior: {
    icon: Sword,
    title: 'Shadow Warrior',
    description: 'Masters of melee combat with high health and defense. Specializes in close-range devastating attacks.',
    stats: 'High Health & Defense, Moderate Attack'
  },
  mage: {
    icon: Sparkles,
    title: 'Shadow Mage',
    description: 'Wielders of arcane magic with powerful spells. High mana pool and magical damage.',
    stats: 'High Mana & Magic Attack, Low Defense'
  },
  archer: {
    icon: Zap,
    title: 'Shadow Archer',
    description: 'Precise ranged combatants with high speed and accuracy. Masters of hit-and-run tactics.',
    stats: 'High Speed & Precision, Moderate Health'
  },
  assassin: {
    icon: Shield,
    title: 'Shadow Assassin',
    description: 'Stealth specialists with critical strikes and debuffs. Highest damage potential.',
    stats: 'Highest Attack & Speed, Lowest Health'
  }
};

export const ShadowCreation: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<Shadow['class'] | ''>('');
  const { createShadow, isLoading, user } = useGameContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a name for your shadow');
      return;
    }

    if (!selectedClass) {
      toast.error('Please select a class for your shadow');
      return;
    }

    if (!user || user.shadowTokens < 20) {
      toast.error('Insufficient Shadow Tokens. You need 20 tokens to create a shadow.');
      return;
    }

    try {
      await createShadow(name.trim(), selectedClass);
      setName('');
      setSelectedClass('');
    } catch (error) {
      toast.error('Failed to create shadow. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Forge a New Shadow
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Summon a loyal shadow companion to fight alongside you in the realm
        </CardDescription>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Coins className="w-4 h-4" />
          <span>Cost: 20 Shadow Tokens</span>
          <span>•</span>
          <span>Available: {user?.shadowTokens || 0}</span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="shadowName" className="text-foreground">Shadow Name</Label>
            <Input
              id="shadowName"
              type="text"
              placeholder="Enter your shadow's name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20"
              disabled={isLoading}
              maxLength={20}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">Shadow Class</Label>
            <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value as Shadow['class'])}>
              <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Choose a class for your shadow" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/50">
                {Object.entries(classDescriptions).map(([key, classInfo]) => (
                  <SelectItem key={key} value={key} className="focus:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <classInfo.icon className="w-4 h-4" />
                      {classInfo.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClass && (
            <Card className="border-primary/20 bg-accent/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  {(() => {
                    const IconComponent = classDescriptions[selectedClass].icon;
                    return <IconComponent className="w-6 h-6 text-primary mt-1" />;
                  })()}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      {classDescriptions[selectedClass].title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {classDescriptions[selectedClass].description}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {classDescriptions[selectedClass].stats}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            variant="mystical"
            disabled={isLoading || !user || user.shadowTokens < 20}
          >
            {isLoading ? 'Summoning Shadow...' : 'Forge Shadow'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Each shadow is unique with randomized rarity and stats. Higher rarity shadows have enhanced abilities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};