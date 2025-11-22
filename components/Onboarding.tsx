import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, Check } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    vapesPerDay: 10,
    costPerPod: 15,
    motivation: 'Health',
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Finish
      const profile: UserProfile = {
        name: formData.name || 'User',
        age: formData.age || 25,
        vapesPerDay: formData.vapesPerDay || 0,
        costPerPod: formData.costPerPod || 0,
        quitDate: new Date().toISOString(),
        motivation: formData.motivation || 'Better Health',
        streakDays: 0,
        moneySaved: 0,
        completedOnboarding: true,
      };
      onComplete(profile);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background p-6 text-onBackground justify-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {step === 1 && "Let's get to know you."}
          {step === 2 && "Habit Analysis"}
          {step === 3 && "Financial Check"}
          {step === 4 && "Your Goal"}
        </h1>
        <div className="w-full bg-surface h-2 rounded-full mt-4">
          <div 
            className="bg-secondary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${step * 25}%` }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">What should we call you?</label>
              <input
                type="text"
                className="w-full bg-surface border border-gray-700 rounded-xl p-4 text-lg focus:border-primary focus:outline-none text-white"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Age</label>
              <input
                type="number"
                className="w-full bg-surface border border-gray-700 rounded-xl p-4 text-lg focus:border-primary focus:outline-none text-white"
                placeholder="25"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
             <div>
              <label className="block text-sm text-gray-400 mb-1">Approx. vaping sessions per day?</label>
              <input
                type="range"
                min="1"
                max="50"
                className="w-full accent-secondary"
                value={formData.vapesPerDay}
                onChange={(e) => setFormData({ ...formData, vapesPerDay: parseInt(e.target.value) })}
              />
              <div className="text-center text-2xl font-bold text-secondary mt-2">{formData.vapesPerDay} times</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cost per pod/disposable ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-gray-400">$</span>
                <input
                  type="number"
                  className="w-full bg-surface border border-gray-700 rounded-xl p-4 pl-8 text-lg focus:border-primary focus:outline-none text-white"
                  placeholder="15.00"
                  value={formData.costPerPod}
                  onChange={(e) => setFormData({ ...formData, costPerPod: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <label className="block text-sm text-gray-400 mb-1">Why do you want to quit?</label>
            {['Health', 'Money', 'Family', 'Freedom'].map((option) => (
              <button
                key={option}
                onClick={() => setFormData({ ...formData, motivation: option })}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  formData.motivation === option 
                    ? 'border-primary bg-primary/20 text-white' 
                    : 'border-gray-700 bg-surface text-gray-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {formData.motivation === option && <Check size={20} className="text-primary" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-primary text-background font-bold p-4 rounded-xl flex items-center justify-center gap-2 mt-6 active:scale-95 transition-transform"
      >
        {step === 4 ? 'Start Journey' : 'Continue'} <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default Onboarding;