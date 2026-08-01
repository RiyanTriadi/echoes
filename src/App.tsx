import { useState, useEffect } from "react";
import { MainLayout } from "./components/MainLayout";
import { Editor } from "./components/Editor";
import { getEntries, saveEntry, deleteEntry } from "./services/storage";
import type { JournalEntry } from "./types";
import { Save, Sparkles, Tag as TagIcon, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { SettingsModal } from "./components/SettingsModal";
import { LockScreen } from "./components/LockScreen";
import { Dashboard } from "./components/Dashboard";
import { ConfirmModal } from "./components/ConfirmModal";
import { getRandomPrompt } from "./lib/prompts";


const MOODS = [
  { label: 'Happy', emoji: '😊', activeClass: 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-200', baseClass: 'border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:border-amber-300 dark:hover:border-amber-500/50 hover:bg-amber-50 dark:hover:bg-amber-500/10' },
  { label: 'Calm', emoji: '😌', activeClass: 'border-teal-400 dark:border-teal-500 bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-200', baseClass: 'border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:border-teal-300 dark:hover:border-teal-500/50 hover:bg-teal-50 dark:hover:bg-teal-500/10' },
  { label: 'Reflective', emoji: '🤔', activeClass: 'border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-200', baseClass: 'border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10' },
  { label: 'Sad', emoji: '😔', activeClass: 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-200', baseClass: 'border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/10' },
  { label: 'Angry', emoji: '😠', activeClass: 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-200', baseClass: 'border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:border-red-300 dark:hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-500/10' },
  { label: 'Anxious', emoji: '😰', activeClass: 'border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200', baseClass: 'border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10' },
  { label: 'Excited', emoji: '🤩', activeClass: 'border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-200', baseClass: 'border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:border-orange-300 dark:hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/10' },
  { label: 'Tired', emoji: '🥱', activeClass: 'border-zinc-400 dark:border-zinc-500 bg-zinc-50 dark:bg-zinc-500/20 text-zinc-700 dark:text-zinc-200', baseClass: 'border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:border-zinc-300 dark:hover:border-zinc-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-500/10' },
  { label: 'Grateful', emoji: '🙏', activeClass: 'border-pink-400 dark:border-pink-500 bg-pink-50 dark:bg-pink-500/20 text-pink-700 dark:text-pink-200', baseClass: 'border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:border-pink-300 dark:hover:border-pink-500/50 hover:bg-pink-50 dark:hover:bg-pink-500/10' },
];

function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [isLocked, setIsLocked] = useState(false);
  const [savedPin, setSavedPin] = useState<string | null>(null);

  const [isZenMode, setIsZenMode] = useState(false);
  const [editorFont, setEditorFont] = useState('font-serif');
  const [tempDate, setTempDate] = useState<string | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  useEffect(() => {
    const pin = localStorage.getItem('echoes_pin');
    if (pin) {
      setSavedPin(pin);
      setIsLocked(true);
    }
    const savedFont = localStorage.getItem('echoes_font');
    if (savedFont) {
      setEditorFont(savedFont);
    }
  }, []);

  useEffect(() => {
    document.body.className = document.body.className.replace(/\bfont-(serif|sans|mono)\b/g, '');
    document.body.classList.add(editorFont);
  }, [editorFont]);

  // Load entries on mount
  useEffect(() => {
    if (isLocked) return;
    const loadData = async () => {
      const data = await getEntries();
      setEntries(data);
      if (data.length > 0) {
        handleSelectEntry(data[0]);
      } else {
        createNewEntry();
      }
    };
    loadData();
  }, [isLocked]);

  const createNewEntry = (customDate?: string) => {
    const newId = crypto.randomUUID();
    setActiveEntryId(newId);
    setTitle("");
    setContent("");
    setMood("");
    setTags([]);
    setTagInput("");
    setIsZenMode(false);
    
    if (customDate) {
      setTempDate(new Date(customDate).toISOString());
    } else {
      setTempDate(null);
    }
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setActiveEntryId(entry.id);
    if (entry.id !== 'dashboard') {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood || "");
      setTags(entry.tags || []);
      setTagInput("");
    }
    setTempDate(null);
    setIsZenMode(false);
  };

  const currentSavedEntry = entries.find(e => e.id === activeEntryId);
  const isDirty = currentSavedEntry 
    ? (
        title !== currentSavedEntry.title || 
        content !== currentSavedEntry.content || 
        mood !== (currentSavedEntry.mood || "") ||
        JSON.stringify(tags) !== JSON.stringify(currentSavedEntry.tags || [])
      )
    : (title !== "" || content !== "" || mood !== "" || tags.length > 0);

  const handleSave = async () => {
    if (!activeEntryId || activeEntryId === 'dashboard' || !isDirty) return;
    setIsSaving(true);
    const newEntry: JournalEntry = {
      id: activeEntryId,
      title: title || "Untitled",
      content: content,
      date: currentSavedEntry?.date || tempDate || new Date().toISOString(),
      mood: mood,
      tags: tags
    };
    
    try {
      await saveEntry(newEntry);
      
      setEntries(prev => {
        const index = prev.findIndex(e => e.id === activeEntryId);
        if (index !== -1) {
          const newEntries = [...prev];
          newEntries[index] = newEntry;
          return newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!activeEntryId || activeEntryId === 'dashboard') return;
    setEntryToDelete(activeEntryId);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    try {
      await deleteEntry(entryToDelete);
      setEntries(prev => prev.filter(e => e.id !== entryToDelete));
      setActiveEntryId('dashboard');
    } catch (err) {
      console.error("Failed to delete entry:", err);
    } finally {
      setEntryToDelete(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, content, mood, tags, activeEntryId, isDirty, isZenMode]); 

  const handleDate = (dateString?: string) => {
    const d = dateString ? new Date(dateString) : new Date();
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleInspire = () => {
    setTitle(getRandomPrompt());
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  if (isLocked && savedPin) {
    return <LockScreen correctPin={savedPin} onUnlock={() => setIsLocked(false)} />;
  }

  const wordCount = content.replace(/<[^>]*>?/gm, '').match(/\S+/g)?.length || 0;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  return (
    <>
      <MainLayout 
        entries={entries} 
        activeEntryId={activeEntryId} 
        onSelectEntry={handleSelectEntry} 
        onNewEntry={createNewEntry} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        isZenMode={isZenMode}
      >
        {activeEntryId === 'dashboard' ? (
          <Dashboard 
            entries={entries} 
            onNewEntry={createNewEntry}
            onSelectEntry={handleSelectEntry}
          />
        ) : (
          <div className="max-w-4xl mx-auto py-12 md:py-16 px-6 md:px-12 flex flex-col h-full relative animate-in fade-in duration-300 w-full">
            <div className={`absolute top-6 right-8 flex items-center gap-3 z-10 transition-opacity duration-300 ${isZenMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                title="Delete Entry"
              >
                <Trash2 size={18} />
              </button>
              
              <button
                onClick={() => setIsZenMode(!isZenMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isZenMode ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'text-stone-400 hover:text-stone-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800'
                }`}
                title={isZenMode ? "Exit Zen Mode (Esc)" : "Enter Zen Mode"}
              >
                {isZenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              
              {isDirty && <span className="text-xs text-amber-600/90 dark:text-amber-500/80 italic mr-1 font-medium">Unsaved</span>}
              <button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isDirty 
                    ? 'bg-stone-800 dark:bg-indigo-600 hover:bg-stone-700 dark:hover:bg-indigo-500 text-stone-50 dark:text-white shadow-md shadow-stone-900/10 dark:shadow-indigo-500/20' 
                    : 'bg-stone-100 dark:bg-slate-800 text-stone-400 dark:text-slate-500 cursor-not-allowed border border-stone-200 dark:border-slate-700/50'
                }`}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>

            <div className={`mb-6 mt-4 transition-all duration-500 shrink-0 ${isZenMode ? 'opacity-0 h-0 overflow-hidden hidden mb-0 mt-0' : 'opacity-100'}`}>
              <p className="text-stone-400 dark:text-slate-500 text-sm tracking-widest uppercase mb-4 font-medium">
                {handleDate(currentSavedEntry?.date || tempDate || undefined)}
              </p>
              <textarea
                rows={1}
                placeholder="Title your entry..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                className={`w-full bg-transparent text-4xl text-stone-900 dark:text-slate-100 placeholder-stone-300 dark:placeholder-slate-700 outline-none border-none mb-4 font-bold resize-none overflow-hidden leading-tight py-1`}
              />
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <button 
                  onClick={handleInspire}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors border border-amber-200 dark:border-amber-500/30 mr-2 cursor-pointer"
                >
                  <Sparkles size={14} /> Inspire Me
                </button>

                <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-slate-800/50 rounded-xl border border-stone-200 dark:border-slate-700/50">
                  <TagIcon size={14} className="text-stone-400 dark:text-slate-500" />
                  {tags.map(t => (
                    <span key={t} className="flex items-center gap-1 bg-white dark:bg-slate-700 text-stone-600 dark:text-slate-300 text-xs font-medium px-2 py-0.5 rounded-md border border-stone-200 dark:border-slate-600 shadow-sm">
                      #{t}
                      <button onClick={() => removeTag(t)} className="text-stone-400 hover:text-rose-500 ml-1 transition-colors">&times;</button>
                    </span>
                  ))}
                  <input 
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder={tags.length === 0 ? "Add tags (press Enter)..." : "Add tag..."}
                    className="bg-transparent text-sm text-stone-700 dark:text-slate-300 outline-none min-w-[120px] placeholder-stone-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {MOODS.map(m => (
                  <button
                    key={m.label}
                    onClick={() => setMood(m.label)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer ${
                      mood === m.label ? m.activeClass : m.baseClass
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* When in Zen Mode, we still want to show the title, but maybe just at the top of the editor simply */}
            {isZenMode && (
               <h1 className={`text-3xl text-stone-900 dark:text-slate-200 mb-8 font-medium`}>
                 {title || "Untitled"}
               </h1>
            )}

            <div className="flex-1 overflow-y-auto pb-16">
               <Editor key={activeEntryId} content={content} onChange={setContent} fontClass={editorFont} />
            </div>

            <div className={`absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none transition-opacity duration-300 ${isZenMode ? 'opacity-20' : 'opacity-60'}`}>
              <span className="text-[11px] font-medium uppercase tracking-widest text-stone-400 dark:text-slate-500">
                {wordCount} words &bull; {readingTime} min read
              </span>
            </div>
          </div>
        )}
      </MainLayout>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)} 
        onPinChange={(newPin) => setSavedPin(newPin)}
        currentFont={editorFont}
        onFontChange={setEditorFont}
      />

      <ConfirmModal
        isOpen={!!entryToDelete}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setEntryToDelete(null)}
      />
    </>
  );
}

export default App;
