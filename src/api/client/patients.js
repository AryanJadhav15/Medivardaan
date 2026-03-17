import axiosClient from "@/api/client";

export const patientService = {
  // Get patient by ID
  getPatientById: async (patientId) => {
    const response = await axiosClient.get(`/api/Patient/GetPatientById/${patientId}`, {
      baseURL: '',
    });
    return response;
  },

  // Update patient details
  updatePatient: async (patientData) => {
    const response = await axiosClient.put(`/api/Patient/UpdatePatient`, patientData, { baseURL: '' });
    return response;
  },

  // Create new patient
  createPatient: async (patientData) => {
    const response = await axiosClient.post(`/api/Patient/CreatePatient`, patientData, { baseURL: '' });
    return response;
  },

  // Search patients
  searchPatients: async (searchParams) => {
    const response = await axiosClient.get(`/api/Patient/SearchPatients`, {
      baseURL: '',
      params: searchParams,
    });
    return response;
  },

  // Upload patient profile image
  uploadPatientImage: async (patientId, imageFile) => {
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("image", imageFile);

    const response = await axiosClient.post(`/api/Patient/UploadImage`, formData, {
      baseURL: '',
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  // Get all patients
  getAllPatients: async (params = {}) => {
    const response = await axiosClient.get(`/api/Patient/GetAllPatients`, {
      baseURL: '',
      params,
    });
    return response;
  },
};
