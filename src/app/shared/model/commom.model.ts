export interface CommonFields {
  email: string;
  password: string;
}

export interface User extends CommonFields {
  _id: string;
  name: string;
}

export interface LoginPayload extends CommonFields { }

export interface RegisterPayload extends CommonFields {
  name: string;
}

export interface ApiResponse<T> {
  status?: boolean;
  token?: string;
  message?: string;
  error?: string;
  data: T;
}
