const API_URL = 'http://localhost:3001';

// Generic API functions
async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
}

async function post<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);
  return response.json();
}

async function put<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
  return response.json();
}

async function del(endpoint: string): Promise<void> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete ${endpoint}`);
}

// Product API
export const productAPI = {
  getAll: () => get<any[]>('/products'),
  getById: (id: string) => get<any>(`/products/${id}`),
  create: (data: any) => post<any>('/products', data),
  update: (id: string, data: any) => put<any>(`/products/${id}`, data),
  delete: (id: string) => del(`/products/${id}`),
};

// Receipt API
export const receiptAPI = {
  getAll: () => get<any[]>('/receipts'),
  getById: (id: string) => get<any>(`/receipts/${id}`),
  create: (data: any) => post<any>('/receipts', data),
  update: (id: string, data: any) => put<any>(`/receipts/${id}`, data),
  delete: (id: string) => del(`/receipts/${id}`),
};

// Delivery API
export const deliveryAPI = {
  getAll: () => get<any[]>('/deliveries'),
  getById: (id: string) => get<any>(`/deliveries/${id}`),
  create: (data: any) => post<any>('/deliveries', data),
  update: (id: string, data: any) => put<any>(`/deliveries/${id}`, data),
  delete: (id: string) => del(`/deliveries/${id}`),
};

// Transfer API
export const transferAPI = {
  getAll: () => get<any[]>('/transfers'),
  getById: (id: string) => get<any>(`/transfers/${id}`),
  create: (data: any) => post<any>('/transfers', data),
  update: (id: string, data: any) => put<any>(`/transfers/${id}`, data),
  delete: (id: string) => del(`/transfers/${id}`),
};

// Adjustment API
export const adjustmentAPI = {
  getAll: () => get<any[]>('/adjustments'),
  getById: (id: string) => get<any>(`/adjustments/${id}`),
  create: (data: any) => post<any>('/adjustments', data),
  update: (id: string, data: any) => put<any>(`/adjustments/${id}`, data),
  delete: (id: string) => del(`/adjustments/${id}`),
};

// Ledger API
export const ledgerAPI = {
  getAll: () => get<any[]>('/ledgerEntries'),
  getById: (id: string) => get<any>(`/ledgerEntries/${id}`),
  create: (data: any) => post<any>('/ledgerEntries', data),
};

// Warehouse API
export const warehouseAPI = {
  getAll: () => get<any[]>('/warehouses'),
  getById: (id: string) => get<any>(`/warehouses/${id}`),
  create: (data: any) => post<any>('/warehouses', data),
  update: (id: string, data: any) => put<any>(`/warehouses/${id}`, data),
  delete: (id: string) => del(`/warehouses/${id}`),
};

// Category API
export const categoryAPI = {
  getAll: () => get<any[]>('/categories'),
  getById: (id: string) => get<any>(`/categories/${id}`),
  create: (data: any) => post<any>('/categories', data),
  update: (id: string, data: any) => put<any>(`/categories/${id}`, data),
  delete: (id: string) => del(`/categories/${id}`),
};

// User API
export const userAPI = {
  getAll: () => get<any[]>('/users'),
  getById: (id: string) => get<any>(`/users/${id}`),
  update: (id: string, data: any) => put<any>(`/users/${id}`, data),
};
