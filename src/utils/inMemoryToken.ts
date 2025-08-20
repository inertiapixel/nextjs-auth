// -------------------------
// In-memory token store
// -------------------------

let inMemoryToken: string | null = null;

export const getToken = (): string | null => inMemoryToken;

export const setToken = (token: string): void => {
  inMemoryToken = token;
};

export const removeToken = (): void => {
  inMemoryToken = null;
};
