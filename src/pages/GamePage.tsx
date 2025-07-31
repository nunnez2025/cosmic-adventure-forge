import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ShadowManagement } from '@/components/game/ShadowManagement';
import { ShadowCreation } from '@/components/game/ShadowCreation';
import { BattleArena } from '@/components/game/BattleArena';
import { AdventureMap } from '@/components/adventure/AdventureMap';
import { AdventureStage } from '@/types/adventure';
import { toast } from 'sonner';

export const GamePage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('adventure');

  const handleStageSelect = (stage: AdventureStage) => {
    // This function is now handled internally in the AdventureMap component
    // but we keep it here for future expansion
    console.log('Stage selected:', stage.name);
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'adventure':
        return <AdventureMap onStageSelect={handleStageSelect} />;
      case 'shadows':
        return <ShadowManagement />;
      case 'forge':
        return <ShadowCreation />;
      case 'battle':
        return <BattleArena />;
      default:
        return <AdventureMap onStageSelect={handleStageSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-shadow">
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />
      <main className="container mx-auto px-4 py-6">
        {renderCurrentTab()}
      </main>
    </div>
  );
};