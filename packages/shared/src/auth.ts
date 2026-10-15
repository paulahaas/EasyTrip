import type { Role } from './roles';

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginDTO {
  /** Email ou nome de usuário. */
  login: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  username: string;
  password: string;
}

export interface UpdateProfileDTO {
  username: string;
}
