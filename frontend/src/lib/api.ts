import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// === Customers ===
export const fetchCustomers = (params?: Record<string, any>) =>
  api.get('/customers', { params }).then((r) => r.data);

export const fetchCustomerById = (id: string) =>
  api.get(`/customers/${id}`).then((r) => r.data);

export const createCustomer = (data: any) =>
  api.post('/customers', data).then((r) => r.data);

// === Orders ===
export const createOrder = (data: any) =>
  api.post('/orders', data).then((r) => r.data);

export const fetchOrdersByCustomer = (customerId: string, params?: Record<string, any>) =>
  api.get(`/orders/${customerId}`, { params }).then((r) => r.data);

// === Segments ===
export const fetchSegments = () =>
  api.get('/segments').then((r) => r.data);

export const fetchSegmentById = (id: string) =>
  api.get(`/segments/${id}`).then((r) => r.data);

export const createSegment = (data: any) =>
  api.post('/segments', data).then((r) => r.data);

export const updateSegment = (id: string, data: any) =>
  api.put(`/segments/${id}`, data).then((r) => r.data);

export const deleteSegment = (id: string) =>
  api.delete(`/segments/${id}`).then((r) => r.data);

export const previewSegment = (id: string, rules: any) =>
  api.post(`/segments/${id}/preview`, { rules }).then((r) => r.data);

// === Campaigns ===
export const fetchCampaigns = (params?: Record<string, any>) =>
  api.get('/campaigns', { params }).then((r) => r.data);

export const fetchCampaignById = (id: string) =>
  api.get(`/campaigns/${id}`).then((r) => r.data);

export const createCampaign = (data: any) =>
  api.post('/campaigns', data).then((r) => r.data);

export const updateCampaign = (id: string, data: any) =>
  api.put(`/campaigns/${id}`, data).then((r) => r.data);

export const deleteCampaign = (id: string) =>
  api.delete(`/campaigns/${id}`).then((r) => r.data);

export const launchCampaign = (id: string) =>
  api.post(`/campaigns/${id}/launch`).then((r) => r.data);

// === Analytics ===
export const fetchOverviewAnalytics = () =>
  api.get('/analytics/overview').then((r) => r.data);

export const fetchCampaignAnalytics = (id: string) =>
  api.get(`/analytics/campaigns/${id}`).then((r) => r.data);

// === AI ===
export const aiSuggestSegment = (description: string) =>
  api.post('/ai/suggest-segment', { description }).then((r) => r.data);

export const aiDraftMessage = (data: { segmentDescription: string; channel: string; tone?: string; goal?: string }) =>
  api.post('/ai/draft-message', data).then((r) => r.data);

export const aiGetInsights = () =>
  api.get('/ai/insights').then((r) => r.data);

export const aiChat = (message: string, history: { role: string; content: string }[]) =>
  api.post('/ai/chat', { message, history }).then((r) => r.data);

export default api;
