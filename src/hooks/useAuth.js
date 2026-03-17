import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";

export const useLogin = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const data = await login(payload);
            return data;
        }
    });
};
