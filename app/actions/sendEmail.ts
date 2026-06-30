'use server';

import { Resend } from 'resend';

export async function sendAppointmentEmail(
  toEmail: string,
  customerName: string,
  materialPreference: string,
  projectScope: string,
  appointmentTime: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  const formattedTime = new Date(appointmentTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Confirmation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #111111; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; background-color: #ffffff; }
          .logo-text { font-size: 20px; font-weight: 600; letter-spacing: -0.04em; color: #111111; margin-bottom: 24px; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; }
          .title { font-size: 24px; font-weight: 600; letter-spacing: -0.04em; color: #111111; margin-top: 0; margin-bottom: 8px; }
          .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 24px; }
          .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background-color: #f5f5f5; border-radius: 8px; padding: 16px; margin: 24px 0; border: 1px solid #e5e7eb; }
          .spec-label { font-size: 10px; font-weight: bold; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
          .spec-value { font-size: 13px; font-weight: 500; color: #111111; margin-top: 4px; }
          .footer { font-size: 11px; color: #9ca3af; text-align: center; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px; }
          .accent-text { color: #10b981; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-text">Real Stone & Granite</div>
          <h1 class="title">Walkthrough & Consultation Confirmed</h1>
          <p class="subtitle">30 Years of Premium Countertop Fabrication & Custom Edge Treatments</p>
          
          <p>Hi ${customerName},</p>
          <p>Your template design session and showroom walkthrough has been successfully locked in. Our technical estimators are excited to help you select your slab and finalize layouts.</p>
          
          <div class="spec-grid">
            <div>
              <div class="spec-label">Appointment Time</div>
              <div class="spec-value">${formattedTime}</div>
            </div>
            <div>
              <div class="spec-label">Project Scope</div>
              <div class="spec-value">${projectScope || 'Kitchen Countertops'}</div>
            </div>
            <div>
              <div class="spec-label">Material Class</div>
              <div class="spec-value">${materialPreference || 'Quartzite'}</div>
            </div>
            <div>
              <div class="spec-label">Showroom Location</div>
              <div class="spec-value">San Francisco Design District</div>
            </div>
          </div>
          
          <p><strong>What to expect next:</strong> One of our family-led layout coordinators will meet you at the entrance to guide you through our live inventory of Calacatta Quartzite and exotic Marble slabs.</p>
          
          <div class="footer">
            Real Stone & Granite Corp • 30-Year Family Countertop Fabrication & Edge Treatment Specialists • San Francisco, CA
          </div>
        </div>
      </body>
    </html>
  `;

  if (!apiKey) {
    console.warn(
      'Warning: RESEND_API_KEY environment variable is missing. ' +
      'Bypassing and returning simulated email render stream payload.'
    );
    return {
      success: true,
      mode: 'simulation',
      html: emailHtml,
      subject: 'Showroom Walkthrough & Template Session Confirmed',
      to: toEmail,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const sender = process.env.RESEND_FROM_EMAIL || 'Real Stone & Granite <onboarding@resend.dev>';
    
    const data = await resend.emails.send({
      from: sender,
      to: [toEmail],
      subject: 'Showroom Walkthrough & Template Session Confirmed',
      html: emailHtml,
    });

    return {
      success: true,
      mode: 'live',
      html: emailHtml,
      subject: 'Showroom Walkthrough & Template Session Confirmed',
      to: toEmail,
      resendData: data,
    };
  } catch (error: any) {
    console.error('[sendAppointmentEmail] Resend dispatch exception:', error);
    return {
      success: false,
      message: error?.message || 'Email dispatch failed.',
      html: emailHtml,
    };
  }
}
