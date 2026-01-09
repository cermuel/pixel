export interface LoginResponse {
  message: string;
  token: string;
  data: { userId: string | number; phone: string; role: string; email: string | null };
}
export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}
export interface RegisterResponse {
  message: string;
  data: unknown;
}
export interface RegisterPayload {
  email?: string;
  phone: string;
  name: string;
  password: string;
}

export interface Error {
  status: number;
  data: {
    message: string;
  };
}
