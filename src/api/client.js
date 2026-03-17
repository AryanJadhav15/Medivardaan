import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "./config"; // Updated import path

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || API_CONFIG.BASE_URL,
});

axiosClient.interceptors.request.use(
    (config) => {
        // Check for both token keys to support different auth flows
        // SAFEGUARD: Check if running in browser before accessing localStorage
        let token = null;
        if (typeof window !== 'undefined' && window.localStorage) {
             token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
        }
        
        // Only set the header if we found a token and it isn't already set (e.g. by manual override)
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Clean empty params: remove keys with undefined, null or empty string values
        if (config.params && typeof config.params === 'object') {
            Object.keys(config.params).forEach((key) => {
                const val = config.params[key];
                if (val === undefined || val === null) {
                    delete config.params[key];
                } else if (typeof val === 'string' && val.trim() === '') {
                    delete config.params[key];
                }
            });
            // If no params remain, delete the params object entirely
            if (Object.keys(config.params).length === 0) delete config.params;
        }

        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
            const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
            console.log('[Axios Request]', {
                method: config.method?.toUpperCase(),
                url: fullUrl,
                params: config.params,
                data: config.data,
            });
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosClient.interceptors.response.use(
    (response) => response.data, // IMPORTANT: Unwrap data to match previous behavior
    (error) => {

        if (error.response) {
            // Server responded with error status
            const errorDetails = {
                status: error.response.status || 'unknown',
                statusText: error.response.statusText || 'unknown',
                url: error.config?.url || 'unknown',
                fullUrl: (error.config?.baseURL || '') + (error.config?.url || ''),
                method: error.config?.method?.toUpperCase() || 'unknown',
                responseData: error.response.data || 'no data',
                headers: error.response.headers || 'no headers',
            };
            console.error('[Axios Error Response]', errorDetails);

            const errorMessage = error.response.data?.message || error.response.data?.error || "An unexpected error occurred.";

            // Handle specific HTTP status codes
            switch (error.response.status) {
                case 400:
                    toast.error(`Error: ${errorMessage}`);
                    break;
                case 401:
                    toast.error("Session expired. Please login again.");
                    // Only access localStorage in browser environment
                    if (typeof window !== 'undefined' && window.localStorage) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        localStorage.removeItem("userID");
                        // Redirect to login page
                        if (window.location.pathname !== '/') {
                             window.location.href = '/';
                        }
                    }
                    break;
                case 403:
                    toast.error("Access Forbidden. You do not have permission.");
                    break;
                case 404:
                    // Suppress 404 toasts for specific endpoints if needed, but generally good to show
                    console.error("❌ 404 Endpoint not found.");
                    // toast.error("Resource not found (404)."); 
                    break;
                case 500:
                    toast.error("Internal Server Error. Please contact support.");
                    break;
                default:
                    toast.error(`Error ${error.response.status}: ${errorMessage}`);
                    break;
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('[Axios Network Error]', error.request);
            toast.error("Network Error. Please check your internet connection.");
        } else {
            console.error('[Axios Error]', error.message);
            toast.error("An error occurred while setting up the request.");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
