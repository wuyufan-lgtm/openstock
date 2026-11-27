'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

// One button, two icons: the one on screen is the mode you would switch *to*.
export default function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className={cn('icon-btn relative shadow-[inset_0_0_0_1px_var(--line)]', className)}
        >
            <Sun
                aria-hidden
                className={cn(
                    'absolute transition-all duration-300 ease-out',
                    isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0',
                )}
            />
            <Moon
                aria-hidden
                className={cn(
                    'absolute transition-all duration-300 ease-out',
                    isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100',
                )}
            />
        </button>
    );
}
