import { SearchX, Users } from 'lucide-react';
import type { Employee } from '../types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  hasSearched: boolean;
  lastQuery: string;
  onReset: () => void;
}

const SKELETON_ROWS = [1, 2, 3, 4, 5];

export function EmployeeTable({
  employees,
  isLoading,
  hasSearched,
  lastQuery,
  onReset,
}: EmployeeTableProps) {
  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading employee search results"
        className="bg-white border border-slate-200 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th scope="col" className="py-3 px-4 w-20">ID</th>
                <th scope="col" className="py-3 px-4">Name</th>
                <th scope="col" className="py-3 px-4">Email</th>
                <th scope="col" className="py-3 px-4">Date of Birth</th>
                <th scope="col" className="py-3 px-4">Department</th>
                <th scope="col" className="py-3 px-4">Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SKELETON_ROWS.map((row) => (
                <tr key={row} className="h-[46px]">
                  <td className="py-3 px-4">
                    <div className="h-4 w-8 bg-slate-200 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-14 text-center">
        <div className="mx-auto mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
          <Users className="w-5 h-5" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">
          Search the employee directory
        </h2>
        <p className="mt-1.5 max-w-md mx-auto text-sm text-slate-500 leading-relaxed">
          Enter an employee ID, full name, email address, date of birth (YYYY-MM-DD),
          department, or job position, then press Search or Enter.
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div
        data-testid="empty-results-state"
        className="bg-white border border-slate-200 rounded-xl px-6 py-14 text-center"
      >
        <div className="mx-auto mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
          <SearchX className="w-5 h-5" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">
          No matching employees found
        </h2>
        <p className="mt-1.5 max-w-md mx-auto text-sm text-slate-500 leading-relaxed">
          No employee records matched{' '}
          <span className="font-medium text-slate-800">&ldquo;{lastQuery}&rdquo;</span>.
          Try another name, department, ID, or date of birth.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
        >
          Clear search
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
              <th scope="col" className="py-3 px-4 whitespace-nowrap w-20">
                ID
              </th>
              <th scope="col" className="py-3 px-4 whitespace-nowrap">
                Name
              </th>
              <th scope="col" className="py-3 px-4 whitespace-nowrap">
                Email
              </th>
              <th scope="col" className="py-3 px-4 whitespace-nowrap">
                Date of Birth
              </th>
              <th scope="col" className="py-3 px-4 whitespace-nowrap">
                Department
              </th>
              <th scope="col" className="py-3 px-4 whitespace-nowrap">
                Position
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-3 px-4 font-mono tabular-nums text-xs text-slate-500 whitespace-nowrap">
                  {employee.id}
                </td>
                <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                  {employee.name}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <a
                    href={`mailto:${employee.email}`}
                    className="text-slate-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    {employee.email}
                  </a>
                </td>
                <td className="py-3 px-4 font-mono tabular-nums text-xs text-slate-600 whitespace-nowrap">
                  {employee.dob}
                </td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                  {employee.department}
                </td>
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                  {employee.position}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sm:hidden border-t border-slate-100 bg-slate-50/70 px-4 py-2 text-xs text-slate-500">
        Swipe horizontally to view all columns
      </div>
    </div>
  );
}
