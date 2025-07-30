import { useState, useEffect } from "react";
import { useGameContext } from '@/context/GameContext';
import { GamePage } from './GamePage';

const Index = () => {
  const { user, login, isLoading } = useGameContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeGame = async () => {
      if (!user && !isLoading) {
        await login();
      }
      setIsInitialized(true);
    };

    initializeGame();
  }, [user, login, isLoading]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-shadow">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-primary font-medium">Entering the Shadow Realm...</p>
        </div>
      </div>
    );
  }

  return <GamePage />;
};

export default Index;
