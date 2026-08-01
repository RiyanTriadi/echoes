import { AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className={cn(
      "fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300",
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      <div className="absolute inset-0 bg-stone-900/40 dark:bg-slate-950/60 backdrop-blur-sm" onClick={onCancel}></div>
      <div className={cn(
        "relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-300",
        isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      )}>
        
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 mx-auto flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-slate-100 mb-2">{title}</h2>
          <p className="text-sm text-stone-500 dark:text-slate-400 mb-6">{message}</p>
          
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 rounded-xl font-medium text-stone-600 dark:text-slate-300 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
