/**
 * Invoice Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllInvoices, deleteInvoice, getChequeDetails } from "@/api/invoices";

/**
 * Hook to fetch invoices
 * @param {Object} filters - Filter parameters
 * @param {Object} options - React Query options
 */
export const useInvoices = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: async () => {
      const data = await getAllInvoices(filters);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch cheque details
 */
export const useChequeDetails = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["cheque-details", filters],
    queryFn: async () => {
      const data = await getChequeDetails(filters);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to delete an invoice
 */
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
    },
  });
};
