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
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #111111;
            padding: 8px;
            margin: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          .email-card {
            max-width: 500px;
            margin: 0 auto;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px;
            background-color: #ffffff;
            word-wrap: break-word;
            box-sizing: border-box;
          }
          @media (min-width: 480px) {
            body { padding: 16px; }
            .email-card { padding: 24px; }
          }
          .title {
            font-size: 18px;
            font-weight: 600;
            letter-spacing: -0.04em;
            color: #111111;
            margin-top: 0;
            margin-bottom: 8px;
            line-height: 1.25;
          }
          @media (min-width: 480px) {
            .title { font-size: 22px; }
          }
          .subtitle {
            font-size: 11px;
            font-weight: 500;
            color: #6b7280;
            margin-bottom: 16px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          @media (min-width: 480px) {
            .subtitle { font-size: 13px; }
          }
          .spec-grid {
            background-color: #f5f5f5;
            border-radius: 8px;
            padding: 12px;
            border: 1px solid #e5e7eb;
            margin: 16px 0;
          }
          @media (min-width: 480px) {
            .spec-grid { padding: 16px; }
          }
          .spec-table {
            width: 100%;
            border-collapse: collapse;
          }
          .spec-td {
            padding: 4px;
            vertical-align: top;
            width: 50%;
            box-sizing: border-box;
          }
          @media (min-width: 480px) {
            .spec-td { padding: 8px; }
          }
          .spec-label {
            font-size: 9px;
            font-weight: bold;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
          }
          .spec-value {
            font-size: 11px;
            font-weight: 500;
            color: #111111;
            line-height: 1.3;
          }
          @media (min-width: 480px) {
            .spec-value { font-size: 13px; }
          }
          .footer {
            font-size: 10px;
            color: #9ca3af;
            text-align: center;
            margin-top: 24px;
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
            line-height: 1.5;
          }
          .nowrap {
            white-space: nowrap;
          }
        </style>
      </head>
      <body>
        <div class="email-card">
          <div style="font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: -0.04em; color: #111111; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 16px;">
            <span class="nowrap">Real Stone &amp; Granite</span>
          </div>
          <h2 class="title">
            ${isScheduled ? 'Walkthrough &amp; Consultation Confirmed' : 'Quartzite Design Catalog &amp; Brochure'}
          </h2>
          <p class="subtitle">
            <span class="nowrap">Integrity • Quality • Craftsmanship</span>
          </p>
          <p style="font-size: 13px; line-height: 1.5; color: #374151; margin: 0 0 12px 0;">
            Hi ${customerName},
          </p>
          <p style="font-size: 13px; line-height: 1.5; color: #374151; margin: 0 0 16px 0;">
            ${
              isScheduled
                ? 'Your showroom template walkthrough and layout design session has been successfully scheduled. Our estimators look forward to meeting you.'
                : 'Thank you for your interest in our Marble &amp; Quartzite solutions. Below is your custom materials briefing.'
            }
          </p>
          <div class="spec-grid">
            <table class="spec-table">
              <tr>
                <td class="spec-td">
                  <div class="spec-label">Appointment Time</div>
                  <div class="spec-value">${formattedTime}</div>
                </td>
                <td class="spec-td">
                  <div class="spec-label">Project Scope</div>
                  <div class="spec-value">${projectScope}</div>
                </td>
              </tr>
              <tr>
                <td class="spec-td" style="padding-top: 12px;">
                  <div class="spec-label">Material Preference</div>
                  <div class="spec-value">${materialPreference}</div>
                </td>
                <td class="spec-td" style="padding-top: 12px;">
                  <div class="spec-label">Showroom Location</div>
                  <div class="spec-value">427 S. Market Ave, Fort Pierce, FL</div>
                </td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <span class="nowrap">Real Stone &amp; Granite</span> • <span class="nowrap">Integrity • Quality • Craftsmanship</span><br>
            <span class="nowrap">427 S. Market Ave, Fort Pierce, FL</span> • <span class="nowrap">(772) 489-9964</span>
          </div>
        </div>
      </body>
    </html>
  `;

  return (
    <div id="email-viewport-container" className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-3 sm:p-6 flex flex-col h-[380px] justify-between shadow-xs">
      {/* Email Client Top Bar Wrapper */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-hairline)] mb-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] opacity-80"></span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-sans whitespace-nowrap">
            {"Customer's Inbox"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#10b981] font-semibold bg-green-50/80 px-2.5 py-1 rounded-full border border-green-100 shrink-0 whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active</span>
        </div>
      </div>

      {/* Main Frame Rendering */}
      <div className="flex-1 overflow-hidden bg-white border border-[var(--color-border-hairline)] rounded-[var(--radius-md)] flex flex-col">
        {!isCrmSynced && !isScheduled ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50">
            <Mail className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs text-gray-400 max-w-[280px] leading-relaxed">
              {"Once an appointment is booked or a material preference is selected during the conversation, the customer's design preference brochure and booking confirmation will be displayed here."}
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
        <span>Delivery Mode: {process.env.RESEND_API_KEY ? 'Resend Live Email Service' : 'Simulated Live Delivery'}</span>
        <span>Customer Notification System</span>
      </div>
    </div>
  );
}
