import React, { useEffect, useState } from 'react';
import { UserProfile, DailyTask, AppView } from '../types';
import { generateDailyTip } from '../services/geminiService';
import { Flame, Droplets, Wind, CheckCircle, AlertCircle, ChevronRight, Shield } from 'lucide-react';

interface Props {
  user: UserProfile;
  onChangeView: (view: AppView) => void;
}

const Dashboard: React.FC<Props> = ({ user, onChangeView }) => {
  const [tip, setTip] = useState<string>("Loading daily motivation...");
  const [tasks, setTasks] = useState<DailyTask[]>([
    { id: '1', title: 'Morning Breathing', completed: false, icon: 'wind' },
    { id: '2', title: 'Drink 2L Water', completed: true, icon: 'water' },
    { id: '3', title: 'Check-in with Coach', completed: false, icon: 'message' },
  ]);

  useEffect(() => {
    generateDailyTip().then(setTip);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Hello, {user.name}</h2>
          <p className="text-gray-400 text-sm">Day {user.streakDays + 1} of Freedom</p>
        </div>
        <div className="bg-surface p-2 rounded-full border border-gray-800" onClick={() => onChangeView(AppView.PROFILE)}>
           <img src={`https://picsum.photos/seed/${user.name}/50/50`} alt="Profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* Streak Card */}
      <div className="bg-gradient-to-r from-surface to-[#2A2A2A] p-6 rounded-2xl shadow-lg border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-secondary font-semibold mb-1 flex items-center gap-2">
              <Flame size={18} /> Current Streak
            </p>
            <h3 className="text-5xl font-bold text-white">{user.streakDays} <span className="text-lg font-normal text-gray-400">Days</span></h3>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Money Saved</p>
            <p className="text-xl font-bold text-green-400">${user.moneySaved.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-700 h-1.5 rounded-full">
          <div className="bg-gradient-to-r from-primary to-secondary w-1/3 h-1.5 rounded-full shadow-[0_0_10px_rgba(3,218,198,0.5)]"></div>
        </div>
      </div>

      {/* Daily Tip */}
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="text-primary shrink-0 mt-1" size={20} />
        <div>
          <p className="text-sm text-primary font-bold mb-1">AI Insight</p>
          <p className="text-gray-300 text-sm leading-relaxed italic">"{tip}"</p>
        </div>
      </div>

      {/* Quick Actions Grid - Updated */}
      <div className="grid grid-cols-3 gap-3">
        <button 
            onClick={() => onChangeView(AppView.BREATHING)}
            className="bg-surface p-3 rounded-xl border border-gray-800 flex flex-col items-center justify-center gap-2 hover:bg-[#252525] transition-colors h-24"
        >
            <Wind className="text-secondary" size={24} />
            <span className="text-xs font-medium text-center">Breathe</span>
        </button>
        <button 
            onClick={() => onChangeView(AppView.CHAT)}
            className="bg-surface p-3 rounded-xl border border-gray-800 flex flex-col items-center justify-center gap-2 hover:bg-[#252525] transition-colors h-24"
        >
            <span className="text-2xl">🤖</span>
            <span className="text-xs font-medium text-center">AI Coach</span>
        </button>
        <button 
            onClick={() => onChangeView(AppView.APP_BLOCKER)}
            className="bg-surface p-3 rounded-xl border border-gray-800 flex flex-col items-center justify-center gap-2 hover:bg-[#252525] transition-colors h-24"
        >
            <Shield className="text-red-400" size={24} />
            <span className="text-xs font-medium text-center">Focus Mode</span>
        </button>
      </div>

      {/* Daily Habits */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">Daily Goals</h3>
          <button className="text-xs text-primary font-semibold">View All</button>
        </div>
        <div className="space-y-3">
          {tasks.map(task => (
            <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-xl border flex items-center gap-4 transition-all cursor-pointer ${
                    task.completed 
                    ? 'bg-surface border-gray-800 opacity-50' 
                    : 'bg-surface border-gray-700'
                }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  task.completed ? 'bg-secondary border-secondary' : 'border-gray-500'
              }`}>
                  {task.completed && <CheckCircle size={14} className="text-black" />}
              </div>
              <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {task.title}
                  </p>
              </div>
              {task.icon === 'wind' && <Wind size={18} className="text-gray-500" />}
              {task.icon === 'water' && <Droplets size={18} className="text-blue-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Promo / Financial */}
      <div onClick={() => onChangeView(AppView.STATS)} className="bg-surface border border-gray-800 p-4 rounded-xl flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">$</div>
            <div>
                <p className="font-bold text-white">Financial Commitment</p>
                <p className="text-xs text-gray-400">$50 pledged • 30 days to go</p>
            </div>
          </div>
          <ChevronRight className="text-gray-500" size={20} />
      </div>
    </div>
  );
};

export default Dashboard;