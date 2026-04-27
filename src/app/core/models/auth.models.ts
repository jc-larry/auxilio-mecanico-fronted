export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;

  full_name: string;
  password: string;
  confirm_password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: number;
  email: string;

  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login: string | null;
  roles?: string[];
  permissions?: string[];
  taller_id?: number;
}

export interface ApiError {
  detail: string | ValidationError[];
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}
