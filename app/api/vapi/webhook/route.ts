export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Run database updates and external operations in a lightweight, non-blocking asynchronous block
    (async () => {
      // 1. Ingest Parsing
      const message = body.message || {};
      const payload = body.payload || {};
      
      const type = message.type || body.type || payload.type;
      const call = message.call || body.call || payload.call || {};
      const toolCalls = message.toolCalls || body.toolCalls || payload.toolCalls || [];

      // Extract customer number and Vapi call ID with fallback behavior
      const customerNumber = call.customer?.number || 'UNKNOWN_CALLER';
      const vapiCallId = call.id || body.callId || 'UNKNOWN_CALL_ID';

      // 2. Lead Matrix Resolution
      let leadId: string | null = null;

      if (supabase) {
        // Search for an existing lead matching the caller's phone number
        const { data: existingLeads, error: selectError } = await supabase
          .from('leads')
          .select('id')
          .eq('customer_phone', customerNumber)
          .limit(1);

        if (selectError) {
          console.error('Database query error:', selectError);
        }

        if (existingLeads && existingLeads.length > 0) {
          leadId = existingLeads[0].id;
        } else {
          // Insert a brand-new row if no record exists
          const { data: newLead, error: insertError } = await supabase
            .from('leads')
            .insert({
              customer_phone: customerNumber,
              current_status: 'CALL_IN_PROGRESS',
              industry_id: 'stone-granite',
            })
            .select('id')
            .single();

          if (insertError) {
            console.error('Database insert error:', insertError);
          } else if (newLead) {
            leadId = newLead.id;
          }
        }

        // 3. Stream Payload Routing
        if (leadId) {
          if (type === 'transcript' || type === 'call.transcript') {
            const transcript = message.transcript || payload.transcript || body.transcript || '';

            // Atomic upsert into call_telemetry using vapi_call_id as conflict target constraint
            const { error: upsertError } = await supabase
              .from('call_telemetry')
              .upsert(
                {
                  lead_id: leadId,
                  vapi_call_id: vapiCallId,
                  live_transcript: transcript,
                  raw_payload: {}, // Sanitize payload arrays by sending empty JSON to avoid huge WebSockets payloads
                },
                { onConflict: 'vapi_call_id' }
              )
              .select('id');

            if (upsertError) {
              console.error('Database upsert error for call telemetry:', upsertError);
            }
          } else if (type === 'tool-calls' || type === 'tool_calls') {
            // Parse out specific function block execution requests
            for (const toolCall of toolCalls) {
              const functionName = toolCall.function?.name;
              const args = toolCall.function?.arguments
                ? typeof toolCall.function.arguments === 'string'
                  ? JSON.parse(toolCall.function.arguments)
                  : toolCall.function.arguments
                : {};

              if (functionName === 'syncToStoneAppCRM') {
                console.log(`[Tool Executed] syncToStoneAppCRM for lead ${leadId}`, args);
                // Route to data handler and select minimum fields
                await supabase
                  .from('leads')
                  .update({
                    current_status: 'MOCK_CRM_SYNCED',
                    project_scope: args.projectScope || null,
                    material_preference: args.materialPreference || null,
                    customer_name: args.customerName || null,
                  })
                  .eq('id', leadId)
                  .select('id');
              } else if (functionName === 'scheduleShowroomConsultation') {
                console.log(`[Tool Executed] scheduleShowroomConsultation for lead ${leadId}`, args);
                // Route to data handler and select minimum fields
                await supabase
                  .from('leads')
                  .update({
                    appointment_timestamp: args.appointmentTime || null,
                  })
                  .eq('id', leadId)
                  .select('id');
              }
            }
          }
        }
      } else {
        console.warn('Supabase client is not initialized. Skipping database operations.');
      }
    })().catch((err) => {
      console.error('Async background worker error:', err);
    });

    // Instantly return 200 OK to the incoming webhook request
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ status: 'success' }, { status: 200 });
  }
}
