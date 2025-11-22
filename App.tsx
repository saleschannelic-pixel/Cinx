import React, { useState, useEffect } from 'react';
import { AppView, UserProfile } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import BreathingTool from './components/BreathingTool';
import StatsAndHealth from './components/StatsAndHealth';
import AppBlockerChallenge from './components/AppBlockerChallenge';
import { LayoutDashboard, MessageSquare, BarChart2, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Mock hydration of user
  useEffect(() => {
    const savedUser = localStorage.getItem('vapefree_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView(AppView.DASHBOARD);
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('vapefree_user', JSON.stringify(profile));
    setCurrentView(AppView.DASHBOARD);
  };
  
  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('vapefree_user', JSON.stringify(updatedUser));
  };

  // Navigation Bar Component
  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 pb-safe px-6 py-3 flex justify-between items-center z-40">
      <button 
        onClick={() => setCurrentView(AppView.DASHBOARD)}
        className={`flex flex-col items-center gap-1 ${currentView === AppView.DASHBOARD ? 'text-primary' : 'text-gray-500'}`}
      >
        <LayoutDashboard size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button 
        onClick={() => setCurrentView(AppView.STATS)}
        className={`flex flex-col items-center gap-1 ${currentView === AppView.STATS ? 'text-primary' : 'text-gray-500'}`}
      >
        <BarChart2 size={24} />
        <span className="text-[10px] font-medium">Progress</span>
      </button>
      <div className="-mt-12">
         <button 
            onClick={() => setCurrentView(AppView.CHAT)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(187,134,252,0.5)] border-4 border-[#121212]"
         >
            <MessageSquare size={28} className="text-black fill-current" />
         </button>
      </div>
       <button 
        onClick={() => setCurrentView(AppView.BREATHING)}
        className={`flex flex-col items-center gap-1 ${currentView === AppView.BREATHING ? 'text-primary' : 'text-gray-500'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
        <span className="text-[10px] font-medium">Health</span>
      </button>
      <button 
        onClick={() => setCurrentView(AppView.PROFILE)}
        className={`flex flex-col items-center gap-1 ${currentView === AppView.PROFILE ? 'text-primary' : 'text-gray-500'}`}
      >
        <User size={24} />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );

  // Render Main View logic
  const renderContent = () => {
    if (!user && currentView !== AppView.ONBOARDING) return null;

    switch (currentView) {
      case AppView.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case AppView.DASHBOARD:
        return <Dashboard user={user!} onChangeView={setCurrentView} />;
      case AppView.CHAT:
        return (
          <div className="h-screen fixed inset-0 z-50">
            <AICoach onClose={() => setCurrentView(AppView.DASHBOARD)} />
          </div>
        );
      case AppView.BREATHING:
        return (
            <div className="h-screen fixed inset-0 z-50">
                <BreathingTool onClose={() => setCurrentView(AppView.DASHBOARD)} />
            </div>
        );
      case AppView.APP_BLOCKER:
        return (
            <AppBlockerChallenge 
                user={user!} 
                onClose={() => setCurrentView(AppView.DASHBOARD)}
                onUpdateUser={updateUser} 
            />
        );
      case AppView.STATS:
        return <StatsAndHealth user={user!} onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.PROFILE:
        return (
            <div className="p-6 space-y-4">
                 <h2 className="text-2xl font-bold text-white">Settings</h2>
                 <div className="bg-surface p-4 rounded-xl border border-gray-800">
                    <p className="text-gray-400">Name</p>
                    <p className="text-white text-lg">{user?.name}</p>
                 </div>
                 <div className="bg-surface p-4 rounded-xl border border-gray-800">
                    <p className="text-gray-400">Quit Date</p>
                    <p className="text-white text-lg">{new Date(user?.quitDate || '').toLocaleDateString()}</p>
                 </div>
                 <button 
                    className="w-full p-4 rounded-xl bg-red-500/20 text-red-500 border border-red-500/50 mt-8"
                    onClick={() => {
                        localStorage.removeItem('vapefree_user');
                        window.location.reload();
                    }}
                >
                    Reset App Data
                 </button>
                 <div className="h-20"></div>
                 <NavBar />
            </div>
        );
      default:
        return <Dashboard user={user!} onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#121212] min-h-screen relative overflow-hidden shadow-2xl">
      {renderContent()}
      {currentView !== AppView.ONBOARDING && currentView !== AppView.CHAT && currentView !== AppView.BREATHING && currentView !== AppView.APP_BLOCKER && <NavBar />}
    </div>
  );
};

export default App;