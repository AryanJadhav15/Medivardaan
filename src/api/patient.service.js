import axiosClient from "@/api/client";

// NOTE: axiosClient interceptor already unwraps response.data,
// so the result from axiosClient calls IS the data — return directly.

export const patientService = {
  // Get patient by ID — proxy at /api/Patient/GetPatientById reads ?patientId= query param
  getPatientById: async (patientId) => {
    const data = await axiosClient.get(`/api/Patient/GetPatientById`, {
      params: { patientId },
      baseURL: "",
    });
    return data;
  },

  // Upsert patient (Create/Update) — proxied to Patient/UpsertPatient
  upsertPatient: async (patientData) => {
    const data = await axiosClient.post(`/api/Patient/Upsert`, patientData, {
      baseURL: "",
    });
    return data;
  },

  // Update patient details
  updatePatient: async (patientData) => {
    const data = await axiosClient.put(`/api/Patient/UpdatePatient`, patientData);
    return data;
  },

  // Create new patient
  createPatient: async (patientData) => {
    const data = await axiosClient.post(`/api/Patient/CreatePatient`, patientData);
    return data;
  },

  // Search patients
  searchPatients: async (searchParams) => {
    const data = await axiosClient.get(`/api/Patient/SearchPatients`, {
      params: searchParams,
    });
    return data;
  },

  // Upload patient profile image
  uploadPatientImage: async (patientId, imageFile) => {
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("image", imageFile);

    const data = await axiosClient.post(`/api/Patient/UploadImage`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  // Get all patients
  getAllPatients: async () => {
    const data = await axiosClient.get(`/api/Patient/GetAllPatients`);
    return data;
  },
};
