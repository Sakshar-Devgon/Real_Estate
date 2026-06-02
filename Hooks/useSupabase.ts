import { useAuth } from '@clerk/expo';
import { useMemo } from 'react';
import { createClerkSupabaseClient } from '../lib/supabase';

export const useSupabase = () => {
    const { getToken } = useAuth();
    return useMemo(() => createClerkSupabaseClient(() => getToken({ template: 'supabase' })), [getToken]);
};
