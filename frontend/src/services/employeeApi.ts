import axios from 'axios';
import type { SearchApiResponse } from '../types/employee';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

export async function fetchEmployeesByQuery(query: string): Promise<SearchApiResponse> {
  try {
    const response = await apiClient.get<SearchApiResponse>('/employees/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        (error.response?.data as { message?: string } | undefined)?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Search request timed out. Please try again.');
      }
      throw new Error('Unable to reach the employee directory service. Please try again.');
    }
    throw new Error('An unexpected error occurred while searching employees.');
  }
}
