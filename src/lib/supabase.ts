import { createClient } from '@supabase/supabase-js';

// Supabase project credentials provided by user
const SUPABASE_URL = 'https://wdljamfelwrcgxltpoqt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rIwkUcg8bLEWHy9FKLLciQ_wn1JqqAS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Universal sync helper to handle cloud saving to Supabase dynamically.
 * Standardizes read/write operations and gracefully falls back on error (e.g. if tables aren't created yet)
 */
export async function fetchFromCloud<T>(tableName: string, fallbackData: T): Promise<T> {
  try {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
      console.warn(`Supabase read warning for '${tableName}':`, error.message);
      return fallbackData;
    }
    if (data && data.length > 0) {
      return data as unknown as T;
    }
    return fallbackData;
  } catch (err) {
    console.warn(`Supabase fetch failed for '${tableName}':`, err);
    return fallbackData;
  }
}

export async function saveToCloud<T>(tableName: string, data: T): Promise<boolean> {
  try {
    // Attempt upsert or direct upload to the table
    // For local fallback compatibility, we stringify state arrays, or check if the table accepts bulk upsert.
    // If the table scheme exists, we insert/upsert.
    const { error } = await supabase.from(tableName).upsert(
      (Array.isArray(data) ? data : [data]) as any,
      { onConflict: 'id' }
    );
    if (error) {
      console.warn(`Supabase upsert warning for '${tableName}':`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase save failed for '${tableName}':`, err);
    return false;
  }
}
