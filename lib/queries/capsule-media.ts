import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type CapsuleMedia = {
  id: string;
  capsule_id: string;
  kind: 'photo' | 'video' | 'audio';
  storage_provider: 'r2' | 'supabase';
  storage_key: string;
  size_bytes: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  order_index: number;
  created_at: string;
};

export function useCapsuleMedia(capsuleId: string | undefined) {
  return useQuery({
    queryKey: ['capsule-media', capsuleId],
    enabled: !!capsuleId,
    queryFn: async (): Promise<CapsuleMedia[]> => {
      if (!capsuleId) return [];
      const { data, error } = await supabase
        .from('capsule_media')
        .select('*')
        .eq('capsule_id', capsuleId)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return (data ?? []) as CapsuleMedia[];
    },
  });
}
