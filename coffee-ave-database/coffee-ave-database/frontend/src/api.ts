import type { Product, UserNotification, VehicleQueueItem } from './types';

export interface RegisterInput {
  name: string;
  email: string;
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

export const api = {
  products: () => getList<Product>('/api/products'),
  vehicles: () => getList<VehicleQueueItem>('/api/vehicles'),
  notifications: () => getList<UserNotification>('/api/notifications'),
  register: (input: RegisterInput) =>
    request<{ id: string }>('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
};
