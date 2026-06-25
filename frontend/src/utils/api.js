import axios from 'axios';

// Local: proxy in package.json handles /api → localhost:5000
// Production: REACT_APP_API_URL = https://your-backend.railway.app
const BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : '/api';

const API = axios.create({ baseURL: BASE });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('brain2_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('brain2_token');
      localStorage.removeItem('brain2_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default API;