// app/actions/vapiOutbound.ts
'use server';

const AUTHORIZED_NUMBERS = ['7726349743', '5617191480', '5617191479', '9549326568'];

export async function triggerOutboundCall(targetPhoneNumber: string) {
  const apiKey = process.env.VAPI_API_KEY;
  const assistantId = "71038d0a-fde3-4c47-8def-cb03b26fa46e";
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

  // Clean raw digits to enforce strict whitelist restrictions
  const cleanDigits = targetPhoneNumber.replace(/\D/g, '');
  const last10Digits = cleanDigits.slice(-10);

  if (!AUTHORIZED_NUMBERS.includes(last10Digits)) {
    console.warn(`Unauthorized phone call attempt blocked to: ${targetPhoneNumber}`);
    return { 
      success: false, 
      error: "For demonstration purposes, live outbound calling is restricted to verified showroom test devices." 
    };
  }

  // Pre-flight assertion engine: Catches environment errors BEFORE hitting Vapi
  if (!apiKey) {
    console.error("CRITICAL: VAPI_API_KEY is undefined in the current server environment.");
    return { success: false, error: "Server configuration error: Missing API authorization token." };
  }

  if (!phoneNumberId) {
    console.error("CRITICAL: VAPI_PHONE_NUMBER_ID is undefined in the current server environment.");
    return { success: false, error: "Server configuration error: Missing outbound phone line identifier." };
  }

  try {
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        assistantId: assistantId,
        phoneNumberId: phoneNumberId, // Gracefully pulled from secure server environment
        customer: {
          number: targetPhoneNumber
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Vapi API Refusal Payload:", data);
      return { success: false, error: data.message || "Telephony provider routing failure." };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Low-Level Network Exception:", error.message);
    return { success: false, error: error.message };
  }
}
