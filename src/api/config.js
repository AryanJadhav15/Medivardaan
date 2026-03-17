/**
 * API Configuration
 * Central configuration for all API endpoints and settings
 */

export const API_CONFIG = {
  // External API Base URL
  BASE_URL: "https://bmetrics.in/APIDemo/api",

  // Authentication credentials
  AUTH: {
    USERNAME: "Admin",
    PASSWORD: "#Ortho#$Admin",
  },

  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/Auth/Login",
    },
    DOCTOR: {
      GET_ALL: "/Doctor/search",
      GET_BY_ID: "/Doctor/GetDoctorById",
      UPDATE: "/Doctor/UpdateDoctorProfile",
      UPSERT: "/DoctorRegistration/UpsertDoctor",
      ADD: "/Doctor/AddDoctor",
      DELETE: "/Doctor", // DELETE /Doctor/{id}
    },
  },

  // Feature Flags
  FEATURES: {
    // Use mock fallback when external API fails
    USE_MOCK_FALLBACK_FOR_GET: false,
    USE_MOCK_FALLBACK_FOR_UPSERT: false,

    // Sync data to mock storage even when real API works
    // This ensures doctors appear in the list (since GetAllDoctors is broken)
    SYNC_TO_MOCK_STORAGE: false,
  },

  // Request timeout (milliseconds)
  TIMEOUT: 30000,

  // Token cache duration (milliseconds)
  TOKEN_CACHE_DURATION: 3600000, // 1 hour
};

export default API_CONFIG;
