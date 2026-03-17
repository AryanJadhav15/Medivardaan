/**
 * Accounts API
 */
import axiosClient from "./client";

export const saveCancellationTreatment = async (data) => {
  const response = await axiosClient.post("/Accounts/SaveCancellationTreatment", data);
  return response; // axiosClient returns data
};
