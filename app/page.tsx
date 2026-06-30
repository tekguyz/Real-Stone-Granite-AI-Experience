'use client';

import React, { useState } from 'react';
import LiveActivityFeed from '@/components/LiveActivityFeed';
import DeviceSimulator from '@/components/DeviceSimulator';
import EmailViewport from '@/components/EmailViewport';
import OutboundController from '@/components/OutboundController';
import { Database, User, Calendar, RefreshCw, FileText, CheckCircle, Flame, Layers, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const [currentStatus, setCurrentStatus] = useState<string>('AWAITING_CALL');
  const [customEmailHtml, setCustomEmailHtml] = useState<string>('');
  const [activeMobileTab, setActiveMobileTab] = useState<'workspace' | 'device'>('workspace');
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
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse font-sans">
            Assistant In-Call
          </span>
        );
      case 'MOCK_CRM_SYNCED':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-sans">
            CRM Live Synced
          </span>
        );
      case 'ANALYSIS_COMPLETE':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-50 text-green-700 border border-green-200 font-sans">
            Briefing Dispatched
          </span>
        );
      case 'HUMAN_ESCALATION_REQUIRED':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-200 font-sans">
            Staff Flagged
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600 border border-gray-200 font-sans">
            Agent Standby
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-canvas)] text-[var(--color-primary)]">
      {/* Global Navigation Header */}
      <header className="h-16 bg-white border-b border-[var(--color-border-hairline)] flex items-center justify-between px-6 shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 select-none flex items-center gap-2">
            Real Stone & Granite <span className="text-gray-400 font-normal">|</span> <span className="text-gray-600 font-medium text-base font-sans">Front Desk Workspace</span>
          </h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Showroom Live</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Status:</span>
          {getStatusBadge(currentStatus)}
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto py-8 lg:py-12 px-6">
        
        {/* Mobile Segmented Toggle Control (State-Preserving) */}
        <div className="block lg:hidden mb-6">
          <div className="flex bg-gray-100 rounded-full p-1 border border-[var(--color-border-hairline)] max-w-sm mx-auto shadow-xs">
            <button
              onClick={() => setActiveMobileTab('workspace')}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeMobileTab === 'workspace'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Active Workspace
            </button>
            <button
              onClick={() => setActiveMobileTab('device')}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeMobileTab === 'device'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Simulated Client
            </button>
          </div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Column A: Active Workspace Components (Dialogue feed, CRM stats, controller) */}
          <div className={`lg:col-span-7 flex-col gap-6 lg:gap-8 ${activeMobileTab === 'workspace' ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* Outbound Controller */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6 shadow-xs flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 font-sans">Dispatch Connection</h3>
                <p className="text-xs text-gray-500 mt-1">Initiate a live phone interaction with the showroom voice specialist.</p>
              </div>
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
            
            {/* Live Customer Profile Bento Card */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[var(--color-border-hairline)] pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" /> Showroom Customer Profile
                </h2>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-[var(--color-border-hairline)] text-[10px] font-bold text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Verified Data
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Client Identity
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {leadData.customer_name || 'Awaiting name resolution...'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Contact Phone
                  </span>
                  <span className="text-sm font-bold text-gray-900 font-mono">
                    {leadData.customer_phone || 'Awaiting connection...'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Scope of Interest
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {leadData.project_scope || 'Awaiting discovery...'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Material Preference
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {leadData.material_preference || 'Awaiting preference...'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-hairline)] flex flex-wrap justify-between items-center gap-2 text-xs">
                <span className="text-gray-400 font-medium font-sans">Slab Layout Matching Status</span>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-[var(--color-border-hairline)] font-bold text-gray-600 text-[10px] uppercase tracking-wider">
                    Edge profile ok
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-[var(--color-border-hairline)] font-bold text-gray-600 text-[10px] uppercase tracking-wider">
                    CRM Synced
                  </span>
                </div>
              </div>
            </div>

            {/* Dialogue Stream Bento Card */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] overflow-hidden shadow-xs">
              <div className="p-6 pb-0">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" /> Active Workspace Dialogue
                </h2>
              </div>
              <LiveActivityFeed
                onStatusChange={handleStatusChange}
                onLeadUpdate={handleLeadCreateOrUpdate}
              />
            </div>

            {/* CRM Status Tracker Bento Card */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-full border border-[var(--color-border-hairline)] flex items-center justify-center shadow-inner">
                    <RefreshCw className={`w-4 h-4 text-gray-600 ${currentStatus === 'CALL_IN_PROGRESS' ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Showroom CRM Hub</h4>
                    <p className="text-[11px] text-gray-400 font-medium leading-none mt-1">Status: Ready & Active</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 border border-green-100 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Synchronized</span>
                </div>
              </div>
            </div>

          </div>

          {/* Column B: Simulated Device Components (Smartphone and email render) */}
          <div className={`lg:col-span-5 flex-col gap-6 lg:gap-8 ${activeMobileTab === 'device' ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* Smartphone Simulated Display */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6 shadow-xs flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-sans">Simulated Client Smartphone</h3>
              <DeviceSimulator
                currentStatus={currentStatus}
                onStatusChange={handleStatusChange}
                onLeadCreateOrUpdate={handleLeadCreateOrUpdate}
                leadData={leadData}
                onEmailHtmlGenerated={setCustomEmailHtml}
              />
            </div>

            {/* Email Viewport */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6 shadow-xs flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-sans">Delivered Transactional Material</h3>
              <EmailViewport
                currentStatus={currentStatus}
                leadData={leadData}
                customEmailHtml={customEmailHtml}
              />
            </div>

          </div>

        </div>
      </main>

      {/* Corporate Footnotes */}
      <footer className="border-t border-[var(--color-border-hairline)] py-8 text-center text-xs text-gray-400 bg-white shrink-0">
        <p className="max-w-[1200px] mx-auto px-6 font-sans">
          Real Stone & Granite Corp © {new Date().getFullYear()} • 32-Year Family Countertop Fabrication & Edge Treatment Specialists
        </p>
      </footer>
    </div>
  );
}
