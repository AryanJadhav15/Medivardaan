/**
 * Doctors Query Hook
 * React Query hook for fetching doctors data
 */

import { useQuery } from "@tanstack/react-query";
import { getAllDoctors, getDoctorById } from "@/api/doctor";
import { transformAPIDoctorToDisplay } from "@/utils/doctorTransformers";

/**
 * Hook to fetch all doctors
 * @param {Object} filters - Filter parameters
 * @param {Object} options - React Query options
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
export const useDoctors = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["doctors", filters],
    queryFn: async () => {
      const data = await getAllDoctors(filters);
      console.log('Raw Doctor Data:', data?.[0]); // Debugging
      console.log('First 3 Doctor IDs:', data?.slice(0, 3).map(d => d.DoctorID || d.doctorID)); // Debugging IDs

      // Transform data for display
      if (Array.isArray(data)) {
        return data.map((doctor, index) =>
          transformAPIDoctorToDisplay({ ...doctor, srNo: index + 1 })
        );
      }

      return [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
    ...options,
  });
};

/**
 * Hook to fetch a single doctor by ID
 * @param {number} doctorId - Doctor ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useDoctor = (doctorId, options = {}) => {
  return useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const data = await getDoctorById(doctorId);
      return data;
    },
    enabled: !!doctorId, // Only run if doctorId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
