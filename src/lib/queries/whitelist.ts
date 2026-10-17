import { supabaseAdmin } from '@/utils/supabase/admin';

export interface WhitelistRecord {
  id: string;
  institutional_id: string;
  role: string;
  department_id?: string | null;
  batch?: string | null;
  is_claimed?: boolean;
  claimed_by?: string | null;
  email?: string | null;
  created_at?: string;
}

/**
 * Check if an institutional ID is in the whitelist and whether it's claimed
 */
export async function getWhitelistByInstitutionalId(institutionalId: string): Promise<WhitelistRecord | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('credential_whitelist')
      .select('id, institutional_id, role, department_id, batch, is_claimed, claimed_by')
      .ilike('institutional_id', institutionalId.trim())
      .maybeSingle();

    if (error || !data) return null;
    return data as WhitelistRecord;
  } catch (err) {
    console.error('getWhitelistByInstitutionalId error:', err);
    return null;
  }
}

/**
 * Mark a whitelisted institutional ID as claimed by a user
 */
export async function claimWhitelistRecord(whitelistId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('credential_whitelist')
      .update({
        is_claimed: true,
        claimed_by: userId,
      })
      .eq('id', whitelistId);

    return !error;
  } catch (err) {
    console.error('claimWhitelistRecord error:', err);
    return false;
  }
}

/**
 * Get all whitelist records for admin review
 */
export async function getAllWhitelistRecords() {
  try {
    const { data, error } = await supabaseAdmin
      .from('credential_whitelist')
      .select(`
        id,
        institutional_id,
        role,
        department_id,
        batch,
        is_claimed,
        claimed_by,
        created_at,
        departments (
          id,
          name,
          faculties (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getAllWhitelistRecords error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('getAllWhitelistRecords exception:', err);
    return [];
  }
}
