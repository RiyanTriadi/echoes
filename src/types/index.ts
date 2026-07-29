export interface JournalEntry {
  id: string;
  title: string;
  content: string; // HTML content
  date: string; // ISO string
  mood?: string;
  tags?: string[];
}
