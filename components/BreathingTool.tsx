import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const BreathingTool: React.FC<Props> = ({ onClose }) => {
  const [text, setText] = useState('Inhale');

  useEffect(() => {
    const interval = setInterval(() => {
      setText(prev => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-surface rounded-full text-gray-400"
      >
        <X size={24} />
      </button>

      <h2 className="text-2xl font-bold text-secondary mb-12 tracking-widest uppercase">Box Breathing</h2>

      <div className="relative flex items-center justify-center">
        {/* Outer glow rings */}
        <div className="absolute w-64 h-64 bg-primary/20 rounded-full animate-ping opacity-20 duration-[4000ms]"></div>
        <div className="absolute w-48 h-48 bg-secondary/20 rounded-full animate-ping opacity-30 duration-[4000ms] delay-1000"></div>
        
        {/* Core circle */}
        <div className={`w-40 h-40 bg-gradient-to-br from-primary to-secondary rounded-full shadow-[0_0_50px_rgba(187,134,252,0.4)] flex items-center justify-center transition-all duration-[4000ms] animate-breathe`}>
          <span className="text-black font-bold text-xl uppercase tracking-widest">{text}</span>
        </div>
      </div>

      <p className="mt-16 text-gray-400 max-w-xs text-center">
        Focus on the circle. Inhale as it expands, exhale as it shrinks.
      </p>
    </div>
  );
};

export default BreathingTool;