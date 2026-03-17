/**
 * Auth API
 * Handles authentication, token management, and login/logout
 */
import { API_CONFIG } from './config';
import axiosClient from './client';

class AuthService {
    constructor() {
        this.cachedToken = null;
        this.tokenExpiry = null;
    }

    /**
     * Check if token is still valid
     * @returns {boolean}
     */
    isTokenValid() {
        return this.cachedToken && this.tokenExpiry && Date.now() < this.tokenExpiry;
    }

    /**
     * Get authentication token
     * Returns cached token if still valid, otherwise fetches new token
     * @returns {Promise<string>} Authentication token
     */
    async getToken() {
        // Return cached token if still valid
        if (this.isTokenValid()) {
            return this.cachedToken;
        }

        try {
            // Use fetch to avoid circular dependency with axiosClient interceptors
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: API_CONFIG.AUTH.USERNAME,
                    userPassword: API_CONFIG.AUTH.PASSWORD,
                }),
            });

            if (!response.ok) {
                throw new Error(`Login failed! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Extract token from response (try different possible property names)
            this.cachedToken = data.token || data.accessToken || data.jwt || data.data || data;

            if (!this.cachedToken || typeof this.cachedToken !== 'string') {
                console.error('[Auth] Failed to extract valid token from response:', data);
                throw new Error('Invalid token received from auth server');
            }

            // Set token expiry
            this.tokenExpiry = Date.now() + API_CONFIG.TOKEN_CACHE_DURATION;

            return this.cachedToken;
        } catch (error) {
            console.error('[Auth] Authentication failed:', error.message);
            this.cachedToken = null;
            throw error;
        }
    }

    /**
     * Clear cached token
     */
    clearToken() {
        this.cachedToken = null;
        this.tokenExpiry = null;
    }
}

export const authService = new AuthService();

/**
 * Login user (UI Login)
 * @param {Object} credentials - { username, password }
 * @returns {Promise<Object>}
 */
export const login = async (credentials) => {
    // Note: The UI might use a different endpoint or the same one.
    // Assuming /Auth/Login based on config.
    const response = await axiosClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
};

export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
    }
};