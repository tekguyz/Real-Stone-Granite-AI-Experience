'use server';

export async function triggerOutboundCall(phoneNumber: string) {
  const vapiApiKey = process.env.VAPI_API_KEY;
  const assistantId = '71038d0a-fde3-4c47-8def-cb03b26fa46e';

  console.log(`[triggerOutboundCall] Initiating live outbound call to ${phoneNumber}`);

  if (!vapiApiKey) {
    console.warn(
      'Warning: VAPI_API_KEY environment variable is missing. ' +
      'Real-world telephony connections require this secret in your environment configuration. ' +
      'Bypassing with a successful simulation response for the dashboard preview.'
    );

    // Simulate standard outbound trigger latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      mode: 'simulation',
      message: 'Call simulated successfully. Use the mobile screen simulator to trigger full speech interaction cycles in real-time.',
      callId: `sim-call-${Math.random().toString(36).substring(2, 11)}`,
    };
  }

  try {
    const response = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${vapiApiKey}`,
      },
      body: JSON.stringify({
        assistantId: assistantId,
        customer: {
          number: phoneNumber,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[triggerOutboundCall] Vapi API Error response:', data);
      throw new Error(data.message || `HTTP error ${response.status}`);
    }

    return {
      success: true,
      mode: 'live',
      message: 'Outbound call successfully dispatched via Vapi telephony network.',
      callId: data.id || `vapi-${Math.random().toString(36).substring(2, 11)}`,
      data,
    };
  } catch (error: any) {
    console.error('[triggerOutboundCall] Call dispatch failed:', error);
    return {
      success: false,
      message: error?.message || 'Call routing failed. Please check line parameters and retry.',
    };
  }
}
