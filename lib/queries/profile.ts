import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type Profile = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  inheritance_contact_id: string | null;
  inheritance_contact_name: string | null;
  inheritance_contact_email: string | null;
  inheritance_contact_phone: string | null;
  inheritance_contact_note: string | null;
  created_at: string;
  updated_at: string;
};

export type InheritanceInput = {
  inheritance_contact_name: string | null;
  inheritance_contact_email: string | null;
  inheritance_contact_phone: string | null;
  inheritance_contact_note: string | null;
};

const profileKey = ['profile'] as const;

export function useProfile() {
  return useQuery({
    queryKey: profileKey,
    queryFn: async (): Promise<Profile | null> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

export function useUpdateInheritance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: InheritanceInput): Promise<Profile> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(input)
        .eq('id', userData.user.id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKey });
    },
  });
}
