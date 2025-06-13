// src/utils/tokenUtils.ts
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  // Add more fields here if your token includes more
}

export const parseToken = (token: string): DecodedToken => {
  const decoded = jwtDecode<DecodedToken>(token);
  return {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
    avatar: decoded.avatar,
  };
};
