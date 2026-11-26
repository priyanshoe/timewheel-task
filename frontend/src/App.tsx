import { AlertCircle, Database, Globe } from 'lucide-react';
import { useRef, useState } from 'react';
import { EmployeeTable } from './components/EmployeeTable';
import { SearchBar } from './components/SearchBar';
import { fetchEmployeesByQuery } from './services/employeeApi';
import type { DataSourceStatus, Employee } from './types/employee';
import { searchCache, validateInputQuery } from './utils/searchCache';

export function App() {
  const [query, setQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sourceStatus, setSourceStatus] = useState<DataSourceStatus>(null);

  const inFlightRef = useRef(false);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (validationError && value.trim().length > 0) {
      setValidationError(null);
    }
  };

  const handleSearch = async (overrideQuery?: string) => {
    if (inFlightRef.current) {
      return;
    }

    const rawInput = typeof overrideQuery === 'string' ? overrideQuery : query;
    const validation = validateInputQuery(rawInput);

    if (!validation.valid) {
      setValidationError(validation.errorMessage);
      return;
    }

    setValidationError(null);
    setApiError(null);

    const cachedResponse = searchCache.get(validation.trimmed);
    if (cachedResponse) {
      setEmployees(cachedResponse.data);
      setHasSearched(true);
      setLastQuery(validation.trimmed);
      setSourceStatus('cache');
      return;
    }

    inFlightRef.current = true;
    setIsLoading(true);

    try {
      const response = await fetchEmployeesByQuery(validation.trimmed);
      searchCache.set(validation.trimmed, response);
      setEmployees(response.data);
      setHasSearched(true);
      setLastQuery(validation.trimmed);
      setSourceStatus('api');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to complete search. Please try again.';
      setApiError(message);
      setHasSearched(true);
      setLastQuery(validation.trimmed);
      setEmployees([]);
      setSourceStatus(null);
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setValidationError(null);
    setApiError(null);
    setEmployees([]);
    setHasSearched(false);
    setLastQuery('');
    setSourceStatus(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Employee Directory
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600">
            Search and find employee information
          </p>
        </header>

        <div className="space-y-6">
          <SearchBar
            query={query}
            onQueryChange={handleQueryChange}
            onSearch={handleSearch}
            onClear={handleClear}
            isLoading={isLoading}
            validationError={validationError}
          />

          {apiError && (
            <div
              role="alert"
              className="flex items-start gap-3 bg-white border border-red-200 rounded-xl px-4 py-3.5 text-sm text-red-800"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">Unable to fetch employee records</p>
                <p className="mt-0.5 text-red-700">{apiError}</p>
              </div>
            </div>
          )}

          {hasSearched && !isLoading && !apiError && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <p data-testid="results-count" className="text-sm text-slate-600">
                <span className="font-semibold tabular-nums text-slate-900 mr-0.5">
                  {employees.length}
                </span>{' '}
                matching {employees.length === 1 ? 'employee' : 'employees'} for{' '}
                <span className="font-medium text-slate-900">&ldquo;{lastQuery}&rdquo;</span>
              </p>

              {sourceStatus && (
                <div
                  data-testid="search-source-status"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600"
                >
                  {sourceStatus === 'api' ? (
                    <>
                      <Globe className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                      <span>Fetched from API</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                      <span>Loaded from cache</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            hasSearched={hasSearched}
            lastQuery={lastQuery}
            onReset={handleClear}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
