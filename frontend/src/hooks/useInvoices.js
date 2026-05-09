import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/invoiceService.js';

export function useInvoices(params) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => invoiceService.getAll(params),
  });
}

export function useInvoice(id) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getById(id),
    enabled: !!id,
  });
}

export function useInvoiceStats() {
  return useQuery({
    queryKey: ['invoice-stats'],
    queryFn: () => invoiceService.getStats(),
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useUpdateStatut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut }) => invoiceService.updateStatut(id, statut),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['invoice'] });
      qc.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
}
