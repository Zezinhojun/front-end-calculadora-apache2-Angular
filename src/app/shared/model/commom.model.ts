export interface CommonFields {
  email: string;
  password?: string;
}

export interface User extends CommonFields {
  _id: string;
  name: string;
  token?: string;
}

export interface LoginPayload extends CommonFields { }

export interface RegisterPayload extends CommonFields {
  name: string;
}

export interface ApiResponse<T> {
  status?: boolean;
  success?: boolean;
  token?: string;
  message?: string;
  error?: string;
  data: T;
}

export interface ISheetsResponse {
  majorDimension?: string;
  range?: string;
  values: (string | number)[][];
}

export interface IPaciente {
  atendimento: number;
  idade: number;
  internacao?: string
  patologia: string
}
