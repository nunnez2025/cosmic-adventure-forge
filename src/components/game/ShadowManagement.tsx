import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameContext } from '@/context/GameContext';
import { ShadowCard } from './ShadowCard';
import { Shadow } from '@/types/game';
import { Search, Filter, Sparkles } from 'lucide-react';

export const ShadowManagement: React.FC = () => {
  const { getShadows } = useGameContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('level');

  const shadows = getShadows();

  // Filter and sort shadows
  const filteredShadows = shadows
    .filter(shadow => {
      const matchesSearch = shadow.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = filterClass === 'all' || shadow.class === filterClass;
      const matchesRarity = filterRarity === 'all' || shadow.rarity === filterRarity;
      return matchesSearch && matchesClass && matchesRarity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return b.level - a.level;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'class':
          return a.class.localeCompare(b.class);
        default:
          return 0;
      }
    });

  const shadowStats = {
    total: shadows.length,
    legendary: shadows.filter(s => s.rarity === 'legendary').length,
    epic: shadows.filter(s => s.rarity === 'epic').length,
    rare: shadows.filter(s => s.rarity === 'rare').length,
    common: shadows.filter(s => s.rarity === 'common').length,
    maxLevel: shadows.length > 0 ? Math.max(...shadows.map(s => s.level)) : 0,
    totalLevels: shadows.reduce((sum, s) => sum + s.level, 0),
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Shadow Management
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage and view your collection of loyal shadow companions
          </CardDescription>
        </CardHeader>
      </Card>

      {shadows.length === 0 ? (
        <Card className="text-center p-8 border-border/50 bg-card/50">
          <CardContent className="space-y-4">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Shadows Yet</h3>
              <p className="text-muted-foreground mb-4">
                Your shadow realm awaits its first inhabitant. Forge your first shadow companion to begin your journey.
              </p>
              <p className="text-sm text-muted-foreground">
                Visit the Shadow Forge to create your first loyal companion.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Collection Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card className="border-border/30 bg-card/50 text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-primary">{shadowStats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card className="border-amber-500/30 bg-amber-500/10 text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-amber-400">{shadowStats.legendary}</div>
                <div className="text-xs text-muted-foreground">Legendary</div>
              </CardContent>
            </Card>
            <Card className="border-purple-500/30 bg-purple-500/10 text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-purple-400">{shadowStats.epic}</div>
                <div className="text-xs text-muted-foreground">Epic</div>
              </CardContent>
            </Card>
            <Card className="border-blue-500/30 bg-blue-500/10 text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-blue-400">{shadowStats.rare}</div>
                <div className="text-xs text-muted-foreground">Rare</div>
              </CardContent>
            </Card>
            <Card className="border-gray-500/30 bg-gray-500/10 text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-gray-400">{shadowStats.common}</div>
                <div className="text-xs text-muted-foreground">Common</div>
              </CardContent>
            </Card>
            <Card className="border-green-500/30 bg-green-500/10 text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-400">{shadowStats.maxLevel}</div>
                <div className="text-xs text-muted-foreground">Max Level</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-border/30 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search shadows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input/50 border-border/50 focus:border-primary"
                  />
                </div>

                {/* Class Filter */}
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="warrior">Warrior</SelectItem>
                    <SelectItem value="mage">Mage</SelectItem>
                    <SelectItem value="archer">Archer</SelectItem>
                    <SelectItem value="assassin">Assassin</SelectItem>
                  </SelectContent>
                </Select>

                {/* Rarity Filter */}
                <Select value={filterRarity} onValueChange={setFilterRarity}>
                  <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder="Filter by rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="level">Level (High to Low)</SelectItem>
                    <SelectItem value="name">Name (A to Z)</SelectItem>
                    <SelectItem value="rarity">Rarity (High to Low)</SelectItem>
                    <SelectItem value="class">Class (A to Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredShadows.length !== shadows.length && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredShadows.length} of {shadows.length} shadows
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shadow Grid */}
          {filteredShadows.length === 0 ? (
            <Card className="text-center p-8 border-border/50 bg-card/50">
              <CardContent>
                <p className="text-muted-foreground">
                  No shadows match your current filters. Try adjusting your search criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterClass('all');
                    setFilterRarity('all');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShadows.map((shadow) => (
                <ShadowCard key={shadow.id} shadow={shadow} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};