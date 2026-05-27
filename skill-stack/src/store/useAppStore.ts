import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'dim';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi';

interface User {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  coins: number;
  streak: number;
  avatar: string;
}

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  
  user: User;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  incrementStreak: () => void;
  
  notifications: any[];
  addNotification: (notification: any) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => {
    document.documentElement.classList.remove('dark', 'dim');
    if (theme !== 'light') {
      document.documentElement.classList.add(theme);
    }
    set({ theme });
  },
  
  language: 'en',
  setLanguage: (language) => set({ language }),

  user: {
    name: 'Alex',
    level: 12,
    xp: 450,
    maxXp: 1000,
    coins: 1250,
    streak: 14,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  
  addXp: (amount) => set((state) => {
    let newXp = state.user.xp + amount;
    let newLevel = state.user.level;
    let newMaxXp = state.user.maxXp;
    
    if (newXp >= newMaxXp) {
      newLevel += 1;
      newXp = newXp - newMaxXp;
      newMaxXp = Math.floor(newMaxXp * 1.5);
    }
    
    return {
      user: { ...state.user, xp: newXp, level: newLevel, maxXp: newMaxXp }
    };
  }),
  
  addCoins: (amount) => set((state) => ({
    user: { ...state.user, coins: state.user.coins + amount }
  })),
  
  incrementStreak: () => set((state) => ({
    user: { ...state.user, streak: state.user.streak + 1 }
  })),
  
  notifications: [
    { id: 1, type: 'placement', title: 'New Role Match', message: 'Frontend Dev at Stripe', unread: true },
    { id: 2, type: 'tech', title: 'Course Update', message: 'Advanced React patterns added', unread: true },
  ],
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  clearNotifications: () => set({ notifications: [] }),
}));
