import { readTextFile, writeTextFile, exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';
import type { JournalEntry } from '../types';

const DIR = 'EchoesData';
const FILE_NAME = 'entries.json';

// Detect if running in Tauri
const isTauri = () => {
  return typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__ !== undefined;
};

export async function initStorage() {
  if (!isTauri()) return; // Skip Tauri init if in browser

  try {
    const dirExists = await exists(DIR, { baseDir: BaseDirectory.AppData });
    if (!dirExists) {
      await mkdir(DIR, { baseDir: BaseDirectory.AppData, recursive: true });
    }
    const fileExists = await exists(`${DIR}/${FILE_NAME}`, { baseDir: BaseDirectory.AppData });
    if (!fileExists) {
      await writeTextFile(`${DIR}/${FILE_NAME}`, '[]', { baseDir: BaseDirectory.AppData });
    }
  } catch (err) {
    console.warn("Tauri FS not available or failed:", err);
  }
}

export async function getEntries(): Promise<JournalEntry[]> {
  try {
    if (isTauri()) {
      await initStorage();
      const content = await readTextFile(`${DIR}/${FILE_NAME}`, { baseDir: BaseDirectory.AppData });
      return JSON.parse(content) as JournalEntry[];
    } else {
      // Browser fallback
      const data = localStorage.getItem('echoes_entries');
      return data ? JSON.parse(data) : [];
    }
  } catch (error) {
    console.error('Failed to get entries', error);
    return [];
  }
}

export async function saveEntry(entry: JournalEntry): Promise<void> {
  const entries = await getEntries();
  const existingIndex = entries.findIndex(e => e.id === entry.id);
  
  if (existingIndex !== -1) {
    entries[existingIndex] = entry;
  } else {
    entries.unshift(entry);
  }
  
  try {
    if (isTauri()) {
      await writeTextFile(`${DIR}/${FILE_NAME}`, JSON.stringify(entries, null, 2), { baseDir: BaseDirectory.AppData });
    } else {
      localStorage.setItem('echoes_entries', JSON.stringify(entries));
    }
  } catch (err) {
    console.error('Failed to save entry', err);
  }
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await getEntries();
  const filtered = entries.filter(e => e.id !== id);
  try {
    if (isTauri()) {
      await writeTextFile(`${DIR}/${FILE_NAME}`, JSON.stringify(filtered, null, 2), { baseDir: BaseDirectory.AppData });
    } else {
      localStorage.setItem('echoes_entries', JSON.stringify(filtered));
    }
  } catch (err) {
    console.error('Failed to delete entry', err);
  }
}
