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
  atendimento: number | string;
  idade: number | string;
  internacao?: Date | string | null;
  patologia: string;
  glim: Date | string | null;
  dignosticoGlim: number | string;
  desfecho: number | string;
  sexo: number | string;
  falenciaOrImuno: number | string;
  temperatura: number | string;
  pressao: number | string;
  freqCardiaca: number | string;
  freqRespiratoria: number | string;
  pao2: number | string;
  phOrHco3: number | string;
  sodio: number | string;
  potassio: number | string;
  creatinina: number | string;
  hematocrito: number | string;
  leucocitos: number | string;
  glasgow: number | string;
  ageApache: number | string;
  criticalHealth: number | string;
  risco?: number | string | undefined
  cirurgico?: number | string | undefined
}
