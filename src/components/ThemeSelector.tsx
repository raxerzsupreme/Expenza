'use client';

import { motion } from 'motion/react';
import { themeOptions, useThemeStore } from '@/lib/themeStore';
import { cn } from '@/lib/utils';

export function ThemeSelector() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {themeOptions.map((option) => {
        const isActive = theme === option.id;
        return (
          <motion.button
            key={option.id}
            type="button"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme(option.id)}
            className={cn(
              'group relative overflow-hidden rounded-xl border p-4 text-left transition-all',
              isActive
                ? 'border-primary bg-secondary/60 shadow-sm ring-2 ring-primary/40'
                : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/30'
            )}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <span
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-lg',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                )}
              >
                <option.icon className="h-5 w-5" />
              </span>
              <div className="flex gap-1.5">
                {option.swatch.map((color) => (
                  <span
                    key={color}
                    className="h-5 w-5 rounded-full border border-border/60"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <p className="font-semibold">{option.label}</p>
            <p className="text-sm text-muted-foreground">{option.description}</p>
            <div
              className={cn(
                'absolute bottom-0 left-0 h-1 w-full transition-all duration-300',
                isActive ? 'bg-primary' : 'bg-transparent'
              )}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
