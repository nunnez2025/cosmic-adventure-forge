import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Dashboard } from '@/components/game/Dashboard';
import { ShadowManagement } from '@/components/game/ShadowManagement';
import { ShadowCreation } from '@/components/game/ShadowCreation';
import { BattleArena } from '@/components/game/BattleArena';

export const GamePage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'shadows':
        return <ShadowManagement />;
      case 'forge':
        return <ShadowCreation />;
      case 'battle':
        return <BattleArena />;
      default:
        return <Dashboard />;
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