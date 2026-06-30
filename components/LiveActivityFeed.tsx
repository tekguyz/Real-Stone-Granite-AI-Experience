'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';

interface TelemetryRow {
  id: string;
  lead_id: string;
  vapi_call_id: string;
  live_transcript: string;
  raw_payload?: any;
}

interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  text: string;
  timestamp: Date;
}

interface LiveActivityFeedProps {
  onStatusChange?: (status: string) => void;
  onLeadUpdate?: (lead: any) => void;
  selectedLeadId?: string | null;
}

export default function LiveActivityFeed({
  onStatusChange,
  onLeadUpdate,
  selectedLeadId,
}: LiveActivityFeedProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!isConfigured) {
      return [
        {
          id: 'init-1',
          sender: 'system',
          text: 'Showroom Demonstration Workspace is active. Voice transcriptions and real-time operations update below.',
          timestamp: new Date(),
        },
        {
          id: 'init-2',
          sender: 'agent',
          text: 'Hello! I am Sarah, your AI Voice Assistant for Real Stone & Granite. Start a call from the interactive phone on the right to test me!',
          timestamp: new Date(),
        },
      ];
    }
    return [];
  });
  const [isLive, setIsLive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'paused' | 'unconfigured'>(() => {
    return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? 'connected'
      : 'unconfigured';
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if Supabase client is authentic (not a mock)
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const fetchLeadData = async (leadId: string) => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (!error && data) {
        onLeadUpdate?.(data);
      }
    };

    // Subscribe to call_telemetry changes in real-time
    const channel = supabase
      ?.channel('realtime_telemetry')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'call_telemetry',
        },
        (payload) => {
          const newRow = payload.new as TelemetryRow;
          if (newRow && newRow.live_transcript) {
            setIsLive(true);
            onStatusChange?.('CALL_IN_PROGRESS');

            // Parse transcript or update messages
            // We append or parse new lines
            const parsedMessages: Message[] = newRow.live_transcript
              .split('\n')
              .filter((line) => line.trim().length > 0)
              .map((line, idx) => {
                const isAgent = line.toLowerCase().startsWith('agent:') || line.toLowerCase().startsWith('assistant:');
                const isSystem = line.toLowerCase().startsWith('system:');
                const text = line.replace(/^(agent|assistant|customer|user|system):\s*/i, '');
                
                return {
                  id: `${newRow.id}-${idx}`,
                  sender: isAgent ? 'agent' : isSystem ? 'system' : 'customer',
                  text,
                  timestamp: new Date(),
                };
              });

            setMessages(parsedMessages);

            // Trigger potential parent state refresh if requested
            if (newRow.lead_id) {
              fetchLeadData(newRow.lead_id);
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('paused');
        }
      });

    return () => {
      if (channel) {
        supabase?.removeChannel(channel);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupabaseConfigured, selectedLeadId]);

  // Keep scroll locked to bottom as dialogues stream in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Trigger simulated transcript line for quick testing / fallback
  const handleSimulateSentence = (sender: 'customer' | 'agent' | 'system', text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sim-${Date.now()}-${Math.random()}`,
        sender,
        text,
        timestamp: new Date(),
      },
    ]);
    setIsLive(true);
    onStatusChange?.('CALL_IN_PROGRESS');
  };

  return (
    <div id="live-activity-feed-container" className="bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-6 flex flex-col h-[400px]">
      {/* Header Status block */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-hairline)] mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Dialogue Stream
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-[var(--color-border-hairline)] text-[10px]">
            {connectionStatus === 'connected' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                <span className="text-gray-600 font-medium">Socket Active</span>
              </>
            )}
            {connectionStatus === 'paused' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="text-gray-600 font-medium font-mono">Paused</span>
              </>
            )}
            {connectionStatus === 'unconfigured' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="text-gray-600 font-medium">Demo Mode</span>
              </>
            )}
          </div>
        </div>

        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="text-xs font-semibold text-[#10b981] uppercase tracking-wider">
              Call Active
            </span>
          </div>
        )}
      </div>

      {/* Scrolling panel */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-200"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-sm text-gray-400">
              No dialog logs recorded yet. Place an interactive call to observe transcription.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            let alignment = 'justify-start';
            let bgClass = 'bg-white text-[var(--color-primary)]';
            let senderName = 'Customer';

            if (message.sender === 'agent') {
              alignment = 'justify-end';
              bgClass = 'bg-[#111111] text-white';
              senderName = 'Sarah (AI)';
            } else if (message.sender === 'system') {
              alignment = 'justify-center';
              bgClass = 'bg-transparent text-[#6b7280] border-none text-xs italic shadow-none p-0 max-w-full text-center';
              senderName = 'System';
            }

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className={`flex w-full ${alignment}`}
              >
                {message.sender === 'system' ? (
                  <div className="py-1 px-4 text-center text-gray-500 font-mono text-[11px]">
                    Update: {message.text}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <span
                      className={`text-[10px] font-medium text-gray-500 ${
                        message.sender === 'agent' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {senderName}
                    </span>
                    <div
                      className={`p-3 rounded-[var(--radius-md)] text-sm shadow-xs border border-[var(--color-border-hairline)] ${bgClass}`}
                    >
                      <p className="leading-relaxed font-sans">{message.text}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Demo Controls - displayed when not configured or for ease of validation */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border-hairline)] flex gap-2 overflow-x-auto shrink-0">
        <button
          onClick={() => handleSimulateSentence('customer', "Hi, I'm calling from San Francisco. I'm looking to get a marble countertop fabricated for my new kitchen.")}
          className="text-[11px] bg-white hover:bg-gray-50 text-gray-700 font-medium py-1 px-2.5 rounded-md border border-[var(--color-border-hairline)] shrink-0 transition-colors"
        >
          + Customer Inquiry
        </button>
        <button
          onClick={() => handleSimulateSentence('agent', "Hi there! I can absolutely help with that. Real Stone & Granite specializes in premium marble countertop fabrication. Could I get your name to start?")}
          className="text-[11px] bg-white hover:bg-gray-50 text-gray-700 font-medium py-1 px-2.5 rounded-md border border-[var(--color-border-hairline)] shrink-0 transition-colors"
        >
          + Agent Response
        </button>
        <button
          onClick={() => handleSimulateSentence('system', "CRM synced: customer name set to 'Leonardo', material set to 'Marble'")}
          className="text-[11px] bg-white hover:bg-gray-50 text-gray-700 font-medium py-1 px-2.5 rounded-md border border-[var(--color-border-hairline)] shrink-0 transition-colors"
        >
          + CRM Event
        </button>
        {isLive && (
          <button
            onClick={() => {
              setIsLive(false);
              onStatusChange?.('ANALYSIS_COMPLETE');
            }}
            className="text-[11px] bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1 px-2.5 rounded-md border border-red-200 shrink-0 transition-colors ml-auto"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
}
