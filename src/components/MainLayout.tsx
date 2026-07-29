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
  isDirty?: boolean;
  onOpenSettings?: () => void;
  isZenMode: boolean;
}

export function MainLayout({ children, entries, activeEntryId, onSelectEntry, onNewEntry, isDirty, onOpenSettings, isZenMode }: MainLayoutProps) {
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
      {!isZenMode && (
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
      )}
      <main className={cn(
        "flex-1 flex flex-col relative transition-all overflow-hidden bg-stone-50 dark:bg-slate-950",
        isZenMode ? "w-full" : ""
      )}>
        {children}
      </main>
    </div>
  );
}
