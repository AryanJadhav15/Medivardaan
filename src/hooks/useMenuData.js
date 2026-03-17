import { useQuery } from "@tanstack/react-query";
import { getAllMenu } from "@/api/menu";


export const useMenuData = (RoleId) => {
    return useQuery({
        queryKey: ['menuData', RoleId],
// queryFn: () => getAllMenu(RoleId),
        queryFn: async () => [],
        enabled: !!RoleId,
    })
}