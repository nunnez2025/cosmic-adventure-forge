import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import shadowmageLogo from '@/assets/shadowmage-logo.png';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useGameContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    await register(username, email, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <img 
            src={shadowmageLogo} 
            alt="ShadowMage Logo" 
            className="w-20 h-20 mystical-glow rounded-full"
          />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Join the Shadow Realm
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Forge your legend as a powerful Shadow Mage. The realm needs you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">Shadow Name</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose your shadow name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@shadowrealm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            variant="mystical"
            disabled={isLoading}
          >
            {isLoading ? 'Forging destiny...' : 'Join the Realm'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already a Shadow Mage?{' '}
            <button
              onClick={onToggleMode}
              className="text-primary hover:text-primary-glow underline transition-colors"
            >
              Return to your realm
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};