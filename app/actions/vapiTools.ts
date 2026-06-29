'use server';

import { supabase } from '@/lib/supabase';

export async function syncToStoneAppCRM(
  phone: string,
  args: { customerName?: string; projectType?: string; materialClass?: string }
) {
  // Sanitize input properties to prevent array/nested payload pollution
  const safeCustomerName = typeof args?.customerName === 'string' ? args.customerName.slice(0, 100) : 'Unknown';
  const safeProjectType = typeof args?.projectType === 'string' ? args.projectType.slice(0, 150) : 'Unknown';
  const safeMaterialClass = typeof args?.materialClass === 'string' ? args.materialClass.slice(0, 100) : 'Unknown';

  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    // Mutate and retrieve only the minimum required identifier columns
    const { error } = await supabase
      .from('leads')
      .update({
        customer_name: safeCustomerName,
        project_scope: safeProjectType,
        material_preference: safeMaterialClass,
        current_status: 'MOCK_CRM_SYNCED',
      })
      .eq('customer_phone', phone)
      .select('id, current_status'); // Narrow query surface to reduce WebSocket payload size

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      message: 'Profile synchronized with CRM successfully.',
    };
  } catch (error) {
    console.error('[syncToStoneAppCRM] Database exception:', error);

    // Fallback: Escalate to human, selecting only necessary fields
    if (supabase) {
      await supabase
        .from('leads')
        .update({ current_status: 'HUMAN_ESCALATION_REQUIRED' })
        .eq('customer_phone', phone)
        .select('id');
    }

    return {
      status: 'error',
      message: 'I encountered a slight delay while saving, but I have flagged this for our human specialists to finalize right away.',
    };
  }
}

export async function scheduleShowroomConsultation(
  phone: string,
  args: { isoDateTimeString?: string; consultationType?: string }
) {
  // Sanitize incoming payload arguments
  const safeIsoDateTimeString = typeof args?.isoDateTimeString === 'string' ? args.isoDateTimeString : null;

  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    // Mutate database selecting only absolute essential column fields
    const { error } = await supabase
      .from('leads')
      .update({
        appointment_timestamp: safeIsoDateTimeString,
        current_status: 'ANALYSIS_COMPLETE',
      })
      .eq('customer_phone', phone)
      .select('id, current_status'); // Narrow query surface to minimize WebSocket traffic size

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      message: 'Showroom consultation scheduled successfully.',
    };
  } catch (error) {
    console.error('[scheduleShowroomConsultation] Database exception:', error);

    // Fallback: Escalate to human, selecting only necessary fields
    if (supabase) {
      await supabase
        .from('leads')
        .update({ current_status: 'HUMAN_ESCALATION_REQUIRED' })
        .eq('customer_phone', phone)
        .select('id');
    }

    return {
      status: 'error',
      message: 'Our scheduling system is taking a moment to sync, but I have notified our showroom manager to confirm this exact time with you directly.',
    };
  }
}
