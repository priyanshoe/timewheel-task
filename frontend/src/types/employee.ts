export interface Employee {
  id: number;
  name: string;
  email: string;
  dob: string;
  department: string;
  position: string;
}

export interface SearchApiResponse {
  success: boolean;
  message: string;
  data: Employee[];
}

export type DataSourceStatus = 'api' | 'cache' | null;
