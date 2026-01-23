export interface User {
  id: number;
  email: string;
  name: string;
  lastname: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  password?: string;
  photoUrl?: string;
  googleId?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserDTO {
  id?: number;
  email: string;
  name: string;
  lastname?: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  password?: string;
}
