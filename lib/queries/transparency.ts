import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type TransparencyReport = {
  id: string;
  quarter: string;
  total_users: number;
  total_capsules: number;
  total_storage_gb: number;
  monthly_burn_krw: number | null;
  runway_months: number | null;
  published_at: string;
};

export function useTransparencyReports() {
  return useQuery({
    queryKey: ['transparency_reports'],
    queryFn: async (): Promise<TransparencyReport[]> => {
      const { data, error } = await supabase
        .from('transparency_reports')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as TransparencyReport[];
    },
  });
}
