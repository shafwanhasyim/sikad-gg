import axios from "axios";

// Get the base URL from environment variable or use default
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add additional headers to help with CORS
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  },
  // Configure longer timeout for slow connections
  timeout: 15000
});

// Add request interceptor to handle common request issues
api.interceptors.request.use(
  (config) => {
    // Log all outgoing requests in development mode
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, 
        config.data ? 'with data' : 'without data');
    }
    
    // Add timestamp to GET requests to prevent caching issues
    if (config.method.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
    }
    
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in dev mode
    if (import.meta.env.DEV) {
      console.log(`API Response from ${response.config.url}:`, 
        typeof response.data === 'object' ? 'data received' : response.data);
    }
    
    // Ensure data is not null/undefined
    if (response.data === null || response.data === undefined) {
      console.warn(`Response for ${response.config.url} returned null/undefined data`);
      // Return empty array or object based on the expected response type
      if (Array.isArray(response.data)) {
        response.data = [];
      } else if (typeof response.data === 'object' || response.data === null) {
        response.data = {};
      }
    }
    
    return response;
  },
  (error) => {
    // Get request details for better error reporting
    const requestUrl = error.config?.url || 'unknown endpoint';
    const requestMethod = error.config?.method?.toUpperCase() || 'unknown method';
    
    // Log error details to console for debugging
    console.error(`API Error (${requestMethod} ${requestUrl}):`, 
      error.response?.data || error.message);
    
    // Check if the error is related to routing (404)
    if (error.response && error.response.status === 404) {
      console.error(`Route not found: ${requestUrl}. Make sure your API endpoints are correct.`);
    }
    
    // Handle network errors explicitly
    if (error.code === 'ERR_NETWORK') {
      console.error("Network error: Could not connect to the API server. Please check your connection.");
      
      // For network errors, we might want to offer a retry mechanism
      error.retry = () => {
        return api(error.config);
      };
    }
    
    // Handle CORS errors
    if (error.message?.includes('CORS')) {
      console.error("CORS error detected. This may be an issue with API configuration.");
    }
    
    // Enhance error with more useful information
    const enhancedError = {
      ...error,
      message: error.response?.data?.message || error.message || 'An unknown error occurred',
      status: error.response?.status,
      isAxiosError: true,
      endpoint: requestUrl,
      method: requestMethod
    };
    
    return Promise.reject(enhancedError);
  }
);

export default api;
