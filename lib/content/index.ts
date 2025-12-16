// Placeholder content provider.
// When Sanity is configured, replace these with real GROQ/Client calls.

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
}

export interface Activity {
  id: string;
  title: string;
  slug: string;
  summary?: string;
}

export interface Printable {
  id: string;
  title: string;
  slug: string;
  fileUrl?: string;
}

export async function getArticles(): Promise<Article[]> {
  // TODO: Connect to Sanity
  return [];
}

export async function getActivities(): Promise<Activity[]> {
  // TODO: Connect to Sanity
  return [];
}

export async function getPrintables(): Promise<Printable[]> {
  // TODO: Connect to Sanity
  return [];
}

