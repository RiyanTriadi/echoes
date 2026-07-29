import { readTextFile, writeTextFile, exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { JournalEntry } from '../types';

const DIR = 'EchoesData';
const FILE_NAME = 'entries.json';

export async function initStorage() {
  const dirExists = await exists(DIR, { baseDir: BaseDirectory.AppData });
  if (!dirExists) {
    await mkdir(DIR, { baseDir: BaseDirectory.AppData, recursive: true });
  }
  const fileExists = await exists(`${DIR}/${FILE_NAME}`, { baseDir: BaseDirectory.AppData });
  if (!fileExists) {
    await writeTextFile(`${DIR}/${FILE_NAME}`, '[]', { baseDir: BaseDirectory.AppData });
  }
}

export async function getEntries(): Promise<JournalEntry[]> {
  try {
    await initStorage();
    const content = await readTextFile(`${DIR}/${FILE_NAME}`, { baseDir: BaseDirectory.AppData });
    return JSON.parse(content) as JournalEntry[];
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
  
  await writeTextFile(`${DIR}/${FILE_NAME}`, JSON.stringify(entries, null, 2), { baseDir: BaseDirectory.AppData });
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await getEntries();
  const filtered = entries.filter(e => e.id !== id);
  await writeTextFile(`${DIR}/${FILE_NAME}`, JSON.stringify(filtered, null, 2), { baseDir: BaseDirectory.AppData });
}
