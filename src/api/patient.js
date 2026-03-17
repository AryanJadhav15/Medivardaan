/**
 * Patient API
 * Handles all patient-related API calls
 */

import axiosClient from "./client";

/**
 * Get patient by ID
 * @param {string} patientId 
 * @returns {Promise<Object>}
 */
export const getPatientById = async (patientId) => {
  const data = await axiosClient.get(`/api/Patient/GetPatientById`, {
    params: { patientId },
    baseURL: '',
  });
  return data; // axiosClient returns data
};

/**
 * Update patient details
 * @param {Object} patientData 
 * @returns {Promise<Object>}
 */
export const updatePatient = async (patientData) => {
  const data = await axiosClient.put(`/api/Patient/UpdatePatient`, patientData, {
      baseURL: ''
  });
  return data;
};

/**
 * Create new patient
 * @param {Object} patientData 
 * @returns {Promise<Object>}
 */
export const createPatient = async (patientData) => {
  const data = await axiosClient.post(`/api/Patient/CreatePatient`, patientData, {
      baseURL: ''
  });
  return data;
};

/**
 * Search patients
 * @param {Object} searchParams 
 * @returns {Promise<Array>}
 */
export const searchPatients = async (searchParams) => {
  const data = await axiosClient.get(`/api/Patient/SearchPatients`, {
    params: searchParams,
    baseURL: '',
  });
  return data;
};

/**
 * Upload patient profile image
 * @param {string} patientId 
 * @param {File} imageFile 
 * @returns {Promise<Object>}
 */
export const uploadPatientImage = async (patientId, imageFile) => {
  const formData = new FormData();
  formData.append("patientId", patientId);
  formData.append("image", imageFile);

  const data = await axiosClient.post(`/api/Patient/UploadImage`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    baseURL: '',
  });
  return data;
};

/**
 * Get all patients
 * @param {Object} params 
 * @returns {Promise<Array>}
 */
export const getAllPatients = async (params = {}) => {
  const data = await axiosClient.get(`/api/Patient/GetAllPatients`, {
    params,
    baseURL: '', // Force relative path to hit Next.js API proxy
  });
  return data;
};

// Default export for backward compatibility with `patientService` pattern
export const patientService = {
  getPatientById,
  updatePatient,
  createPatient,
  searchPatients,
  uploadPatientImage,
  getAllPatients,
};
