import { useMemo, useState } from 'react';
import type { JournalEntry } from '../types';
import { BookOpen, PenLine, ChevronLeft, ChevronRight, Flame, Trophy, Calendar as CalendarIcon, Image as ImageIcon } from 'lucide-react';
import { DateModal } from './DateModal';

interface DashboardProps {
  entries: JournalEntry[];
  onNewEntry: (date: string) => void;
  onSelectEntry: (entry: JournalEntry) => void;
}

export function Dashboard({ entries, onNewEntry, onSelectEntry }: DashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery'>('overview');
  
  const heatmapData = useMemo(() => {
    const data: Record<string, string> = {}; 
    entries.forEach(e => {
      const dateStr = new Date(e.date).toISOString().split('T')[0];
      data[dateStr] = e.mood || 'Neutral';
    });
    return data;
  }, [entries]);

  const { currentStreak, longestStreak } = useMemo(() => {
    if (entries.length === 0) return { currentStreak: 0, longestStreak: 0 };
    
    const dates = [...new Set(entries.map(e => new Date(e.date).toISOString().split('T')[0]))]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let max = 0;
    let current = 0;
    let temp = 1;
    
    // Calculate max streak
    for (let i = 0; i < dates.length - 1; i++) {
      const d1 = new Date(dates[i]);
      const d2 = new Date(dates[i + 1]);
      const diff = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        temp++;
      } else {
        if (temp > max) max = temp;
        temp = 1;
      }
    }
    if (temp > max) max = temp;
    if (dates.length === 1) max = 1;
    
    // Calculate current streak
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
    
    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
      current = 0;
    } else {
      current = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        const d1 = new Date(dates[i]);
        const d2 = new Date(dates[i + 1]);
        const diff = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          current++;
        } else {
          break;
        }
      }
    }
    
    return { currentStreak: current, longestStreak: max };
  }, [entries]);

  const mediaItems = useMemo(() => {
    const items: { src: string; entry: JournalEntry; date: string }[] = [];
    const regex = /<img[^>]+src="([^">]+)"/g;
    
    entries.forEach(e => {
      let match;
      while ((match = regex.exec(e.content)) !== null) {
        items.push({ src: match[1], entry: e, date: e.date });
      }
    });
    return items;
  }, [entries]);

  const getMoodColor = (mood?: string) => {
    switch(mood) {
      case 'Happy': return 'bg-amber-400 dark:bg-amber-500 shadow-sm shadow-amber-400/20';
      case 'Calm': return 'bg-teal-400 dark:bg-teal-500 shadow-sm shadow-teal-400/20';
      case 'Reflective': return 'bg-indigo-400 dark:bg-indigo-500 shadow-sm shadow-indigo-400/20';
      case 'Sad': return 'bg-blue-400 dark:bg-blue-500 shadow-sm shadow-blue-400/20';
      case 'Angry': return 'bg-red-400 dark:bg-red-500 shadow-sm shadow-red-400/20';
      case 'Anxious': return 'bg-violet-400 dark:bg-violet-500 shadow-sm shadow-violet-400/20';
      case 'Excited': return 'bg-orange-400 dark:bg-orange-500 shadow-sm shadow-orange-400/20';
      case 'Tired': return 'bg-zinc-400 dark:bg-zinc-500 shadow-sm shadow-zinc-400/20';
      case 'Grateful': return 'bg-pink-400 dark:bg-pink-500 shadow-sm shadow-pink-400/20';
      case 'Neutral': return 'bg-stone-300 dark:bg-slate-600';
      default: return 'bg-stone-100 dark:bg-slate-800/50'; 
    }
  };

  const wordsWritten = entries.reduce((acc, entry) => {
    const text = entry.content.replace(/<[^>]*>?/gm, ''); 
    return acc + (text.match(/\S+/g)?.length || 0);
  }, 0);

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
          <h1 className="text-3xl font-bold text-stone-900 dark:text-slate-100 mb-1">Reflect on your writing journey</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-1 mb-6 bg-stone-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-max shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer outline-none focus:outline-none ${
            activeTab === 'overview' 
              ? 'bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 shadow-sm' 
              : 'text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <CalendarIcon size={16} /> Overview
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer outline-none focus:outline-none ${
            activeTab === 'gallery' 
              ? 'bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 shadow-sm' 
              : 'text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <ImageIcon size={16} /> Media Gallery
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both flex-1 overflow-y-auto pb-8 pr-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 shrink-0">
            <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-stone-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between transition-[transform,box-shadow] duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-stone-300 dark:hover:border-slate-600">
              <div>
                <h3 className="text-[10px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">Entries</h3>
                <p className="text-xl font-medium text-stone-900 dark:text-slate-100">{entries.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-slate-300">
                <BookOpen size={14} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-stone-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between transition-[transform,box-shadow] duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-stone-300 dark:hover:border-slate-600">
              <div>
                <h3 className="text-[10px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">Words</h3>
                <p className="text-xl font-medium text-stone-900 dark:text-slate-100">{wordsWritten.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-slate-300">
                <PenLine size={14} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-amber-200/50 dark:border-amber-500/20 shadow-sm flex items-center justify-between transition-[transform,box-shadow] duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-amber-300/50 dark:hover:border-amber-500/40">
              <div>
                <h3 className="text-[10px] font-semibold text-amber-600/80 dark:text-amber-500/80 uppercase tracking-widest mb-0.5">Streak</h3>
                <p className="text-xl font-medium text-stone-900 dark:text-slate-100 flex items-center gap-1.5">
                  {currentStreak} <span className="text-xs font-normal text-stone-400 dark:text-slate-500">Days</span>
                </p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500">
                <Flame size={14} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-indigo-200/50 dark:border-indigo-500/20 shadow-sm flex items-center justify-between transition-[transform,box-shadow] duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-300/50 dark:hover:border-indigo-500/40">
              <div>
                <h3 className="text-[10px] font-semibold text-indigo-600/80 dark:text-indigo-400/80 uppercase tracking-widest mb-0.5">Record</h3>
                <p className="text-xl font-medium text-stone-900 dark:text-slate-100 flex items-center gap-1.5">
                  {longestStreak} <span className="text-xs font-normal text-stone-400 dark:text-slate-500">Days</span>
                </p>
              </div>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                <Trophy size={14} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-stone-200 dark:border-slate-700/60 shadow-sm">
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
            
            <div className="grid grid-cols-7 gap-1.5">
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
                    className={`rounded-lg ${colorClass} transition-all duration-300 hover:scale-105 flex items-center justify-center relative group border min-h-[2.5rem] md:min-h-[3rem] cursor-pointer ${isToday ? 'border-indigo-400 dark:border-indigo-500' : 'border-stone-200/50 dark:border-slate-700/50'}`}
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
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500"></div> Angry
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-400 dark:bg-violet-500"></div> Anxious
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400 dark:bg-orange-500"></div> Excited
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500"></div> Tired
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-400 dark:bg-pink-500"></div> Grateful
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both flex-1 flex flex-col min-h-0">
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-stone-200 dark:border-slate-700/60 shadow-sm overflow-hidden p-6 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h3 className="text-base font-semibold text-stone-800 dark:text-slate-100">Memory Visuals</h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">A collection of all images you've attached to your entries.</p>
            </div>
            <div className="text-xs font-semibold text-stone-400 dark:text-slate-500 uppercase tracking-widest bg-stone-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-md">
              {mediaItems.length} Photos
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {mediaItems.length > 0 ? (
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {mediaItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => onSelectEntry(item.entry as any)}
                    className="relative group cursor-pointer overflow-hidden rounded-xl break-inside-avoid border border-stone-200 dark:border-slate-700/50"
                  >
                    <img src={item.src} alt={`Memory from ${item.date}`} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p className="text-white text-sm font-medium line-clamp-1">{item.entry.title || 'Untitled'}</p>
                      <p className="text-stone-300 text-[10px] uppercase tracking-wider mt-1">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-stone-100 dark:bg-slate-700/50 text-stone-300 dark:text-slate-600 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon size={32} />
                </div>
                <h4 className="text-sm font-medium text-stone-700 dark:text-slate-300 mb-1">No Memories Yet</h4>
                <p className="text-xs text-stone-500 dark:text-slate-400 max-w-[250px]">Add images to your journal entries to see them collected here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      <DateModal
        isOpen={!!selectedDate}
        date={selectedDate}
        entries={selectedDate ? entries.filter(e => e.date.startsWith(selectedDate)) : []}
        onClose={() => setSelectedDate(null)}
        onNewEntry={onNewEntry}
        onSelectEntry={onSelectEntry}
      />
    </div>
  );
}
