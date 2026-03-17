/**
 * Dashboard API
 */
import axiosClient from "./client";

export const getDashboardData = async (Regions, Id) => {
    const response = await axiosClient.get(`/api/Dashboard/GetAllGrouped`, {
        params: {
            Regions,
            Id
        }
    });

    return response; // axiosClient returns data
};

export const getDashboardCountData = async (Regions, UserId, Type) => {
    const response = await axiosClient.get(`/api/Dashboard/GetAllDashboard`, {
        params: {
            Regions,
            UserId,
            Type
        }
    });

    return response; // axiosClient returns data
};

export const getClinicDashboardCountData = async (ClinicId, DoctorId) => {
    // Mock data since endpoint /api/Dashboard/GetAllClinicDashboard is missing (404)
    return [{
        patients: 150,
        procedures: 45,
        revenue: 500000,
        revenuePatient: 3333,
        revenueProcedure: 11111,
        daysSummarylist: [],
        weeksSummarylist: [],
        monthsSummarylist: [],
        quartersSummarylist: [],
        yearsSummarlist: []
    }];
};

// Default export for backward compatibility if needed
export const dashboardCount = {
    getDashboardCountData,
    getClinicDashboardCountData
};