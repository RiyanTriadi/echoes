import { useState } from 'react';
import { Book, ChevronLeft, Plus, Settings, Sun, Moon, Search, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';
import type { JournalEntry } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  entries: JournalEntry[];
  activeEntryId: string | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenSettings?: () => void;
}

export function Sidebar({ isOpen, onToggle, entries, activeEntryId, onSelectEntry, onNewEntry, isDarkMode, toggleTheme, onOpenSettings }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredEntries = entries.filter(entry => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesTag = entry.tags?.some(tag => tag.toLowerCase().includes(query));
    return (
      (entry.title?.toLowerCase() || '').includes(query) ||
      (entry.content?.toLowerCase() || '').includes(query) ||
      (entry.mood?.toLowerCase() || '').includes(query) ||
      matchesTag
    );
  });

  return (
    <div
      className={cn(
        "h-screen bg-stone-50/80 dark:bg-slate-900 backdrop-blur border-r border-stone-200 dark:border-slate-800/60 transition-all duration-300 flex flex-col shadow-sm dark:shadow-xl z-10",
        isOpen ? "w-72" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-slate-800/60 h-16 shrink-0">
        {isOpen && <span className="font-semibold text-stone-800 dark:text-slate-100 text-lg flex items-center gap-2"><Book size={18} className="text-stone-700 dark:text-indigo-400" /> Echoes</span>}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-lg text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Book size={20} className="text-stone-700 dark:text-indigo-400" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <div className="flex gap-2 mb-4 mt-2 shrink-0">
          <button 
            onClick={() => {
              onNewEntry();
              if (!isOpen) onToggle();
            }}
            className={cn(
              "flex-1 flex items-center gap-2 p-2.5 rounded-lg bg-stone-800 dark:bg-indigo-600/90 hover:bg-stone-700 dark:hover:bg-indigo-500 text-stone-50 dark:text-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95",
              !isOpen && "justify-center"
            )}
            title="New Entry"
          >
            <Plus size={18} />
            {isOpen && <span className="font-medium tracking-wide">New</span>}
          </button>

          {isOpen && (
            <button 
              onClick={() => onSelectEntry({ id: 'dashboard', title: '', content: '', date: '' })}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 transition-all border border-stone-200 dark:border-slate-700/50 hover:-translate-y-0.5 active:scale-95",
                activeEntryId === 'dashboard' && "bg-stone-200 dark:bg-slate-700 border-stone-300 dark:border-slate-600 font-medium"
              )}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          )}
        </div>

        {isOpen && (
          <div className="relative mb-4 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-stone-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search by title, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700/50 rounded-lg text-sm text-stone-800 dark:text-slate-200 placeholder-stone-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            />
          </div>
        )}

        {isOpen && (
          <div className="flex-1 overflow-y-auto space-y-1 pb-4">
            <p className="px-2 text-xs font-semibold text-stone-400 dark:text-slate-500 mb-3 uppercase tracking-widest shrink-0">Recent Entries</p>
            {entries.length === 0 && (
              <p className="px-2 text-sm text-stone-500 dark:text-slate-600 italic">No entries yet.</p>
            )}
            {entries.length > 0 && filteredEntries.length === 0 && (
              <p className="px-2 text-sm text-stone-500 dark:text-slate-600 italic">No matches found.</p>
            )}
            {filteredEntries.map((entry) => (
              <button 
                key={entry.id} 
                onClick={() => onSelectEntry(entry)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 truncate flex flex-col border",
                  activeEntryId === entry.id 
                    ? "bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 shadow-sm" 
                    : "border-transparent hover:bg-stone-200/50 dark:hover:bg-slate-800/50 text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200"
                )}
              >
                <span className="font-medium truncate block w-full text-[15px]">{entry.title || 'Untitled'}</span>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {entry.tags.map(t => (
                      <span key={t} className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-slate-300 border border-stone-200 dark:border-slate-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-xs text-stone-400 dark:text-slate-500 mt-1.5 flex items-center gap-1.5">
                  {formatDate(entry.date)} 
                  {entry.mood && <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-slate-600"></span>}
                  {entry.mood}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-200 dark:border-slate-800/60 flex flex-col gap-2 shrink-0">
        <button 
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-200 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200 transition-all duration-300 hover:-translate-y-0.5",
            !isOpen && "justify-center"
          )}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          {isOpen && <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button 
          onClick={onOpenSettings}
          className={cn(
            "w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-200 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200 transition-all duration-300 hover:-translate-y-0.5",
            !isOpen && "justify-center"
          )}>
          <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
          {isOpen && <span className="font-medium">Settings</span>}
        </button>
      </div>
    </div>
  );
}
