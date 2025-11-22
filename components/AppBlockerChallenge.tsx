import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Shield, Lock, Clock, AlertTriangle, CheckCircle, X, Smartphone, Zap } from 'lucide-react';

interface Props {
  user: UserProfile;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

const AppBlockerChallenge: React.FC<Props> = ({ user, onClose, onUpdateUser }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(15); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [interventionTriggered, setInterventionTriggered] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Mock Permission Flow
  const requestPermission = () => {
    // Simulate a native permission dialog delay
    setTimeout(() => {
      setHasPermission(true);
    }, 1000);
  };

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0 && !interventionTriggered) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Success
      completeSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, interventionTriggered]);

  const startFocus = () => {
    setTimeLeft(duration * 60);
    setIsActive(true);
    setSessionComplete(false);
    setInterventionTriggered(false);
  };

  const completeSession = () => {
    setIsActive(false);
    setSessionComplete(true);
    const pointsEarned = Math.floor(duration / 5) * 10;
    onUpdateUser({
      ...user,
      focusPoints: (user.focusPoints || 0) + pointsEarned
    });
  };

  const cancelSession = () => {
    setIsActive(false);
    setInterventionTriggered(false);
  };

  const triggerIntervention = () => {
    setInterventionTriggered(true);
    // Vibrate device if supported
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  const resolveIntervention = (continued: boolean) => {
    if (continued) {
      cancelSession();
    } else {
      setInterventionTriggered(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Permission Request Screen
  if (!hasPermission) {
    return (
      <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col p-6 animate-fade-in">
        <button onClick={onClose} className="self-end p-2 bg-surface rounded-full mb-4">
          <X size={24} className="text-gray-400" />
        </button>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 relative">
            <Shield size={48} className="text-primary" />
            <div className="absolute -top-1 -right-1 bg-secondary text-black text-xs font-bold px-2 py-1 rounded-full">BETA</div>
          </div>
          
          <h2 className="text-2xl font-bold text-white">Usage Access Required</h2>
          <p className="text-gray-400 leading-relaxed">
            To help you stay vape-free, we need permission to monitor when you open trigger apps (like social media or vape stores) during focus sessions.
          </p>
          
          <div className="bg-surface p-4 rounded-xl border border-gray-800 w-full text-left space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Lock size={16} className="text-secondary" />
              <span>Data stays on your device</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Smartphone size={16} className="text-secondary" />
              <span>Detects vape-related apps</span>
            </div>
          </div>

          <button 
            onClick={requestPermission}
            className="w-full bg-primary text-background font-bold p-4 rounded-xl mt-8 hover:bg-primary/90 transition-colors"
          >
            Grant Access
          </button>
        </div>
      </div>
    );
  }

  // 2. Intervention Screen (Overlay)
  if (interventionTriggered) {
    return (
      <div className="fixed inset-0 bg-red-900/90 backdrop-blur-lg z-[60] flex flex-col items-center justify-center p-6 animate-pulse">
        <AlertTriangle size={64} className="text-white mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Step Away</h2>
        <p className="text-white/80 text-center mb-8 text-lg">
          You are attempting to access a blocked app during a focus session. Is this worth breaking your streak?
        </p>
        <div className="space-y-4 w-full">
          <button 
            onClick={() => resolveIntervention(false)}
            className="w-full bg-white text-red-900 font-bold p-4 rounded-xl shadow-lg"
          >
            I'll Stay Focused
          </button>
          <button 
            onClick={() => resolveIntervention(true)}
            className="w-full bg-transparent border border-white/30 text-white font-medium p-4 rounded-xl"
          >
            I Give Up (End Session)
          </button>
        </div>
      </div>
    );
  }

  // 3. Main Challenge UI
  return (
    <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Shield className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-white">Focus Mode</h2>
        </div>
        {!isActive && (
            <button onClick={onClose} className="p-2 bg-surface rounded-full">
                <X size={24} className="text-gray-400" />
            </button>
        )}
      </div>

      {/* Active Session View */}
      {isActive ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            {/* Pulse Animation */}
            <div className="absolute inset-0 bg-secondary/20 rounded-full animate-ping duration-[2000ms]"></div>
            <div className="w-64 h-64 rounded-full border-4 border-gray-800 flex items-center justify-center bg-surface relative z-10">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">TIME REMAINING</p>
                <p className="text-5xl font-mono font-bold text-white tracking-wider">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-secondary text-xs mt-2 font-bold uppercase tracking-widest animate-pulse">
                  Monitoring Active
                </p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
             <p className="text-center text-gray-500 text-sm">
                If you open a vaping app or social media, the intervention screen will trigger.
             </p>
             
             {/* Simulation Controls */}
             <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-400 mb-3 uppercase font-bold">Simulate Usage (Test Mode)</p>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={triggerIntervention}
                        className="p-3 bg-gray-800 rounded-lg text-sm text-left flex items-center gap-2 hover:bg-red-500/20 hover:text-red-400 transition-all"
                    >
                        <Smartphone size={16} /> Open Instagram
                    </button>
                    <button 
                        onClick={triggerIntervention}
                        className="p-3 bg-gray-800 rounded-lg text-sm text-left flex items-center gap-2 hover:bg-red-500/20 hover:text-red-400 transition-all"
                    >
                        <Smartphone size={16} /> Open Vape Store
                    </button>
                </div>
             </div>

             <button 
                onClick={cancelSession}
                className="w-full text-red-400 p-4 rounded-xl text-sm font-medium hover:bg-surface"
             >
                Cancel Session
             </button>
          </div>
        </div>
      ) : (
        /* Setup / Success View */
        <div className="flex-1 flex flex-col">
          {sessionComplete ? (
            <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl mb-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Focus Complete!</h3>
              <p className="text-gray-300 text-sm">You stayed strong. Keep it up.</p>
              <div className="mt-4 inline-block px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                +{Math.floor(duration / 5) * 10} Focus Points
              </div>
            </div>
          ) : (
             <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-gray-400">Total Focus Points</p>
                   <div className="flex items-center gap-1 text-yellow-400">
                      <Zap size={16} fill="currentColor" />
                      <span className="font-bold">{user.focusPoints || 0}</span>
                   </div>
                </div>
             </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-3">Select Duration</label>
              <div className="grid grid-cols-3 gap-3">
                {[15, 30, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => setDuration(m)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      duration === m
                        ? 'bg-secondary text-black border-secondary font-bold'
                        : 'bg-surface border-gray-700 text-gray-400'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface p-4 rounded-xl border border-gray-800">
               <div className="flex items-center justify-between mb-2">
                   <h4 className="text-white font-medium">Blocked Apps</h4>
                   <span className="text-xs text-primary">Edit</span>
               </div>
               <div className="flex flex-wrap gap-2">
                   {['Instagram', 'TikTok', 'Vape Apps', 'Browser'].map(app => (
                       <span key={app} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">{app}</span>
                   ))}
               </div>
            </div>

            <button
              onClick={startFocus}
              className="w-full bg-primary text-background font-bold p-4 rounded-xl flex items-center justify-center gap-2 mt-auto hover:opacity-90 transition-opacity"
            >
              <Clock size={20} /> Start Focus Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppBlockerChallenge;