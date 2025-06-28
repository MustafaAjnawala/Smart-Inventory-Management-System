import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  create: (productData) => api.post('/products', productData),
};

// Purchases API
export const purchasesAPI = {
  getAll: () => api.get('/purchases'),
  create: (purchaseData) => api.post('/purchases', purchaseData),
  getExpiring: () => api.get('/purchases/expiring'),
};

// Returns API
export const returnsAPI = {
  create: (returnData) => api.post('/returns', returnData),
};

// Bills API
export const billsAPI = {
  getAll: () => api.get('/bills'),
  create: (billData) => api.post('/bills', billData),
};

export default api;
