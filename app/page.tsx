'use client';

import React, { useState } from 'react';
import LiveActivityFeed from '@/components/LiveActivityFeed';
import DeviceSimulator from '@/components/DeviceSimulator';
import EmailViewport from '@/components/EmailViewport';
import OutboundController from '@/components/OutboundController';
import WelcomeModal from '@/components/WelcomeModal';
import { Database, User, Calendar, RefreshCw, FileText, CheckCircle, Flame, Layers, ShieldCheck, Sparkles, BookOpen, ChevronRight, HelpCircle, Clipboard, Check, Mail, Settings } from 'lucide-react';

export default function DashboardPage() {
  const [currentStatus, setCurrentStatus] = useState<string>('AWAITING_CALL');
  const [customEmailHtml, setCustomEmailHtml] = useState<string>('');
  const [activeMobileTab, setActiveMobileTab] = useState<'workspace' | 'device'>('workspace');
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  const [showCrmPayload, setShowCrmPayload] = useState(false);
  const [activePlaybookTab, setActivePlaybookTab] = useState<'persona' | 'tools' | 'receptionist'>('persona');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
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
            Saved to Profile
          </span>
        );
      case 'ANALYSIS_COMPLETE':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-50 text-green-700 border border-green-200 font-sans">
            Checklist Sent
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
            Ready on Standby
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-canvas)] text-[var(--color-primary)]">
      <WelcomeModal isOpen={isWelcomeModalOpen} onClose={() => setIsWelcomeModalOpen(false)} />
      {/* Global Navigation Header */}
      <header className="h-16 bg-white border-b border-[var(--color-border-hairline)] flex items-center justify-between px-6 shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 select-none flex items-center gap-2">
            Real Stone & Granite <span className="text-gray-400 font-normal">|</span> <span className="text-gray-600 font-medium text-base font-sans">Showroom Dashboard</span>
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
      <main className="flex-1 w-full max-w-[1200px] mx-auto py-6 lg:py-12 px-3 sm:px-6">
        
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
              Call Logs & Info
            </button>
            <button
              onClick={() => setActiveMobileTab('device')}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeMobileTab === 'device'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Customer Phone
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
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 font-sans">Live Phone Test</h3>
                <p className="text-xs text-gray-500 mt-1">Send a live test call to your mobile device to speak with the showroom assistant.</p>
              </div>
              <OutboundController
                onCallInitiated={(phone, callId) => {
                  handleStatusChange('CALL_IN_PROGRESS');
                  handleLeadCreateOrUpdate({
                    customer_phone: phone,
                    customer_name: 'Interested Customer',
                    project_scope: 'Waiting for details...',
                    material_preference: 'Waiting for preference...',
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
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Verified Lead
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Client Identity
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {leadData.customer_name || 'Waiting for name...'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Contact Phone
                  </span>
                  <span className="text-sm font-bold text-gray-900 font-mono">
                    {leadData.customer_phone || 'Waiting for call...'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Scope of Interest
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {leadData.project_scope || 'Waiting for details...'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Material Preference
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {leadData.material_preference || 'Waiting for preference...'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-hairline)] flex flex-wrap justify-between items-center gap-2 text-xs">
                <span className="text-gray-400 font-medium font-sans">Showroom Slabs & Layouts</span>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-[var(--color-border-hairline)] font-bold text-gray-600 text-[10px] uppercase tracking-wider">
                    Edge Profile Ready
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-[var(--color-border-hairline)] font-bold text-gray-600 text-[10px] uppercase tracking-wider">
                    Profile Saved
                  </span>
                </div>
              </div>
            </div>

            {/* Dialogue Stream Bento Card */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] overflow-hidden shadow-xs">
              <div className="p-6 pb-0">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" /> Live Conversation Feed
                </h2>
              </div>
              <LiveActivityFeed
                onStatusChange={handleStatusChange}
                onLeadUpdate={handleLeadCreateOrUpdate}
              />
            </div>

            {/* CRM Status Tracker & Sync Ledger Bento Card */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6 shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border-hairline)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-full border border-[var(--color-border-hairline)] flex items-center justify-center shadow-inner">
                    <Database className={`w-5 h-5 text-gray-700 ${currentStatus === 'CALL_IN_PROGRESS' ? 'animate-bounce' : ''}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wider font-sans">Showroom CRM Live Database</h3>
                    <p className="text-xs text-gray-400">Real-time StoneApp database synchronization ledger</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => setShowCrmPayload(!showCrmPayload)}
                    className="text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-1.5 px-3 rounded-lg border border-[var(--color-border-hairline)] transition-all flex items-center gap-1.5"
                  >
                    {showCrmPayload ? 'View Database Logs' : 'Inspect API Payload'}
                  </button>
                  <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 border border-green-100 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                    <span className="text-[9px] font-bold text-green-700 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>

              {showCrmPayload ? (
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">StoneApp Sync API Payload Structure</span>
                  <div className="bg-gray-950 text-gray-100 rounded-lg p-4 font-mono text-[11px] overflow-x-auto leading-relaxed border border-gray-800">
                    <pre>{JSON.stringify({
                      api_version: "2026.07.01",
                      source: "Vapi_AfterHours_Receptionist",
                      crm_destination: "StoneApp_PRO_v4",
                      lead_data: {
                        first_name: leadData.customer_name ? leadData.customer_name.split(' ')[0] : 'Interested',
                        last_name: leadData.customer_name ? leadData.customer_name.split(' ').slice(1).join(' ') : 'Customer',
                        phone: leadData.customer_phone || 'Awaiting...',
                        email: leadData.customer_email || 'Awaiting...',
                        interest: leadData.project_scope || 'Pending Discovery',
                        slab_preference: leadData.material_preference || 'Pending Selection',
                        appointment: leadData.appointment_timestamp || null,
                        edge_profile_requested: "Edge Profile Ready"
                      },
                      sync_status: currentStatus === 'CALL_IN_PROGRESS' ? 'SYNCING_IN_PROGRESS' : 'SYNCHRONIZED',
                      timestamp: new Date().toISOString()
                    }, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">CRM Transaction Logs</span>
                  <div className="divide-y divide-[var(--color-border-hairline)]">
                    
                    {/* Active Live Sync Lead Row */}
                    {leadData.customer_phone && (
                      <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/50 -mx-4 px-4 rounded-lg border border-amber-100/50">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                              {leadData.customer_name || 'Active Guest Caller'}
                              <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">Live</span>
                            </div>
                            <p className="text-[11px] text-gray-500 font-mono mt-0.5">{leadData.customer_phone}</p>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              <span className="text-[10px] text-gray-600 font-medium">Scope: {leadData.project_scope || 'Gathering details...'}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-[10px] text-gray-600 font-medium">Pref: {leadData.material_preference || 'Awaiting selection...'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                            {currentStatus === 'CALL_IN_PROGRESS' ? 'Syncing...' : 'Saved to Profile'}
                          </span>
                          <span className="text-[9px] text-gray-400 block font-mono mt-1">Just Now</span>
                        </div>
                      </div>
                    )}

                    {/* Simulated Past CRM Lead 1 */}
                    <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">Martha Sterling</div>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">(561) 332-9011</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <span className="text-[10px] text-gray-500">Scope: Bookmatched Fireplace Surround</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[10px] text-gray-500">Pref: Calacatta Marble</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-100">
                          Synced to CRM
                        </span>
                        <span className="text-[9px] text-gray-400 block font-mono mt-1">Synced 4 hrs ago</span>
                      </div>
                    </div>

                    {/* Simulated Past CRM Lead 2 */}
                    <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">Bill Thompson</div>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">(772) 489-0122</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <span className="text-[10px] text-gray-500">Scope: Custom Kitchen Island Slab</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[10px] text-gray-500">Pref: Taj Mahal Quartzite</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-100">
                          Synced to CRM
                        </span>
                        <span className="text-[9px] text-gray-400 block font-mono mt-1">Synced Yesterday</span>
                      </div>
                    </div>
                    
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column B: Simulated Device Components (Smartphone and email render) */}
          <div className={`lg:col-span-5 flex-col gap-6 lg:gap-8 ${activeMobileTab === 'device' ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* Smartphone Simulated Display */}
            <DeviceSimulator
              currentStatus={currentStatus}
              onStatusChange={handleStatusChange}
              onLeadCreateOrUpdate={handleLeadCreateOrUpdate}
              leadData={leadData}
              onEmailHtmlGenerated={setCustomEmailHtml}
            />

            {/* Email Viewport */}
            <EmailViewport
              currentStatus={currentStatus}
              leadData={leadData}
              customEmailHtml={customEmailHtml}
            />

          </div>

        </div>
      </main>

      {/* Corporate Footnotes */}
      <footer className="border-t border-[var(--color-border-hairline)] py-8 bg-white shrink-0">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-sans">
          <p>
            Real Stone & Granite © {new Date().getFullYear()} • Integrity • Quality • Craftsmanship
          </p>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-[11px]">
            <span className="text-gray-400 font-medium">Digital Craft by</span>
            <a
              href="https://tekguyz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gray-700 hover:text-black transition-colors"
            >
              TEKGUYZ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
