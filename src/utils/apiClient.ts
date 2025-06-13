// src/utils/ApiClient.ts

type Headers = Record<string, string>;

export class ApiClient {
  async post<TResponse, TRequest = unknown>(
    url: string,
    body: TRequest,
    headers: Headers = {}
  ): Promise<TResponse> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Request failed');
    }

    return response.json() as Promise<TResponse>;
  }

  async get<TResponse>(url: string, headers: Headers = {}): Promise<TResponse> {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Request failed');
    }

    return response.json() as Promise<TResponse>;
  }

  async put<TResponse, TRequest = unknown>(
    url: string,
    body: TRequest,
    headers: Headers = {}
  ): Promise<TResponse> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Request failed');
    }

    return response.json() as Promise<TResponse>;
  }

  async delete<TResponse>(url: string, headers: Headers = {}): Promise<TResponse> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Request failed');
    }

    return response.json() as Promise<TResponse>;
  }
}

export const apiClient = new ApiClient();
