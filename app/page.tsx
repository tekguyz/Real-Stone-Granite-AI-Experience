'use client';

import React, { useState } from 'react';
import LiveActivityFeed from '@/components/LiveActivityFeed';
import DeviceSimulator from '@/components/DeviceSimulator';
import EmailViewport from '@/components/EmailViewport';
import OutboundController from '@/components/OutboundController';
import { Database, User, Calendar, RefreshCw, FileText, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const [currentStatus, setCurrentStatus] = useState<string>('AWAITING_CALL');
  const [customEmailHtml, setCustomEmailHtml] = useState<string>('');
  const [leadData, setLeadData] = useState<any>({
    customer_name: '',
    customer_phone: '',
    project_scope: '',
    material_preference: '',
    appointment_timestamp: null,
  });

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status);
  };

  const handleLeadCreateOrUpdate = (updatedLead: any) => {
    setLeadData((prev: any) => ({
      ...prev,
      ...updatedLead,
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CALL_IN_PROGRESS':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            In Call
          </span>
        );
      case 'MOCK_CRM_SYNCED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            CRM Synced
          </span>
        );
      case 'ANALYSIS_COMPLETE':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
            Analysis Complete
          </span>
        );
      case 'HUMAN_ESCALATION_REQUIRED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
            Escalated to Human
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            Ready / Standby
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-canvas)] text-[var(--color-primary)]">
      {/* Global Navigation Header */}
      <header className="h-16 bg-white border-b border-[var(--color-border-hairline)] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 select-none flex items-center gap-2">
            Real Stone & Granite <span className="text-gray-400 font-normal">|</span> <span className="text-gray-600 font-medium text-base">TEKGUYZ Demo</span>
          </h1>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-surface-card)] border border-[var(--color-border-hairline)]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Showroom Online</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assistant Status:</span>
          {getStatusBadge(currentStatus)}
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column Pane: Live Data, Feed, CRM Status Tracker */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Outbound Controller */}
            <div className="flex flex-col gap-3">
              <OutboundController
                onCallInitiated={(phone, callId) => {
                  handleStatusChange('CALL_IN_PROGRESS');
                  handleLeadCreateOrUpdate({
                    customer_phone: phone,
                    customer_name: 'Interested Customer',
                    project_scope: 'Awaiting discovery...',
                    material_preference: 'Awaiting preference...',
                  });
                }}
              />
            </div>
            
            {/* Live Customer Profile */}
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl tracking-tight text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" /> Live Customer Profile
              </h2>
              <div className="bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Caller Identity
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {leadData.customer_name || 'Awaiting name resolution...'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Contact Line
                    </span>
                    <span className="text-sm font-semibold text-gray-800 font-mono">
                      {leadData.customer_phone || 'Awaiting connection...'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Project Scope
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {leadData.project_scope || 'Awaiting discovery...'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Material Preference
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {leadData.material_preference || 'Awaiting preference...'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[var(--color-border-hairline)] flex justify-between items-center text-xs">
                  <span className="text-gray-500">Customer Preference Verified</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded-[var(--radius-md)] bg-white border border-[var(--color-border-hairline)] font-medium text-gray-700">
                      Edge treatments verified
                    </span>
                    <span className="px-2 py-1 rounded-[var(--radius-md)] bg-white border border-[var(--color-border-hairline)] font-medium text-gray-700">
                      StoneWorks CRM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialogue Stream */}
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl tracking-tight text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" /> Dialogue Stream
              </h2>
              <LiveActivityFeed
                onStatusChange={handleStatusChange}
                onLeadUpdate={handleLeadCreateOrUpdate}
              />
            </div>

            {/* CRM Status Tracker */}
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl tracking-tight text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-gray-500" /> CRM Status Tracker
              </h2>
              <div className="bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-full border border-[var(--color-border-hairline)] flex items-center justify-center shadow-xs">
                      <RefreshCw className={`w-4 h-4 text-gray-600 ${currentStatus === 'CALL_IN_PROGRESS' ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Showroom CRM Sync</h4>
                      <p className="text-xs text-gray-500 leading-none mt-1">Status: Ready & Active</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Synced</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column Pane: UI Simulations */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            
            {/* Smartphone Canvas */}
            <div className="flex flex-col gap-3">
              <div className="text-2xl tracking-tight text-gray-900 flex items-center gap-2">
                <DeviceSimulator
                  currentStatus={currentStatus}
                  onStatusChange={handleStatusChange}
                  onLeadCreateOrUpdate={handleLeadCreateOrUpdate}
                  leadData={leadData}
                  onEmailHtmlGenerated={setCustomEmailHtml}
                />
              </div>
            </div>

            {/* Email Viewport */}
            <div className="flex flex-col gap-3">
              <div className="text-2xl tracking-tight text-gray-900 flex items-center gap-2">
                <EmailViewport
                  currentStatus={currentStatus}
                  leadData={leadData}
                  customEmailHtml={customEmailHtml}
                />
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Corporate Footnotes */}
      <footer className="border-t border-[var(--color-border-hairline)] py-8 text-center text-xs text-gray-400 bg-white shrink-0">
        <p className="max-w-[1200px] mx-auto px-6">
          Real Stone & Granite Corp © {new Date().getFullYear()} • 30-Year Family Countertop Fabrication & Edge Treatment Specialists
        </p>
      </footer>
    </div>
  );
}
