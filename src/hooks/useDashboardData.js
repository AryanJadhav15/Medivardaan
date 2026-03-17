"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/api/dashboard";

export const useDashboardData = (Regions, Id) => {
    return useQuery({
        queryKey: ['dashboardData', Regions, Id],
        queryFn: () => getDashboardData(Regions, Id),
        enabled: !!Regions && !!Id,
    })
}