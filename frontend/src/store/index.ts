import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token: string, user: User) =>
        set({ token, user, isAuthenticated: true }),
      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface UIState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

