import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/context/GameContext';
import { 
  Home, 
  Sparkles, 
  Sword, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Crown,
  Coins
} from 'lucide-react';
import shadowmageLogo from '@/assets/shadowmage-logo.png';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { user, logout } = useGameContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'shadows', label: 'My Shadows', icon: Users },
    { id: 'forge', label: 'Shadow Forge', icon: Sparkles },
    { id: 'battle', label: 'Battle Arena', icon: Sword },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <Card className="hidden md:block sticky top-4 z-50 mx-4 shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
        <div className="flex items-center justify-between p-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img 
              src={shadowmageLogo} 
              alt="ShadowMage" 
              className="w-10 h-10 mystical-glow rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ShadowMage
              </h1>
              <p className="text-xs text-muted-foreground">Blood & Moon</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentTab === item.id ? 'mystical' : 'ghost'}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{user.username}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Crown className="w-3 h-3" />
                    Level {user.level}
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  {user.shadowTokens}
                </Badge>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </Card>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <Card className="sticky top-0 z-50 mx-4 mt-4 shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img 
                src={shadowmageLogo} 
                alt="ShadowMage" 
                className="w-8 h-8 mystical-glow rounded-full"
              />
              <div>
                <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                  ShadowMage
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Coins className="w-3 h-3" />
                  {user.shadowTokens}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <Card className="mx-4 mt-2 shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
            <div className="p-4 space-y-4">
              {/* User Info */}
              {user && (
                <div className="text-center pb-4 border-b border-border/50">
                  <div className="text-sm font-medium text-foreground">{user.username}</div>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-1">
                    <Crown className="w-3 h-3" />
                    Level {user.level}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentTab === item.id ? 'mystical' : 'ghost'}
                      size="sm"
                      onClick={() => handleTabChange(item.id)}
                      className="w-full justify-start flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="pt-4 border-t border-border/50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-full justify-start flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};