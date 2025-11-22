export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  STATS = 'STATS',
  BREATHING = 'BREATHING',
  PROFILE = 'PROFILE',
  APP_BLOCKER = 'APP_BLOCKER'
}

export interface UserProfile {
  name: string;
  age: number;
  vapesPerDay: number;
  costPerPod: number;
  quitDate: string; // ISO Date string
  motivation: string;
  streakDays: number;
  moneySaved: number;
  completedOnboarding: boolean;
  focusPoints?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  icon: string;
}

export interface MetricData {
  name: string;
  value: number;
}