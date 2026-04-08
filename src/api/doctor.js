/**
 * Doctor API Service
 * Handles all doctor-related API calls
 */

import axiosClient from "./client";
import { API_CONFIG } from "./config";
import { transformFormDataToAPI } from "@/utils/doctorTransformers";

/**
 * Add new doctor
 * @param {Object} doctorData - Doctor information
 * @returns {Promise<Object>} Response data
 */
export const addDoctor = async (doctorData) => {
  try {
    const response = await axiosClient.post(API_CONFIG.ENDPOINTS.DOCTOR.ADD, doctorData);
    return response;
  } catch (error) {
    console.error("Error adding doctor:", error);
    throw error;
  }
};

/**
 * Search doctors
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of doctors
 */
export const searchDoctors = async (params = {}) => {
  try {
    const response = await axiosClient.get(`/api${API_CONFIG.ENDPOINTS.DOCTOR.GET_ALL}`, {
      params,
      baseURL: ""
    });
    return response;
  } catch (error) {
    console.error("[Doctor API] Error searching doctors:", error);
    return [];
  }
};

/**
 * Fetch all doctors
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of doctors
 */
export const getAllDoctors = async (params = {}) => {
  try {
    return await searchDoctors(params);
  } catch (error) {
    console.error("[Doctor API] Error fetching doctors:", error);
    throw error;
  }
};

/**
 * Add or update a doctor
 * @param {Object} doctorData - Doctor information to upsert
 * @returns {Promise<{doctorID: number, success: boolean}>}
 */
export const upsertDoctor = async (doctorData) => {
  try {
    // Use the shared transformer which handles nulls correctly
    const payload = transformFormDataToAPI(doctorData);
    console.log("Submitting Doctor Payload:", JSON.stringify(payload, null, 2));

    // Remove 'mode' field as the API doesn't expect it
    const { mode, ...cleanPayload } = payload;

    let response;
    const isUpdate = cleanPayload.doctorID && cleanPayload.doctorID > 0;

    if (isUpdate) {
      console.log("Updating existing doctor (ID:", cleanPayload.doctorID, ")...");
      response = await axiosClient.put(
        `/api${API_CONFIG.ENDPOINTS.DOCTOR.UPDATE}`,
        cleanPayload,
        { baseURL: "" }
      );
    } else {
      console.log("Creating new doctor...");
      response = await axiosClient.post(
        `/api${API_CONFIG.ENDPOINTS.DOCTOR.ADD}`,
        cleanPayload,
        { baseURL: "" }
      );
    }

    const data = response; // axiosClient intercepts and returns data

    // MUST verify success block because sometimes the backend responds with HTTP 200 
    // but the actual payload claims IsSuccess: false.
    if (data && data.IsSuccess === false) {
      const serverMsg = data.Message || data.message || "Backend rejected the operation (IsSuccess: false).";
      throw new Error(serverMsg);
    }
    // Also guard against specific Keys if they map to failures
    if (data && data.Key >= 400 && data.Key <= 599) {
      const serverMsg = data.Message || data.message || `Backend returned error key ${data.Key}.`;
      throw new Error(serverMsg);
    }

    if (typeof data === 'number') {
      return { doctorID: data, success: true };
    }
    
    let doctorID = data?.doctorID || data?.DoctorID || data?.doctorId;
    if (!doctorID && data?.Data && (typeof data.Data === 'number' || typeof data.Data === 'string')) {
      doctorID = data.Data;
    }
    if (!doctorID && data?.data && (typeof data.data === 'number' || typeof data.data === 'string')) {
      doctorID = data.data;
    }

    if (doctorID) {
      return { ...data, doctorID, success: true };
    }

    return { ...data, success: true };
  } catch (error) {
    console.error("[Doctor API] Error saving doctor:", error);

    let errorMessage = "Failed to save doctor";

    if (error.response?.status === 500) {
      errorMessage = "Backend Server Error: The AddDoctor API endpoint is experiencing issues.";
    } else if (error.response?.status === 400) {
      errorMessage = `Validation Error: ${JSON.stringify(error.response.data)}`;
    } else if (error.response?.data) {
      errorMessage = error.response.data.message || error.response.data.Message || error.response.data.error || (typeof error.response.data === 'string' ? error.response.data : errorMessage);
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Delete a doctor
 * @param {number} doctorId - Doctor ID to delete
 * @returns {Promise<boolean>}
 */
export const deleteDoctor = async (doctorId) => {
  try {
    await axiosClient.delete(`${API_CONFIG.ENDPOINTS.DOCTOR.DELETE}/${doctorId}`);
    return true;
  } catch (error) {
    console.error("[Doctor API] Error deleting doctor:", error);
    throw error;
  }
};

/**
 * Get doctor by ID
 * @param {number} doctorId - Doctor ID
 * @returns {Promise<Object>} Doctor details
 */
export const getDoctorById = async (doctorId) => {
  try {
    console.log("[getDoctorById] Fetching for ID:", doctorId);
    
    // Fallback: Use Search API with DoctorID filter
    const response = await axiosClient.get(
      `/api${API_CONFIG.ENDPOINTS.DOCTOR.GET_ALL}`,
      {
        params: { DoctorID: doctorId },
        baseURL: ""
      }
    );

    const data = response; // axiosClient returns data
    // The backend search might ignore DoctorID query param, so we confidently filter locally.
    if (Array.isArray(data) && data.length > 0) {
        const found = data.find(d => String(d.doctorID || d.DoctorID) === String(doctorId));
        return found || data[0];
    }
    return data;
  } catch (error) {
    console.error("[Doctor API] Error fetching doctor:", error);
    throw error;
  }
};
