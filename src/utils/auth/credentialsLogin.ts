// src/login/credentialsLogin.ts

import { AuthResponse } from '../../types';
import { ApiClient } from '../../utils/apiClient';
import { parseToken } from '../../utils/tokenUtils';

const api = new ApiClient();

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  message?: string;
}



export const loginWithCredentials = async (
  url: string,
  credentials: Credentials
): Promise<AuthResponse> => {
  const data = await api.post<LoginResponse, Credentials>(url, credentials);
  const user = parseToken(data.accessToken);
  return {
    isAuthenticated: true,
    accessToken: data.accessToken,
    message: data.message ?? '',
    user,
  };
};
