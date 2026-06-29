'use client';

import React, { useState } from 'react';
import { Mail, Check, Calendar, ArrowRight, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

interface EmailViewportProps {
  currentStatus: string;
  leadData: any;
  customEmailHtml?: string;
}

export default function EmailViewport({ currentStatus, leadData, customEmailHtml }: EmailViewportProps) {
  const isScheduled = leadData?.appointment_timestamp || currentStatus === 'ANALYSIS_COMPLETE';
  const isCrmSynced = leadData?.current_status === 'MOCK_CRM_SYNCED' || currentStatus === 'MOCK_CRM_SYNCED';

  // State to toggle between HTML Source View and Live Render view
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');

  // Generate fallback/mock HTML in case we are in setup or simulation state
  const customerName = leadData?.customer_name || 'Alex Ubilla';
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
            30 Years of Premium Countertop Fabrication & Custom Edge Treatments
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
            Real Stone & Granite Corp • 30-Year Family Specialists
          </div>
        </div>
      </body>
    </html>
  `;

  return (
    <div id="email-viewport-container" className="bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6 flex flex-col h-[380px] justify-between">
      {/* Email Client Top Bar Wrapper */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-hairline)] mb-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] opacity-80"></span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">
            Verified Inbox Sandbox
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white rounded-md p-0.5 border border-[var(--color-border-hairline)]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-sm transition-colors ${
              activeTab === 'preview'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Live Render
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-sm transition-colors ${
              activeTab === 'html'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            HTML Source
          </button>
        </div>
      </div>

      {/* Main Sandbox Frame Rendering */}
      <div className="flex-1 overflow-hidden bg-white border border-[var(--color-border-hairline)] rounded-[var(--radius-md)] flex flex-col">
        {!isCrmSynced && !isScheduled ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Mail className="w-8 h-8 text-gray-300 mb-2 animate-bounce" />
            <p className="text-xs text-gray-400 max-w-[280px] leading-relaxed">
              Inbox empty. Advance the voice call simulation or request a walkthrough time to dispatch transactional HTML.
            </p>
          </div>
        ) : activeTab === 'preview' ? (
          <iframe
            id="email-preview-frame"
            srcDoc={generatedHtml}
            className="w-full h-full border-none"
            title="Transactional Email Preview"
          />
        ) : (
          <pre className="flex-1 p-4 overflow-auto text-[10px] font-mono text-gray-600 bg-gray-50 leading-relaxed select-all">
            {generatedHtml.trim()}
          </pre>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex justify-between items-center text-[10px] text-gray-400 font-mono">
        <span>Resend API Status: {process.env.RESEND_API_KEY ? 'CONNECTED' : 'SIMULATION MODE'}</span>
        <span>To: {customerName.toLowerCase().replace(/\s+/g, '')}@example.com</span>
      </div>
    </div>
  );
}
