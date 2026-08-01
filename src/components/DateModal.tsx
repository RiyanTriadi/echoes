import { X, FileText, Plus } from 'lucide-react';
import type { JournalEntry } from '../types';
import { cn } from '../lib/utils';

interface DateModalProps {
  isOpen: boolean;
  date: string | null;
  entries: JournalEntry[];
  onClose: () => void;
  onNewEntry: (date: string) => void;
  onSelectEntry: (entry: JournalEntry) => void;
}

export function DateModal({ isOpen, date, entries, onClose, onNewEntry, onSelectEntry }: DateModalProps) {
  const displayDate = date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div className={cn(
      "fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300",
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      <div className="absolute inset-0 bg-stone-900/40 dark:bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className={cn(
        "relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300",
        isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-slate-800/60 shrink-0">
          <h2 className="font-semibold text-stone-800 dark:text-slate-100 flex items-center gap-2 text-sm">
            {displayDate}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {entries.length > 0 ? (
            <div className="space-y-2 mb-6">
              <h3 className="text-xs font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-3">Entries on this day</h3>
              {entries.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => {
                    onSelectEntry(entry);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl border border-stone-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors flex flex-col gap-1 cursor-pointer group"
                >
                  <span className="font-medium text-stone-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{entry.title || 'Untitled Entry'}</span>
                  <div className="flex items-center gap-2 mt-1">
                    {entry.mood && <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-stone-100 dark:bg-slate-700/50 text-stone-500 dark:text-slate-300">{entry.mood}</span>}
                    <span className="text-xs text-stone-400 dark:text-slate-500 line-clamp-1">{entry.content.replace(/<[^>]*>?/gm, '').substring(0, 50)}...</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-stone-100 dark:bg-slate-800 text-stone-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText size={20} />
              </div>
              <p className="text-stone-500 dark:text-slate-400 text-sm">No entries on this date.</p>
            </div>
          )}

          {date && (
            <button 
              onClick={() => {
                onNewEntry(date);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors font-medium cursor-pointer"
            >
              <Plus size={18} />
              New Entry for {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
