import type { SearchApiResponse } from '../types/employee';

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function validateInputQuery(rawQuery: string): {
  valid: boolean;
  trimmed: string;
  normalized: string;
  errorMessage: string | null;
} {
  const trimmed = rawQuery.trim();
  if (!trimmed) {
    return {
      valid: false,
      trimmed: '',
      normalized: '',
      errorMessage: 'Please enter a name, email, ID, DOB, department, or position to search.',
    };
  }

  return {
    valid: true,
    trimmed,
    normalized: normalizeSearchQuery(trimmed),
    errorMessage: null,
  };
}

export class EmployeeSearchCache {
  private readonly cache = new Map<string, SearchApiResponse>();

  get(rawQuery: string): SearchApiResponse | undefined {
    const key = normalizeSearchQuery(rawQuery);
    if (!key) {
      return undefined;
    }
    return this.cache.get(key);
  }

  has(rawQuery: string): boolean {
    const key = normalizeSearchQuery(rawQuery);
    if (!key) {
      return false;
    }
    return this.cache.has(key);
  }

  set(rawQuery: string, response: SearchApiResponse): void {
    const key = normalizeSearchQuery(rawQuery);
    if (!key || !response.success) {
      return;
    }
    this.cache.set(key, response);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

export const searchCache = new EmployeeSearchCache();
