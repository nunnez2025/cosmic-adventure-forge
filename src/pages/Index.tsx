import { useGameContext } from '@/context/GameContext';
import { AuthPage } from './AuthPage';
import { GamePage } from './GamePage';

const Index = () => {
  const { user, isLoading } = useGameContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-shadow">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-primary font-medium">Loading Shadow Realm...</p>
        </div>
      </div>
    );
  }

  return user ? <GamePage /> : <AuthPage />;
};

export default Index;
