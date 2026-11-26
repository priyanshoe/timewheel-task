import { Loader2, Search, X } from 'lucide-react';
import type { FormEvent } from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: (overrideQuery?: string) => void;
  onClear: () => void;
  isLoading: boolean;
  validationError: string | null;
}

const SAMPLE_QUERIES = ['john', 'Engineering', '1998-05-12', '5'];

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  onClear,
  isLoading,
  validationError,
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <section aria-label="Employee search controls" className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="employee-search-input" className="sr-only">
            Search employees
          </label>
          <Search
            aria-hidden="true"
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            id="employee-search-input"
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, email, ID, DOB, department or position..."
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? 'search-validation-error' : undefined}
            className={`w-full min-h-[44px] pl-10 pr-10 py-2.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 border rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700/20 ${
              validationError
                ? 'border-red-500 focus-visible:border-red-600'
                : 'border-slate-300 focus-visible:border-blue-700'
            }`}
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search input"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Search</span>
            </>
          )}
        </button>
      </form>

      {validationError && (
        <p
          id="search-validation-error"
          role="alert"
          className="mt-2.5 text-sm font-medium text-red-700"
        >
          {validationError}
        </p>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
        <span>Try searching:</span>
        {SAMPLE_QUERIES.map((sample, index) => (
          <span key={sample} className="inline-flex items-center gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                onQueryChange(sample);
                onSearch(sample);
              }}
              className="font-medium text-slate-700 hover:text-blue-700 underline underline-offset-2 decoration-slate-300 hover:decoration-blue-700 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded"
            >
              {sample}
            </button>
            {index < SAMPLE_QUERIES.length - 1 && (
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
