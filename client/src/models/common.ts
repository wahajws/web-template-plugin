import type React from 'react';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ApiError is now a class exported from '@/services/http'
// Do not define it here anymore to avoid conflicts
// import { ApiError } from '@/services/http';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

// Common utility types
export type SortOrder = 'asc' | 'desc';
export type Theme = 'light' | 'dark';

// Form field types
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormFieldProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export interface iBaseServiceGeneric {
  getAllUrl: string;
  getByIdUrl: string;
  createUrl: string;
  updateUrl: string;
  deleteUrl: string;
  queryUrl?: string;
}