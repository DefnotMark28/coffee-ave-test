import type { Member, Product, UserNotification, VehicleQueueItem } from './types';

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  plateNumber: string;
  vehicleModel: string;
  membership: 'unli' | 'club';
}

export interface ProfileInput {
  name: string;
  plateNumber: string;
  vehicleModel: string;
  membership: 'unli' | 'club';
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // The server did not send JSON.
  }

  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body ? String((body as { error: unknown }).error) : 'Could not reach the server.';
    throw new Error(message);
  }
  return body as T;
}

async function getList<T>(url: string): Promise<T[]> {
  const list = await request<unknown>(url);
  if (!Array.isArray(list)) throw new Error('Unexpected reply from the server.');
  return list as T[];
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const api = {
  products: () => getList<Product>('/api/products'),
  vehicles: () => getList<VehicleQueueItem>('/api/vehicles'),
  notifications: () => getList<UserNotification>('/api/notifications'),

  me: async () => (await request<{ user: Member | null }>('/api/auth/me')).user,
  signUp: (input: SignUpInput) => request<Member>('/api/auth/signup', json('POST', input)),
  signIn: (email: string, password: string) => request<Member>('/api/auth/login', json('POST', { email, password })),
  signOut: () => request<unknown>('/api/auth/logout', json('POST')),
  updateProfile: (input: ProfileInput) => request<Member>('/api/me', json('PUT', input)),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<unknown>('/api/me/password', json('PUT', { currentPassword, newPassword })),
};
