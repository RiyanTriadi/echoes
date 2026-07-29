import { useState } from 'react';
import { X, Shield, Type } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onPinChange: (newPin: string | null) => void;
  currentFont: string;
  onFontChange: (newFont: string) => void;
}

export function SettingsModal({ onClose, onPinChange, currentFont, onFontChange }: SettingsModalProps) {
  const currentPin = localStorage.getItem('echoes_pin');
  const [pin, setPin] = useState(currentPin || '');
  const [message, setMessage] = useState('');
  const [font, setFont] = useState(currentFont);

  const handleSave = () => {
    if (pin.length > 0 && pin.length !== 4) {
      setMessage("PIN must be exactly 4 digits.");
      return;
    }
    
    if (pin.length === 0) {
      localStorage.removeItem('echoes_pin');
      onPinChange(null);
      setMessage("Settings updated successfully.");
    } else {
      localStorage.setItem('echoes_pin', pin);
      onPinChange(pin);
      setMessage("Settings updated successfully.");
    }
    
    localStorage.setItem('echoes_font', font);
    onFontChange(font);
    
    setTimeout(() => onClose(), 1000);
  };

  const fonts = [
    { id: 'font-serif', label: 'Serif (Elegant)', description: 'Classic and formal' },
    { id: 'font-sans', label: 'Sans-Serif (Modern)', description: 'Clean and minimal' },
    { id: 'font-mono', label: 'Monospace (Retro)', description: 'Typewriter feel' }
  ];

  return (
    <div className="fixed inset-0 bg-stone-900/40 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-slate-800/60 shrink-0">
          <h2 className="font-semibold text-stone-800 dark:text-slate-100 flex items-center gap-2">
            Settings
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {/* Security */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-stone-800 dark:text-slate-200 flex items-center gap-2 mb-4">
              <Shield size={16} className="text-indigo-500" /> Security
            </h3>
            <p className="text-sm text-stone-500 dark:text-slate-400 mb-4">
              Set a 4-digit PIN to lock your journal when the app starts. Leave blank to disable.
            </p>
            <div className="mb-2">
              <input 
                type="password" 
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 1234"
                className="w-full bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-stone-800 dark:text-slate-100 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors text-center text-xl tracking-widest font-mono"
              />
            </div>
          </div>

          <div className="w-full h-px bg-stone-100 dark:bg-slate-800/60 mb-8"></div>

          {/* Typography */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-stone-800 dark:text-slate-200 flex items-center gap-2 mb-4">
              <Type size={16} className="text-indigo-500" /> Typography
            </h3>
            <p className="text-sm text-stone-500 dark:text-slate-400 mb-4">
              Choose the font style for your journal entries.
            </p>
            
            <div className="space-y-3">
              {fonts.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFont(f.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    font === f.id 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' 
                      : 'border-stone-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-stone-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <p className={`text-stone-900 dark:text-slate-100 font-medium ${f.id}`}>{f.label}</p>
                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">{f.description}</p>
                  </div>
                  {font === f.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {message && (
            <p className={`text-sm mt-6 font-medium ${message.includes('successfully') ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>
              {message}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-md shadow-indigo-500/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
