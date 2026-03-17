/**
 * Reports API
 */
import axiosClient from "./client";

export const getPatientWiseReport = async (FromDate, ToDate) => {
    const response = await axiosClient.get(`/api/Report/GetClinicWiseReport`, {
        params: { FromDate, ToDate }
    });
    return response;
};

export const getTreatmentWiseReport = async (FromDate, ToDate) => {
    const response = await axiosClient.get(`/api/Report/GetTreatmentWiseReport`, {
        params: { FromDate, ToDate }
    });
    return response;
};

export const getDateWiseReport = async (FromDate, ToDate) => {
    const response = await axiosClient.get(`/api/Report/GetDateWiseReport`, {
        params: { FromDate, ToDate }
    });
    return response;
};

export const getPatientReport = async (FromDate, ToDate) => {
    const response = await axiosClient.get(`/api/Report/GetPatientsWiseReport`, {
        params: { FromDate, ToDate }
    });
    return response;
};

// Backward compatibility
export const reportsService = {
    getPatientWiseReport,
    getTreatmentWiseReport,
    getDateWiseReport,
    getPatientReport
};
