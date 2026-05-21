import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type Gender = 'male' | 'female' | 'other';
export type Relationship = 'parent' | 'grandparent' | 'guardian';

export type Child = {
  id: string;
  parent_id: string;
  name: string;
  birthdate: string;
  gender: Gender | null;
  relationship: Relationship;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type NewChildInput = {
  name: string;
  birthdate: string;
  gender: Gender | null;
  relationship: Relationship;
};

export const childrenKey = ['children'] as const;

export function useChildren() {
  return useQuery({
    queryKey: childrenKey,
    queryFn: async (): Promise<Child[]> => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('birthdate', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Child[];
    },
  });
}

export function useAddChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewChildInput): Promise<Child> => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('children')
        .insert({ ...input, parent_id: userData.user.id })
        .select()
        .single();
      if (error) throw error;
      return data as Child;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childrenKey });
    },
  });
}

export function useUpdateChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; input: Partial<NewChildInput> }): Promise<Child> => {
      const { data, error } = await supabase
        .from('children')
        .update(params.input)
        .eq('id', params.id)
        .select()
        .single();
      if (error) throw error;
      return data as Child;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childrenKey });
    },
  });
}

export function useDeleteChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from('children').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childrenKey });
    },
  });
}
