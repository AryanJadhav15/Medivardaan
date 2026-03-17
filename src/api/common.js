/**
 * Common / Master Data API
 */
import axiosClient from "./client";

/**
 * Get all clinics
 * @returns {Promise<Array>} List of clinics
 */
/**
 * Get all clinics
 * @returns {Promise<Array>} List of clinics
 */
// API endpoint is currently missing/404. Returning mock data directly to avoid console errors.
export const getClinics = async () => {
    /*
    try {
        const response = await axiosClient.get("/api/Clinic/GetAllClinic");
        return response; 
    } catch (error) {
        console.warn("API /api/Clinic/GetAllClinic failed, using mock data.", error.message);
    */
        return [
            { clinicId: 1, clinicName: "Panvel" },
            { clinicId: 2, clinicName: "Pune" },
            { clinicId: 3, clinicName: "Mumbai" },
            { clinicId: 4, clinicName: "Nashik" }
        ]; 
    /*
    }
    */
};

/**
 * Get all specialities
 * @returns {Promise<Array>} List of specialities
 */
export const getSpecialities = async () => {
    /*
    try {
        const response = await axiosClient.get("/api/Master/GetSpeciality");
        return response;
    } catch (error) {
        console.warn("API /api/Master/GetSpeciality failed, using mock data.", error.message);
    */
        return [
            { id: 1, name: "General Dentist" },
            { id: 2, name: "Orthodontics" },
            { id: 3, name: "Periodontics" },
            { id: 4, name: "Prosthodontics" },
            { id: 5, name: "Endodontics" },
            { id: 6, name: "Pedodontics" },
            { id: 7, name: "Oral & Maxillofacial Surgery" },
            { id: 8, name: "Oral Pathology" },
            { id: 9, name: "Conservative Dentist" },
            { id: 10, name: "Aesthetic Dentist" }
        ];
    /*
    }
    */
};

/**
 * Get all doctor types
 * @returns {Promise<Array>} List of doctor types
 */
export const getDoctorTypes = async () => {
    /*
    try {
        const response = await axiosClient.get("/api/Master/GetDoctorType");
        return response;
    } catch (error) {
        console.warn("API /api/Master/GetDoctorType failed, using mock data.", error.message);
    */
        return [
            { id: 1, name: "Full Time" },
            { id: 2, name: "Part Time" },
            { id: 3, name: "Visiting" }
        ];
    /*
    }
    */
};

export const getCountries = async () => {
    try {
        // Mock fallback if API missing
        return [{ id: 1, name: "India" }, { id: 2, name: "USA" }];
    } catch (e) { return []; }
};

export const getStates = async (countryId) => {
    try {
        return [{ id: 1, name: "Maharashtra" }, { id: 2, name: "Delhi" }];
    } catch (e) { return []; }
};

export const getCities = async (stateId) => {
    try {
        return [{ id: 1, name: "Mumbai" }, { id: 2, name: "Pune" }, { id: 3, name: "Nashik" }, { id: 4, name: "Panvel" }];
    } catch (e) { return []; }
};

export const getDoctors = async (ClinicId) => {
    const response = await axiosClient.get(`/api/Doctor/search`, {
        params: { ClinicID: ClinicId }
    });
    return response;
};

export const getParameterTypeData = async (Regions, UserId, Type) => {
    const response = await axiosClient.get(`/api/Dashboard/GetAllGroupedType`, {
        params: {
            Regions,
            UserId,
            Type
        }
    });

    return response;
};

// Compatibility
export const getCommonData = {
    getDoctors,
    getClinics,
    getSpecialities,
    getDoctorTypes
};
