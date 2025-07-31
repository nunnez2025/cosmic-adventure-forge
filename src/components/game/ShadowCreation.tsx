import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameContext } from '@/context/GameContext';
import { Shadow } from '@/types/game';
import { toast } from 'sonner';
import { Sword, Sparkles, Zap, Shield, Coins, Image as ImageIcon } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { generateShadowImageUrl } from '@/lib/imageApi';

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

const rarityOptions = [
  { value: 'common', label: 'Common', chance: '50%', color: 'text-gray-400' },
  { value: 'rare', label: 'Rare', chance: '30%', color: 'text-blue-400' },
  { value: 'epic', label: 'Epic', chance: '15%', color: 'text-purple-400' },
  { value: 'legendary', label: 'Legendary', chance: '5%', color: 'text-amber-400' }
];

export const ShadowCreation: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<Shadow['class'] | ''>('');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { createShadow, isLoading, user } = useGameContext();

  // Generate preview image when name and class are selected
  useEffect(() => {
    if (name && selectedClass) {
      // Use 'rare' as the preview rarity to not spoil the actual rarity
      const imageUrl = generateShadowImageUrl(name, selectedClass, 'rare');
      setPreviewImageUrl(imageUrl);
      setImageError(false);
    } else {
      setPreviewImageUrl(null);
    }
  }, [name, selectedClass]);

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
      setPreviewImageUrl(null);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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

              <div className="space-y-2">
                <Label className="text-foreground">Rarity Chances</Label>
                <div className="grid grid-cols-2 gap-2">
                  {rarityOptions.map((rarity) => (
                    <div key={rarity.value} className="flex items-center justify-between p-2 rounded-md bg-accent/10 border border-border/30">
                      <span className={`text-sm font-medium ${rarity.color}`}>{rarity.label}</span>
                      <span className="text-xs text-muted-foreground">{rarity.chance}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="mystical"
                disabled={isLoading || !user || user.shadowTokens < 20}
              >
                {isLoading ? 'Summoning Shadow...' : 'Forge Shadow'}
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Shadow Preview</h3>
            
            {/* Preview Image */}
            {previewImageUrl && !imageError ? (
              <AspectRatio ratio={1} className="overflow-hidden rounded-md bg-accent/20 shadow-mystical">
                <img 
                  src={previewImageUrl} 
                  alt="Shadow Preview" 
                  className="object-cover w-full h-full transition-all mystical-glow"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              </AspectRatio>
            ) : (
              <div className="aspect-square rounded-md bg-accent/20 flex items-center justify-center shadow-mystical">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/40" />
                  <span className="text-sm text-muted-foreground mt-4 block">
                    {!name || !selectedClass 
                      ? 'Enter name and select class to see preview' 
                      : 'Preview image will appear here'}
                  </span>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Each shadow is unique with randomized rarity and stats. Higher rarity shadows have enhanced abilities.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                The actual shadow may look different based on its final rarity.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};