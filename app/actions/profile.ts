'use server';

import { createAdminClient } from '@/lib/supabase-server';

export async function upsertProfile(id: string, email: string, updates: any) {
  try {
    const adminAuth = createAdminClient();
    
    // Explicitly use the admin client to bypass RLS for inserting profiles
    const { error } = await adminAuth
      .from('profiles')
      .upsert({ 
        id, 
        email, 
        ...updates 
      });
      
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Server Action Upsert Profile Error:', error.message || error);
    throw new Error(error.message || 'Failed to upsert profile.');
  }
}
