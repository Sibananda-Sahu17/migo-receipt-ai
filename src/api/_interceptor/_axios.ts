import axios from 'axios';
import { API_URL_V1, BASE_API_URL } from '../../constants/staticUrls';

// Create an axios instance
export const AXIOS_INSTANCE = axios.create({
  baseURL: API_URL_V1,
  withCredentials: true, // Include cookies in requests
});

export const AXIOS_INSTANCE_BASE = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // Include cookies in requests
});

AXIOS_INSTANCE.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle connection refused errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
      console.error('Backend server is not running. Please start the server at localhost:8000');
      // You can show a toast notification here if you have access to toast
    }
    return Promise.reject(error);
  },
);

AXIOS_INSTANCE_BASE.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle connection refused errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
      console.error('Backend server is not running. Please start the server at localhost:8000');
    }
    return Promise.reject(error);
  },
);