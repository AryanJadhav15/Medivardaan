/**
 * Reports API
 */
import axiosClient from "./client";

export const getPatientWiseReport = async (FromDate, ToDate) => {
  const response = await axiosClient.get(`/api/Report/GetClinicWiseReport`, {
    params: { FromDate, ToDate },
  });
  return response;
};

export const getTreatmentWiseReport = async (FromDate, ToDate) => {
  const response = await axiosClient.get(`/api/Report/GetTreatmentWiseReport`, {
    params: { FromDate, ToDate },
  });
  return response;
};

export const getDateWiseReport = async (FromDate, ToDate) => {
  const response = await axiosClient.get(`/api/Report/GetDateWiseReport`, {
    params: { FromDate, ToDate },
  });
  return response;
};

export const getPatientReport = async (FromDate, ToDate) => {
  const response = await axiosClient.get(`/api/Report/GetPatientsWiseReport`, {
    params: { FromDate, ToDate },
  });
  return response;
};

export const getDoctorCollectionReport = async (FromDate, ToDate) => {
  // Must use fetch (not axiosClient) to call the local Next.js proxy route.
  // axiosClient's baseURL points to the external backend, which would cause a double-path error.
  const params = new URLSearchParams();
  if (FromDate) params.append("FromDate", FromDate);
  if (ToDate) params.append("ToDate", ToDate);

  let authHeader = "";
  if (typeof window !== "undefined" && window.localStorage) {
    const token =
      localStorage.getItem("token") || localStorage.getItem("jwt_token");
    if (token) authHeader = `Bearer ${token}`;
  }

  const response = await fetch(
    `/api/Report/GetDoctorCollectionReport?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
};

export const getContactDetails = async ({ PageNumber = 1, PageSize = 10, Name = "" } = {}) => {
  let authHeader = "";
  if (typeof window !== "undefined" && window.localStorage) {
    const token =
      localStorage.getItem("token") || localStorage.getItem("jwt_token");
    if (token) authHeader = `Bearer ${token}`;
  }

  const params = new URLSearchParams();
  params.append("PageNumber", PageNumber);
  params.append("PageSize", PageSize);
  if (Name) params.append("Name", Name);

  const response = await fetch(`/api/Report/GetContactDetails?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader && { Authorization: authHeader }),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
};

// Backward compatibility
export const reportsService = {
  getPatientWiseReport,
  getTreatmentWiseReport,
  getDateWiseReport,
  getPatientReport,
  getDoctorCollectionReport,
  getContactDetails,
};
