/**
 * Hooks for Accounts Module
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCancellationTreatment } from "@/api/accounts";
import { toast } from "sonner"; // Assuming sonner is used, or generic toast

/**
 * Hook to save cancellation treatment
 */
export const useSaveCancellationTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCancellationTreatment,
    onSuccess: () => {
      toast.success("Cancellation treatment saved successfully!");
      // Invalidate relevant queries if needed
      // queryClient.invalidateQueries(["cancellations"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to save cancellation treatment.");
    },
  });
};
