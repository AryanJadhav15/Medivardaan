import { useQuery } from "@tanstack/react-query";
import { getClinics, getSpecialities, getDoctorTypes } from "@/api/common";

export const useClinics = () => {
    return useQuery({
        queryKey: ['clinics'],
        queryFn: getClinics,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useSpecialities = () => {
    return useQuery({
        queryKey: ['specialities'],
        queryFn: getSpecialities,
        staleTime: 1000 * 60 * 60,
    });
};

export const useDoctorTypes = () => {
    return useQuery({
        queryKey: ['doctorTypes'],
        queryFn: getDoctorTypes,
        staleTime: 1000 * 60 * 60,
    });
};

export const useCountries = () => {
    return useQuery({
        queryKey: ['countries'],
        queryFn: (() => import("../api/common").then(m => m.getCountries())),
        staleTime: Infinity,
    });
};

export const useStates = (countryId) => {
    return useQuery({
        queryKey: ['states', countryId],
        queryFn: (() => import("../api/common").then(m => m.getStates(countryId))),
        enabled: !!countryId,
    });
};

export const useCities = (stateId) => {
    return useQuery({
        queryKey: ['cities', stateId],
        queryFn: (() => import("../api/common").then(m => m.getCities(stateId))),
        enabled: !!stateId,
    });
};
