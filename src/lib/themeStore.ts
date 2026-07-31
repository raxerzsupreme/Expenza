'use client';

import { create } from 'zustand';
import { Palette, Bitcoin, Gem, Brush } from 'lucide-react';

export type LandingTheme = 'original' | 'fintech' | 'luxury' | 'agency';

export interface ThemeOption {
  id: LandingTheme;
  label: string;
  description: string;
  icon: typeof Palette;
  swatch: string[];
}

export const themeOptions: ThemeOption[] = [
  { id: 'original', label: 'Original', description: 'The classic Expenza look', icon: Palette, swatch: ['#f8fafc', '#0D9488', '#f97316', '#3b82f6'] },
  { id: 'fintech', label: 'Fintech', description: 'Dark crypto & finance vibe', icon: Bitcoin, swatch: ['#06080f', '#00d4ff', '#10b981', '#a78bfa'] },
  { id: 'luxury', label: 'Luxury', description: 'Elegant high-end presentation', icon: Gem, swatch: ['#f7f4ee', '#a8892f', '#b58f45', '#6b6257'] },
  { id: 'agency', label: 'Agency', description: 'Bold creative portfolio', icon: Brush, swatch: ['#ffffff', '#0a0a0a', '#ffd600', '#ff2d20'] },
];

const STORAGE_KEY = 'expenza-landing-theme';

function getInitialTheme(): LandingTheme {
  if (typeof window === 'undefined') return 'original';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return themeOptions.some((t) => t.id === stored) ? (stored as LandingTheme) : 'original';
}

interface ThemeState {
  theme: LandingTheme;
  setTheme: (theme: LandingTheme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    set({ theme });
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
      if (theme === 'original') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
    } catch {
      // localStorage unavailable (SSR / privacy mode) — no-op
    }
  },
}));
