import { Shadow } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sword, Shield, Zap, Heart, Sparkles } from 'lucide-react';

interface ShadowCardProps {
  shadow: Shadow;
  onClick?: () => void;
  selected?: boolean;
}

const rarityColors = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  epic: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  legendary: 'bg-amber-500/20 text-amber-400 border-amber-500/50'
};

const classIcons = {
  warrior: Sword,
  mage: Sparkles,
  archer: Zap,
  assassin: Shield
};

export const ShadowCard: React.FC<ShadowCardProps> = ({ shadow, onClick, selected = false }) => {
  const ClassIcon = classIcons[shadow.class];
  const healthPercentage = (shadow.stats.health / shadow.stats.maxHealth) * 100;
  const manaPercentage = (shadow.stats.mana / shadow.stats.maxMana) * 100;
  const experienceToNext = shadow.level * 100;
  const expPercentage = (shadow.experience / experienceToNext) * 100;

  return (
    <Card 
      className={`transition-all duration-300 cursor-pointer hover:scale-105 ${
        selected 
          ? 'ring-2 ring-primary shadow-mystical border-primary' 
          : 'hover:shadow-mystical border-border/50'
      } bg-card/80 backdrop-blur-sm`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <ClassIcon className="w-5 h-5" />
            {shadow.name}
          </CardTitle>
          <Badge className={`${rarityColors[shadow.rarity]} font-semibold`}>
            {shadow.rarity}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Level {shadow.level}</span>
          <span className="capitalize">{shadow.class}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-red-400">
              <Heart className="w-4 h-4" />
              Health
            </span>
            <span>{shadow.stats.health}/{shadow.stats.maxHealth}</span>
          </div>
          <Progress value={healthPercentage} className="h-2 bg-muted">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-300"
              style={{ width: `${healthPercentage}%` }}
            />
          </Progress>
        </div>

        {/* Mana Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-blue-400">
              <Sparkles className="w-4 h-4" />
              Mana
            </span>
            <span>{shadow.stats.mana}/{shadow.stats.maxMana}</span>
          </div>
          <Progress value={manaPercentage} className="h-2 bg-muted">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
              style={{ width: `${manaPercentage}%` }}
            />
          </Progress>
        </div>

        {/* Experience Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-primary">Experience</span>
            <span>{shadow.experience}/{experienceToNext}</span>
          </div>
          <Progress value={expPercentage} className="h-2 bg-muted">
            <div 
              className="h-full bg-gradient-primary transition-all duration-300"
              style={{ width: `${expPercentage}%` }}
            />
          </Progress>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Attack:</span>
            <span className="text-red-400 font-semibold">{shadow.stats.attack}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Defense:</span>
            <span className="text-blue-400 font-semibold">{shadow.stats.defense}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Speed:</span>
            <span className="text-green-400 font-semibold">{shadow.stats.speed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Skills:</span>
            <span className="text-primary font-semibold">{shadow.skills.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};