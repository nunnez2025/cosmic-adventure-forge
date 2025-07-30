import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGameContext } from '@/context/GameContext';
import { Crown, Coins, Users, Sword, Sparkles, Trophy } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, getShadows } = useGameContext();
  const shadows = getShadows();

  if (!user) return null;

  const experienceToNext = user.level * 1000;
  const expPercentage = (user.experience / experienceToNext) * 100;

  const shadowsByRarity = shadows.reduce((acc, shadow) => {
    acc[shadow.rarity] = (acc[shadow.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalShadowLevel = shadows.reduce((sum, shadow) => sum + shadow.level, 0);
  const averageShadowLevel = shadows.length > 0 ? Math.round(totalShadowLevel / shadows.length) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="shadow-mystical border-primary/30 bg-gradient-shadow backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome, {user.username}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Master of the Shadow Realm • Level {user.level} Shadow Mage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary">Experience Progress</span>
              <span>{user.experience}/{experienceToNext}</span>
            </div>
            <Progress value={expPercentage} className="h-3">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${expPercentage}%` }}
              />
            </Progress>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level Card */}
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-mystical transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{user.level}</p>
                <p className="text-xs text-muted-foreground">Mage Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shadow Tokens */}
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-mystical transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Coins className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-foreground">{user.shadowTokens}</p>
                <p className="text-xs text-muted-foreground">Shadow Tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Shadows */}
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-mystical transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-foreground">{shadows.length}</p>
                <p className="text-xs text-muted-foreground">Shadows</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Shadow Level */}
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-mystical transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-foreground">{averageShadowLevel}</p>
                <p className="text-xs text-muted-foreground">Avg Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shadow Collection Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shadow Rarity Distribution */}
        <Card className="border-border/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Shadow Collection
            </CardTitle>
            <CardDescription>Your shadows by rarity</CardDescription>
          </CardHeader>
          <CardContent>
            {shadows.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No shadows in your collection yet. Visit the Shadow Forge to create your first companion!
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries({
                  legendary: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/50', count: shadowsByRarity.legendary || 0 },
                  epic: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/50', count: shadowsByRarity.epic || 0 },
                  rare: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', count: shadowsByRarity.rare || 0 },
                  common: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/50', count: shadowsByRarity.common || 0 }
                }).map(([rarity, data]) => (
                  <div key={rarity} className="flex items-center justify-between">
                    <Badge className={`${data.color} font-semibold capitalize`}>
                      {rarity}
                    </Badge>
                    <span className="text-foreground font-medium">{data.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-primary" />
              Realm Activities
            </CardTitle>
            <CardDescription>Your recent accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 border border-border/50">
                <Crown className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Joined the Shadow Realm</p>
                  <p className="text-xs text-muted-foreground">
                    Welcome to ShadowMage: Blood & Moon
                  </p>
                </div>
              </div>
              
              {shadows.length > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 border border-border/50">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">First Shadow Created</p>
                    <p className="text-xs text-muted-foreground">
                      {shadows[0].name} the {shadows[0].class}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="text-center text-muted-foreground text-sm py-4">
                Complete battles and activities to see more achievements here
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to enhance your shadow realm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border border-border/50 hover:bg-accent/20 transition-colors">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-foreground">Create Shadow</h3>
              <p className="text-xs text-muted-foreground">Forge a new companion</p>
            </div>
            
            <div className="text-center p-4 rounded-lg border border-border/50 hover:bg-accent/20 transition-colors">
              <Sword className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h3 className="font-medium text-foreground">Battle Arena</h3>
              <p className="text-xs text-muted-foreground">Test your shadows in combat</p>
            </div>
            
            <div className="text-center p-4 rounded-lg border border-border/50 hover:bg-accent/20 transition-colors">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-medium text-foreground">Manage Shadows</h3>
              <p className="text-xs text-muted-foreground">View and upgrade your collection</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};