import { User } from './auth.models';

export interface UserUpdate {
  full_name?: string;
  is_active?: boolean;
  roles?: string[];
}

export interface PaginatedUserResponse {
  items: User[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
