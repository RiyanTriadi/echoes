import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface LockScreenProps {
  correctPin: string;
  onUnlock: () => void;
}

export function LockScreen({ correctPin, onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (d: number) => {
    setError(false);
    if (pin.length < 4) {
      const newPin = pin + d;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="flex h-screen w-full bg-stone-50 dark:bg-slate-950 items-center justify-center font-sans">
      <div className="flex flex-col items-center bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-stone-200 dark:border-slate-800 w-80">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
          <Lock size={24} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-serif font-semibold text-stone-800 dark:text-slate-100 mb-2">Echoes</h2>
        <p className="text-stone-500 dark:text-slate-400 text-sm mb-6 text-center">
          Enter your 4-digit PIN to access your journal.
        </p>
        
        <div className="flex gap-3 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-all ${
                i < pin.length 
                  ? 'bg-indigo-600 dark:bg-indigo-500' 
                  : 'bg-stone-200 dark:bg-slate-800'
              } ${error ? 'bg-rose-500 animate-pulse' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-14 rounded-xl text-xl font-medium text-stone-700 dark:text-slate-200 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors"
            >
              {num}
            </button>
          ))}
          <div className="h-14"></div>
          <button
            onClick={() => handleDigit(0)}
            className="h-14 rounded-xl text-xl font-medium text-stone-700 dark:text-slate-200 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-xl text-sm font-medium text-stone-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          >
            Del
          </button>
        </div>
        
        {error && (
          <div className="mt-6 flex items-center gap-2 text-rose-500 text-sm font-medium">
            <AlertCircle size={16} /> Incorrect PIN
          </div>
        )}
      </div>
    </div>
  );
}
