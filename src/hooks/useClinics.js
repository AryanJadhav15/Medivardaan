import { useQuery } from "@tanstack/react-query";
import { getCommonData } from "@/api/common";

export const useClinics = () => {
    return useQuery({
        queryKey: ['doctorsData'],
        queryFn: () => getCommonData?.getClinics(),
        // enabled: !!ClinicId,
    })
}

