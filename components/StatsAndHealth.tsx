import React from 'react';
import { UserProfile } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ArrowLeft, Activity, DollarSign, Smartphone, Zap } from 'lucide-react';

interface Props {
  user: UserProfile;
  onBack: () => void;
}

const dataSavings = [
  { name: 'Mon', amount: 5 },
  { name: 'Tue', amount: 10 },
  { name: 'Wed', amount: 15 },
  { name: 'Thu', amount: 20 },
  { name: 'Fri', amount: 25 },
  { name: 'Sat', amount: 30 },
  { name: 'Sun', amount: 35 },
];

const dataCravings = [
  { name: 'Mon', count: 8 },
  { name: 'Tue', count: 6 },
  { name: 'Wed', count: 5 },
  { name: 'Thu', count: 3 },
  { name: 'Fri', count: 4 },
  { name: 'Sat', count: 2 },
  { name: 'Sun', count: 1 },
];

const StatsAndHealth: React.FC<Props> = ({ user, onBack }) => {
  return (
    <div className="p-4 pb-24 space-y-6 bg-background min-h-full animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-surface rounded-full border border-gray-800">
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
        <h2 className="text-2xl font-bold text-white">Progress</h2>
      </div>

      {/* Focus Points Card */}
      <div className="bg-gradient-to-br from-yellow-900/20 to-surface p-6 rounded-2xl border border-yellow-500/20 shadow-lg">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
               <div className="p-2 bg-yellow-500/20 rounded-lg">
                   <Zap className="text-yellow-400" size={24} />
               </div>
               <div>
                   <p className="text-gray-400 text-xs uppercase font-bold">Iron Will Score</p>
                   <h3 className="text-2xl font-bold text-white">{user.focusPoints || 0} <span className="text-sm font-normal text-gray-400">pts</span></h3>
               </div>
           </div>
           <div className="text-right">
               <p className="text-yellow-400 text-sm font-bold">Level {Math.floor((user.focusPoints || 0) / 100) + 1}</p>
               <p className="text-xs text-gray-500">Next level: {100 - ((user.focusPoints || 0) % 100)} pts</p>
           </div>
        </div>
        <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4">
            <div 
                className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${((user.focusPoints || 0) % 100)}%` }}
            ></div>
        </div>
      </div>

      {/* Money Saved Card */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-green-400">
                <DollarSign size={20} />
                <h3 className="font-bold text-lg">Money Saved</h3>
            </div>
            <span className="text-2xl font-bold text-white">${user.moneySaved}</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataSavings}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', borderRadius: '8px' }}
                itemStyle={{ color: '#4ade80' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#4ade80" fillOpacity={1} fill="url(#colorSavings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Projected annual savings: ${(user.costPerPod * 52).toFixed(0)}</p>
      </div>

      {/* Cravings Reduction */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-primary">
                <Activity size={20} />
                <h3 className="font-bold text-lg">Craving Intensity</h3>
            </div>
            <span className="text-sm text-gray-400">-60% this week</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataCravings}>
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {dataCravings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index > 4 ? '#BB86FC' : '#373737'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Digital Wellbeing Simulation */}
      <div className="bg-surface p-4 rounded-xl border border-gray-800 flex items-center gap-4 opacity-70">
        <div className="p-3 bg-red-500/20 rounded-full text-red-400">
            <Smartphone size={24} />
        </div>
        <div>
            <h4 className="font-bold text-gray-200">App Blocker Active</h4>
            <p className="text-xs text-gray-400">2 Vaping apps restricted today</p>
        </div>
      </div>

      {/* Leaderboard Mock */}
      <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-white/5">
            <h3 className="font-bold text-white">Community Leaderboard</h3>
        </div>
        {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                    <span className={`font-bold w-6 ${i === 1 ? 'text-yellow-400' : 'text-gray-500'}`}>#{i}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <span className="text-sm">Anonymous User</span>
                </div>
                <span className="text-secondary font-bold">{100 - i * 12} Days</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default StatsAndHealth;