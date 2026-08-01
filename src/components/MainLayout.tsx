import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import type { JournalEntry } from '../types';
import { cn } from '../lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  entries: JournalEntry[];
  activeEntryId: string | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: (date?: string) => void;
  onOpenSettings?: () => void;
  isZenMode: boolean;
}

export function MainLayout({ children, entries, activeEntryId, onSelectEntry, onNewEntry, onOpenSettings, isZenMode }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('echoes_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('echoes_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('echoes_theme', 'light');
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-stone-100 dark:bg-slate-950 text-stone-900 dark:text-slate-100 overflow-hidden">
      <div 
        className={cn(
          "h-full shrink-0 transition-[width,opacity,margin] duration-500 ease-in-out overflow-hidden",
          isZenMode ? "w-0 opacity-0 -ml-1" : (isSidebarOpen ? "w-72 opacity-100" : "w-16 opacity-100")
        )}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          entries={entries}
          activeEntryId={activeEntryId}
          onSelectEntry={onSelectEntry}
          onNewEntry={onNewEntry}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onOpenSettings={onOpenSettings}
        />
      </div>
      <main className="flex-1 flex flex-col relative transition-all duration-500 overflow-hidden bg-stone-50 dark:bg-slate-950">
        {children}
      </main>
    </div>
  );
}
