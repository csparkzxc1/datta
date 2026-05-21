import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type Capsule = {
  id: string;
  author_id: string;
  child_id: string;
  title: string | null;
  body: string;
  unlock_at: string;
  milestone_key: string | null;
  is_sealed: boolean;
  is_delivered: boolean;
  sealed_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NewCapsuleInput = {
  child_id: string;
  title?: string | null;
  body: string;
  unlock_at: string;
  milestone_key?: string | null;
};

export const capsulesKey = ['capsules'] as const;

export function useCapsules() {
  return useQuery({
    queryKey: capsulesKey,
    queryFn: async (): Promise<Capsule[]> => {
      const { data, error } = await supabase
        .from('capsules')
        .select('*')
        .order('unlock_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Capsule[];
    },
  });
}

export function useCapsule(id: string | undefined) {
  return useQuery({
    queryKey: ['capsule', id],
    enabled: !!id,
    queryFn: async (): Promise<Capsule | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('capsules')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Capsule;
    },
  });
}

export function useCreateCapsule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewCapsuleInput): Promise<Capsule> => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('capsules')
        .insert({
          ...input,
          author_id: userData.user.id,
          is_sealed: false,
          is_delivered: false,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Capsule;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: capsulesKey });
    },
  });
}

export function useUpdateCapsule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      input: Partial<Pick<Capsule, 'title' | 'body' | 'unlock_at' | 'milestone_key'>>;
    }): Promise<Capsule> => {
      const { data, error } = await supabase
        .from('capsules')
        .update(params.input)
        .eq('id', params.id)
        .select()
        .single();
      if (error) throw error;
      return data as Capsule;
    },
    onSuccess: (_, params) => {
      qc.invalidateQueries({ queryKey: capsulesKey });
      qc.invalidateQueries({ queryKey: ['capsule', params.id] });
    },
  });
}

/**
 * 봉인 — is_sealed=true + sealed_at=now 설정.
 * RLS의 using(is_sealed=false)로 봉인 후에는 어떤 UPDATE도 차단됨.
 * 따라서 이 호출이 *마지막* 변경. §7.2 의례.
 */
export function useSealCapsule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<Capsule> => {
      const { data, error } = await supabase
        .from('capsules')
        .update({ is_sealed: true, sealed_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Capsule;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: capsulesKey });
      qc.invalidateQueries({ queryKey: ['capsule', id] });
    },
  });
}

export function useDeleteCapsule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from('capsules').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: capsulesKey });
    },
  });
}
