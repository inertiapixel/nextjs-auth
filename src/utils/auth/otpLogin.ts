// src/login/otpLogin.ts

import { AuthResponse, DecodedToken } from '../../types';
import { ApiClient } from '../apiClient';
import { parseToken } from '../tokenUtils';

const api = new ApiClient();

export interface OTPPayload {
  email: string;
  otp: string;
}

export interface OTPLoginServerResponse {
  accessToken: string;
  message?: string;
}

export const loginWithOTP = async (
  url: string,
  payload: OTPPayload
): Promise<AuthResponse> => {
  const data = await api.post<OTPLoginServerResponse, OTPPayload>(url, payload);

  if (!data.accessToken) {
    throw new Error('Access token missing in response');
  }

  const user: DecodedToken = parseToken(data.accessToken);

  return {
    isAuthenticated: true,
    accessToken: data.accessToken,
    message: data.message ?? '',
    user,
  };
};
