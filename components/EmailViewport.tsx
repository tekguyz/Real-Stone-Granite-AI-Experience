'use client';

import React from 'react';
import { Mail, ShieldCheck } from 'lucide-react';

interface EmailViewportProps {
  currentStatus: string;
  leadData: any;
  customEmailHtml?: string;
}

export default function EmailViewport({ currentStatus, leadData, customEmailHtml }: EmailViewportProps) {
  const isScheduled = leadData?.appointment_timestamp || currentStatus === 'ANALYSIS_COMPLETE';
  const isCrmSynced = leadData?.current_status === 'MOCK_CRM_SYNCED' || currentStatus === 'MOCK_CRM_SYNCED';

  // Generate fallback/mock HTML in case we are in setup or simulation state
  const customerName = leadData?.customer_name || 'Leonardo Da Vinci';
  const projectScope = leadData?.project_scope || 'Quartzite Kitchen Countertops';
  const materialPreference = leadData?.material_preference || 'Calacatta Quartzite';
  const formattedTime = leadData?.appointment_timestamp
    ? new Date(leadData.appointment_timestamp).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Tomorrow at 10:00 AM';

  const generatedHtml = customEmailHtml || `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #ffffff; color: #111111; padding: 24px;">
        <div style="max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <div style="font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: -0.04em; color: #111111; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 16px;">
            Real Stone & Granite
          </div>
          <h2 style="font-size: 20px; font-weight: 600; letter-spacing: -0.04em; margin-top: 0; margin-bottom: 8px;">
            ${isScheduled ? 'Walkthrough & Consultation Confirmed' : 'Quartzite Design Catalog & Brochure'}
          </h2>
          <p style="font-size: 13px; color: #6b7280; margin-bottom: 16px;">
            32 Years of Premium Countertop Fabrication & Custom Edge Treatments
          </p>
          <p style="font-size: 13px; line-height: 1.5; color: #374151;">
            Hi ${customerName}, ${
              isScheduled
                ? 'your showroom template walk-through and layout design session has been successfully scheduled. Our estimators look forward to meeting you.'
                : 'thank you for your interest in our Marble & Quartzite solutions. Below is your custom materials briefing.'
            }
          </p>
          <div style="background-color: #f5f5f5; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb; margin: 16px 0;">
            <div style="font-size: 10px; font-weight: bold; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px;">PROJECT BRIEF</div>
            <div style="font-size: 13px; font-weight: 600; color: #111111;">${projectScope}</div>
            <div style="font-size: 11px; color: #4b5563; margin-top: 2px;">Preference: ${materialPreference}</div>
            <div style="font-size: 11px; color: #4b5563; margin-top: 2px;">Time: ${formattedTime}</div>
          </div>
          <div style="text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 16px;">
            Real Stone & Granite Corp • 32-Year Family Specialists
          </div>
        </div>
      </body>
    </html>
  `;

  return (
    <div id="email-viewport-container" className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6 flex flex-col h-[380px] justify-between shadow-xs">
      {/* Email Client Top Bar Wrapper */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-hairline)] mb-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] opacity-80"></span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-sans">
            Client Inbox Viewport
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#10b981] font-semibold bg-green-50/80 px-2.5 py-1 rounded-full border border-green-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real-time Sync</span>
        </div>
      </div>

      {/* Main Frame Rendering */}
      <div className="flex-1 overflow-hidden bg-white border border-[var(--color-border-hairline)] rounded-[var(--radius-md)] flex flex-col">
        {!isCrmSynced && !isScheduled ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50">
            <Mail className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs text-gray-400 max-w-[280px] leading-relaxed">
              Waiting for customer interactions. Advancing the conversation will automatically dispatch transactional HTML briefings.
            </p>
          </div>
        ) : (
          <iframe
            id="email-preview-frame"
            srcDoc={generatedHtml}
            className="w-full h-full border-none"
            title="Transactional Email Preview"
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex justify-between items-center text-[10px] text-gray-400 font-sans">
        <span>Email Dispatch Status: {process.env.RESEND_API_KEY ? 'ACTIVE (RESEND)' : 'LOCAL SIMULATOR'}</span>
        <span>Secure Showroom Mailer</span>
      </div>
    </div>
  );
}
