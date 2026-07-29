import { Book, ChevronLeft, Plus, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <div
      className={cn(
        "h-screen bg-zinc-900 border-r border-zinc-800 transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 h-16">
        {isOpen && <span className="font-semibold text-zinc-100 flex items-center gap-2"><Book size={18} /> Echoes</span>}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors mx-auto"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Book size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <button className={cn(
          "w-full flex items-center gap-2 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors mb-6 mt-2",
          !isOpen && "justify-center"
        )}>
          <Plus size={18} />
          {isOpen && <span className="font-medium">New Entry</span>}
        </button>

        {isOpen && (
          <div className="space-y-1">
            <p className="px-2 text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Recent</p>
            {/* Placeholder list */}
            {[1, 2, 3].map((i) => (
              <button key={i} className="w-full text-left p-2 rounded-md hover:bg-zinc-800/50 text-sm text-zinc-400 hover:text-zinc-200 transition-colors truncate">
                Journal Entry {i}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <button className={cn(
          "w-full flex items-center gap-2 p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors",
          !isOpen && "justify-center"
        )}>
          <Settings size={18} />
          {isOpen && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
}
