import { useEffect, useState } from 'react';
import { useUser } from '@clerk/expo';
import { useSupabase } from '@/Hooks/useSupabase';

export const useSavedProperty = (propertyId: string, onUnsave?: () => void) => {
    const { user } = useUser();
    const supabase = useSupabase();
    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const checkSaved = async () => {
            const { data } = await supabase
                .from('saved_properties')
                .select('id')
                .eq('user_clerk_id', user.id)
                .eq('property_id', propertyId)
                .single();
            setIsSaved(!!data);
        };
        checkSaved();
    }, [user, propertyId]);

    const toggleSave = async () => {
        if (!user || saveLoading) return;
        setSaveLoading(true);
        if (isSaved) {
            await supabase
                .from('saved_properties')
                .delete()
                .eq('user_clerk_id', user.id)
                .eq('property_id', propertyId);
            setIsSaved(false);
            onUnsave?.();
        } else {
            await supabase
                .from('saved_properties')
                .insert({ user_clerk_id: user.id, property_id: propertyId });
            setIsSaved(true);
        }
        setSaveLoading(false);
    };

    return { isSaved, saveLoading, toggleSave };
};
