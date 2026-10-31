/**
 * Uzhavan Hub - Client API Service
 * Central communication layer for all 23 backend modules
 */

const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('uzhavan_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: Request failed`);
    }
    return data;
  } catch (err) {
    console.error(`[API Error: ${endpoint}]`, err);
    throw err;
  }
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  demoLogin: (persona) => request('/auth/demo-login', { method: 'POST', body: { persona } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),

  // Plots
  listPlots: () => request('/plots'),
  addPlot: (data) => request('/plots', { method: 'POST', body: data }),
  updatePlot: (id, data) => request(`/plots/${id}`, { method: 'PUT', body: data }),
  deletePlot: (id) => request(`/plots/${id}`, { method: 'DELETE' }),
  activatePlot: (id) => request(`/plots/${id}/activate`, { method: 'POST' }),

  // Crop Engine & Intelligence
  getRecommendations: (params = '') => request(`/crops/recommendations?${params}`),
  wizardRecommendations: (data) => request('/crops/wizard', { method: 'POST', body: data }),
  getRiskAlerts: (district = '') => request(`/crops/risk?district=${encodeURIComponent(district)}`),
  getComparisonTable: (acres = 1.0) => request(`/crops/comparison?acres=${acres}`),
  doctorScan: (data) => request('/crops/doctor', { method: 'POST', body: data }),

  // Weather & Mandi
  getWeather: (district = '') => request(`/weather?district=${encodeURIComponent(district)}`),
  getMarketPrices: (params = '') => request(`/market/prices?${params}`),
  calculateProceeds: (data) => request('/market/calculate-proceeds', { method: 'POST', body: data }),

  // Services: Labour & Machinery
  getLabourListings: (params = '') => request(`/services/labour?${params}`),
  bookLabour: (data) => request('/services/labour/book', { method: 'POST', body: data }),
  getMyLabourBookings: () => request('/services/labour/my-bookings'),

  getMachineryListings: (params = '') => request(`/services/machinery?${params}`),
  bookMachinery: (data) => request('/services/machinery/book', { method: 'POST', body: data }),
  getMyMachineryBookings: () => request('/services/machinery/my-bookings'),

  // Veterinary, Schemes & Loans
  getVeterinary: (district = '') => request(`/veterinary?district=${encodeURIComponent(district)}`),
  getSchemes: () => request('/schemes'),
  checkSchemeEligibility: (data) => request('/schemes/check-eligibility', { method: 'POST', body: data }),
  calculateLoan: (data) => request('/loans/calculate', { method: 'POST', body: data }),

  // Community
  getPosts: (params = '') => request(`/community/posts?${params}`),
  createPost: (data) => request('/community/posts', { method: 'POST', body: data }),
  getReplies: (postId) => request(`/community/posts/${postId}/replies`),
  createReply: (postId, content) => request(`/community/posts/${postId}/replies`, { method: 'POST', body: { content } }),
  likePost: (postId) => request(`/community/posts/${postId}/like`, { method: 'POST' }),

  // Action Plan & Fertilizer
  getCalendarTasks: (plotId = '') => request(`/calendar/tasks?plotId=${plotId}`),
  toggleTask: (taskId, isCompleted) => request(`/calendar/tasks/${taskId}`, { method: 'PATCH', body: { isCompleted } }),
  calculateFertilizer: (data) => request('/fertilizer/calculate', { method: 'POST', body: data }),

  // FarmLingo & Assistant
  getLingoData: () => request('/lingo/glossary'),
  translateLingo: (data) => request('/lingo/translate', { method: 'POST', body: data }),
  assistantChat: (data) => request('/assistant/chat', { method: 'POST', body: data })
};
