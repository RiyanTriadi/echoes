import { useMemo, useState } from 'react';
import type { JournalEntry } from '../types';
import { BookOpen, PenLine, Smile, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateModal } from './DateModal';

interface DashboardProps {
  entries: JournalEntry[];
  onNewEntry: (date: string) => void;
  onSelectEntry: (entry: JournalEntry) => void;
}

export function Dashboard({ entries, onNewEntry, onSelectEntry }: DashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const heatmapData = useMemo(() => {
    const data: Record<string, string> = {}; 
    entries.forEach(e => {
      const dateStr = new Date(e.date).toISOString().split('T')[0];
      data[dateStr] = e.mood || 'Neutral';
    });
    return data;
  }, [entries]);

  const getMoodColor = (mood?: string) => {
    switch(mood) {
      case 'Happy': return 'bg-amber-400 dark:bg-amber-500 shadow-sm shadow-amber-400/20';
      case 'Calm': return 'bg-teal-400 dark:bg-teal-500 shadow-sm shadow-teal-400/20';
      case 'Reflective': return 'bg-indigo-400 dark:bg-indigo-500 shadow-sm shadow-indigo-400/20';
      case 'Sad': return 'bg-blue-400 dark:bg-blue-500 shadow-sm shadow-blue-400/20';
      case 'Neutral': return 'bg-stone-300 dark:bg-slate-600';
      default: return 'bg-stone-100 dark:bg-slate-800/50'; 
    }
  };

  // Simple stats
  const wordsWritten = entries.reduce((acc, entry) => {
    const text = entry.content.replace(/<[^>]*>?/gm, ''); // strip HTML
    return acc + (text.match(/\S+/g)?.length || 0);
  }, 0);

  const moodCounts = entries.reduce((acc, entry) => {
    const m = entry.mood || 'Neutral';
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const padDays = Array.from({ length: firstDayOfMonth }, () => null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl w-full mx-auto py-6 px-6 flex flex-col h-full overflow-y-auto animate-in fade-in duration-500">
      <div className="flex items-end justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-slate-100 mb-1">Reflect on your writing journey.</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-stone-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Entries</h3>
            <p className="text-2xl font-medium text-stone-900 dark:text-slate-100">{entries.length}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-slate-300">
            <BookOpen size={16} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-stone-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-1">Words Written</h3>
            <p className="text-2xl font-medium text-stone-900 dark:text-slate-100">{wordsWritten.toLocaleString()}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-slate-300">
            <PenLine size={16} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-stone-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-1">Top Mood</h3>
            <p className="text-2xl font-medium text-stone-900 dark:text-slate-100">{topMood}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-slate-300">
            <Smile size={16} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-stone-200 dark:border-slate-700/60 shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-base font-semibold text-stone-800 dark:text-slate-100">Calendar</h3>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={goToday}
              className="px-2.5 py-1 text-[11px] font-medium bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-slate-300 rounded-md hover:bg-stone-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              Today
            </button>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-1 hover:bg-stone-100 dark:hover:bg-slate-700 rounded-lg text-stone-500 dark:text-slate-400 transition-colors cursor-pointer"><ChevronLeft size={16} /></button>
              <span className="font-medium text-sm text-stone-800 dark:text-slate-200 w-28 text-center">{monthNames[month]} {year}</span>
              <button onClick={nextMonth} className="p-1 hover:bg-stone-100 dark:hover:bg-slate-700 rounded-lg text-stone-500 dark:text-slate-400 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5 mb-1 shrink-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-stone-400 dark:text-slate-500 py-1 uppercase tracking-wider">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-0">
          {padDays.map((_, i) => (
            <div key={`pad-${i}`} className="rounded-lg bg-transparent"></div>
          ))}
          {monthDays.map(d => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const hasEntry = !!heatmapData[dateStr];
            const colorClass = hasEntry ? getMoodColor(heatmapData[dateStr]) : 'bg-stone-50 dark:bg-slate-800/50 hover:bg-stone-100 dark:hover:bg-slate-700/50';
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            
            return (
              <div 
                key={d} 
                onClick={() => setSelectedDate(dateStr)}
                className={`rounded-lg ${colorClass} transition-colors flex items-center justify-center relative group border min-h-[2.5rem] md:min-h-[3rem] cursor-pointer ${isToday ? 'border-indigo-400 dark:border-indigo-500' : 'border-stone-200/50 dark:border-slate-700/50'}`}
                title={`${dateStr}${hasEntry ? ' : ' + heatmapData[dateStr] : ''}`}
              >
                <span className={`text-sm font-medium ${hasEntry ? 'text-white drop-shadow-sm' : 'text-stone-500 dark:text-slate-400 group-hover:text-stone-700 dark:group-hover:text-slate-200 transition-colors'}`}>
                  {d}
                </span>
                {isToday && !hasEntry && (
                   <div className="absolute top-1 right-1 w-1 h-1 bg-indigo-500 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-700/50 flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-stone-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 dark:bg-amber-500"></div> Happy
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 dark:bg-teal-500"></div> Calm
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></div> Reflective
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 dark:bg-blue-500"></div> Sad
          </div>
        </div>
      </div>

      {selectedDate && (
        <DateModal
          date={selectedDate}
          entries={entries.filter(e => e.date.startsWith(selectedDate))}
          onClose={() => setSelectedDate(null)}
          onNewEntry={onNewEntry}
          onSelectEntry={onSelectEntry}
        />
      )}
    </div>
  );
}
