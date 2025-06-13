// src/utils/tokenStorage.ts

export const getToken = (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  };
  
  export const setToken = (key: string, token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, token);
    }
  };
  
  export const removeToken = (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  };
  