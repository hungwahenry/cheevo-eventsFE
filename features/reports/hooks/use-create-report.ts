import { createReport } from '@/features/reports/api';
import type { CreateReportPayload } from '@/features/reports/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export function useCreateReport() {
  return useMutation({
    mutationFn: (payload: CreateReportPayload) => createReport(payload),
    onSuccess: () => {
      toast.success('Report sent. Our team will take a look.');
    },
  });
}
