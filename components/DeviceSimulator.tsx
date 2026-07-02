'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, PhoneOff, Mic, User, Calendar, Database, ShieldCheck, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sendAppointmentEmail } from '@/app/actions/sendEmail';

interface DeviceSimulatorProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  onLeadCreateOrUpdate: (lead: any) => void;
  leadData: any;
  onEmailHtmlGenerated?: (html: string) => void;
}

export default function DeviceSimulator({
  currentStatus,
  onStatusChange,
  onLeadCreateOrUpdate,
  leadData,
  onEmailHtmlGenerated,
}: DeviceSimulatorProps) {
  const [phone, setPhone] = useState('(415) 555-2673');
  const [name, setName] = useState('Leonardo Da Vinci');
  const [email, setEmail] = useState('leonardo@example.com');
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [simStep, setSimStep] = useState(0);
  const [chosenTimeSlot, setChosenTimeSlot] = useState<string>('');

  const showNotification = currentStatus === 'ANALYSIS_COMPLETE';
  const emailSentRef = useRef(false);

  const triggerEmailDispatch = async () => {
    const response = await sendAppointmentEmail(
      email,
      name,
      leadData.material_preference || 'Quartzite (Calacatta)',
      leadData.project_scope || 'Kitchen Countertop Fabrication',
      leadData.appointment_timestamp || chosenTimeSlot || new Date(Date.now() + 86400000).toISOString()
    );
    if (response.success && response.html) {
      onEmailHtmlGenerated?.(response.html);
    }
  };

  // Duration timer
  useEffect(() => {
    if (!isCalling) return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCalling]);

  // Handle slide-in notification and automatic email dispatch when analysis completes
  useEffect(() => {
    if (currentStatus === 'ANALYSIS_COMPLETE') {
      if (!emailSentRef.current) {
        emailSentRef.current = true;
        triggerEmailDispatch();
      }
    } else {
      emailSentRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setIsCalling(true);
    setCallDuration(0);
    setSimStep(0);
    onStatusChange('CALL_IN_PROGRESS');

    const initialLead = {
      customer_phone: phone,
      customer_name: name || 'Interested Customer',
      current_status: 'CALL_IN_PROGRESS',
      industry_id: 'stone-granite',
      project_scope: 'Awaiting discovery...',
      material_preference: 'Awaiting preference...',
    };
    onLeadCreateOrUpdate(initialLead);

    // Dispatch custom event to notify LiveActivityFeed of the start of the simulated call
    window.dispatchEvent(
      new CustomEvent('rsg-sim-event', {
        detail: {
          action: 'start',
          name: name || 'Leonardo Da Vinci',
          phone: phone || '(415) 555-2673',
          text: simulationScript[0].agent,
        },
      })
    );
  };

  const handleEndCall = () => {
    setIsCalling(false);
    onStatusChange('ANALYSIS_COMPLETE');

    // Dispatch custom event to notify LiveActivityFeed that the call has ended
    window.dispatchEvent(
      new CustomEvent('rsg-sim-event', {
        detail: {
          action: 'end',
        },
      })
    );
  };

  // High-fidelity speech dialogue sequence
  const simulationScript = [
    {
      agent: "Hi! Thanks for calling Real Stone & Granite. My name is Sarah. Are you looking to fabricate custom kitchen countertops, marble slab treatments, or perhaps a beautiful memorial monument today?",
      options: [
        "I need a custom Quartzite kitchen countertop fabricated.",
        "We want to install luxury Marble for our master bathroom.",
        "I am looking for custom edge treatments for memorial monuments."
      ]
    },
    {
      agent: "Quartzite is a phenomenal choice—it has the luxury appeal of marble but is incredibly durable. I have updated our StoneWorks CRM with your project scope: Quartzite countertop fabrication.",
      options: [
        "Perfect. I prefer the Calacatta Quartzite pattern.",
        "Excellent. What edge treatments do you offer?",
        "Can I get a brochure sent to my email?"
      ],
      triggerCRM: {
        projectType: 'Kitchen Countertop Fabrication',
        materialClass: 'Quartzite (Calacatta)',
      }
    },
    {
      agent: "Outstanding choice! I have marked your preference as Calacatta Quartzite. To secure your fabrication slots, we highly recommend a free showroom consultation with our layout template specialists. We have slots open tomorrow at 10:00 AM or Wednesday at 2:00 PM.",
      options: [
        "Let's book tomorrow at 10:00 AM.",
        "Wednesday at 2:00 PM works perfectly.",
        "I will call back to schedule."
      ]
    },
    {
      agent: "Fantastic! I've booked your showroom walkthrough and template consultation. A summary brochure and transactional confirmation have been dispatched to your device immediately. Anything else I can assist with?",
      options: [
        "No, that is all. Thank you Sarah!",
        "Could you send me your physical address?"
      ],
      triggerSchedule: {
        isoDateTime: '2026-06-30T10:00:00-07:00',
        consultationType: 'Showroom & Templating Session'
      }
    }
  ];

  const handleOptionSelect = (optionText: string) => {
    const currentScript = simulationScript[simStep];
    
    // Dispatch customer message immediately to Live Conversation Feed
    window.dispatchEvent(
      new CustomEvent('rsg-sim-event', {
        detail: {
          action: 'transcript',
          sender: 'customer',
          text: optionText,
        },
      })
    );

    if (currentScript.triggerCRM) {
      onLeadCreateOrUpdate({
        ...leadData,
        customer_name: name,
        customer_phone: phone,
        project_scope: currentScript.triggerCRM.projectType,
        material_preference: currentScript.triggerCRM.materialClass,
        current_status: 'MOCK_CRM_SYNCED',
      });
      onStatusChange('MOCK_CRM_SYNCED');

      // Dispatch a helpful sync system notification
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('rsg-sim-event', {
            detail: {
              action: 'transcript',
              sender: 'system',
              text: `StoneWorks CRM Synced: scope set to '${currentScript.triggerCRM.projectType}' and preference set to '${currentScript.triggerCRM.materialClass}'.`,
            },
          })
        );
      }, 250);
    }

    // Capture the dynamic appointment preference chosen in Step 2 instantly
    let updatedLeadData = { ...leadData };
    if (simStep === 2) {
      if (optionText.includes('10:00 AM')) {
        setChosenTimeSlot('2026-06-30T10:00:00-07:00');
        updatedLeadData.appointment_timestamp = '2026-06-30T10:00:00-07:00';
      } else if (optionText.includes('2:00 PM')) {
        setChosenTimeSlot('2026-07-01T14:00:00-07:00');
        updatedLeadData.appointment_timestamp = '2026-07-01T14:00:00-07:00';
      }
      onLeadCreateOrUpdate(updatedLeadData);
    }

    if (currentScript.triggerSchedule) {
      const finalTimestamp = chosenTimeSlot || updatedLeadData.appointment_timestamp || leadData.appointment_timestamp || '2026-06-30T10:00:00-07:00';
      onLeadCreateOrUpdate({
        ...leadData,
        appointment_timestamp: finalTimestamp,
        current_status: 'ANALYSIS_COMPLETE',
      });
      onStatusChange('ANALYSIS_COMPLETE');
    }

    if (simStep < simulationScript.length - 1) {
      const nextStepIndex = simStep + 1;
      setSimStep(nextStepIndex);

      // Dispatch Sarah's response after a slight delay for a highly realistic voice interaction feel
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('rsg-sim-event', {
            detail: {
              action: 'transcript',
              sender: 'agent',
              text: simulationScript[nextStepIndex].agent,
            },
          })
        );
      }, 700);
    } else {
      handleEndCall();
    }
  };

  const isWednesdaySelection = leadData?.appointment_timestamp?.includes('14:00') || leadData?.appointment_timestamp?.includes('2026-07-01');

  return (
    <div id="device-simulator-container" className="w-full flex flex-col items-center relative select-none">
      
      {/* Sleek, Minimal Smartphone Framework */}
      <div className="w-full max-w-[280px] min-[360px]:max-w-[300px] sm:max-w-[315px] lg:max-w-[330px] h-[525px] min-[360px]:h-[550px] sm:h-[570px] lg:h-[590px] bg-white rounded-[32px] shadow-lg border-[8px] lg:border-[10px] border-gray-900 p-3 pb-6 sm:p-4 sm:pb-8 relative flex flex-col overflow-hidden shrink-0">
        
        {/* Slide-Down Text Notification Alert Bubble (Confined Inside Phone Bounds) */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ y: -120, opacity: 0, scale: 0.95 }}
              animate={{
                y: 36,
                opacity: 1,
                scale: 1,
                transition: { type: 'spring', stiffness: 220, damping: 18 }
              }}
              exit={{ y: -120, opacity: 0 }}
              className="absolute top-0 left-2 right-2 z-50 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-xl shadow-lg p-3 flex gap-2.5 max-w-[calc(100%-16px)] mx-auto"
            >
              <div className="w-8 h-8 rounded-full bg-success-solid text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageSquare className="w-4 h-4 fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white font-sans">Real Stone & Granite</span>
                  <span className="text-[8px] text-gray-400 font-mono">Just Now</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-gray-200 mt-0.5 font-sans leading-relaxed">
                  Walkthrough appointment confirmed for {isWednesdaySelection ? 'Wednesday at 2:00 PM' : 'tomorrow at 10:00 AM'}. Checklist sent to your email address!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Dynamic status bar */}
        <div className="flex justify-between items-center px-4 py-1 text-[11px] font-sans font-semibold text-gray-500 select-none">
          <span>11:44 AM</span>
          <div className="w-16 h-4 bg-gray-900 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2"></div>
          <div className="flex gap-1 items-center">
            <span className="w-3.5 h-2 bg-gray-400 rounded-xs inline-block"></span>
            <span className="text-[10px]">5G</span>
          </div>
        </div>

        {/* Smartphone Screen Content */}
        <div className="flex-1 flex flex-col justify-between mt-4">
          <AnimatePresence mode="wait">
            {!isCalling ? (
              <motion.div
                key="setup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between overflow-y-auto pr-0.5 scrollbar-none"
              >
                <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                  <div className="text-center pt-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-widest text-success-text bg-success-bg px-2 py-0.5 sm:py-1 rounded-full border border-success-border inline-block">
                      Live Simulation Line
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 mt-2">
                      Voice Agent Sarah
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 px-2 leading-relaxed">
                      Experience the showroom reception voice assistant on a simulated active phone line.
                    </p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Caller Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-2 sm:top-2.5 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Leonardo Da Vinci"
                          className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-[var(--color-surface-card)] border border-[var(--color-border-hairline)] rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-gray-900 font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Destination Email
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1.5 sm:top-2 text-xs font-bold text-gray-400">@</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="leonardo@example.com"
                          className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-[var(--color-surface-card)] border border-[var(--color-border-hairline)] rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-gray-900 font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Simulated Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-2 sm:top-2.5 text-gray-400" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(561) 555-0192"
                          className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-[var(--color-surface-card)] border border-[var(--color-border-hairline)] rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStartCall}
                  className="w-full bg-success-solid hover:bg-success-solid-hover text-white py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md mt-4 mb-2 active:scale-[0.98]"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white stroke-white" /> Start Inbound Call
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="calling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 overflow-hidden"
              >
                {/* Active Call Header */}
                <div className="text-center shrink-0 space-y-0.5">
                  <div className="w-10 h-10 bg-success-solid rounded-full flex items-center justify-center mx-auto mb-1 shadow-sm">
                    <Phone className="w-4 h-4 text-white animate-pulse fill-white stroke-white" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">{name || 'Interested Customer'}</h4>
                  <span className="text-[9px] text-gray-400 block font-mono bg-gray-100/80 px-1.5 py-0.5 rounded-full w-fit mx-auto">{phone}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-success-text tracking-wider uppercase mt-0.5 block">
                    {formatDuration(callDuration)}
                  </span>
                </div>

                {/* Simulated AI Agent Response options */}
                <div className="bg-[var(--color-surface-card)] rounded-xl border border-[var(--color-border-hairline)] p-2.5 sm:p-3 flex-1 flex flex-col min-h-0 overflow-hidden shadow-xs my-1.5">
                  <div className="flex-1 flex flex-col justify-center text-center overflow-y-auto min-h-[40px] py-1">
                    <div>
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-success-text block mb-1">
                        Sarah (Voice Assistant)
                      </span>
                      <p className="text-[11px] sm:text-xs text-gray-800 font-sans leading-relaxed font-semibold px-2">
                        &ldquo;{simulationScript[simStep].agent}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 border-t border-[var(--color-border-hairline)] pt-2 mt-1 space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 block mb-1 text-center">
                      Select Response:
                    </span>
                    <div className="max-h-[120px] sm:max-h-[140px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                      {simulationScript[simStep].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionSelect(opt)}
                          className="w-full text-left bg-white hover:bg-gray-50 border border-[var(--color-border-hairline)] rounded-lg py-1.5 px-2.5 text-[10px] sm:text-[11px] font-sans font-semibold text-gray-700 transition-all shadow-2xs h-auto leading-tight active:scale-[0.98]"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Call Action Triggers */}
                <div className="flex justify-center gap-6 sm:gap-8 pb-1.5 pt-0.5 shrink-0">
                  <div className="flex flex-col items-center">
                    <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors">
                      <Mic className="w-4 h-4" />
                    </button>
                    <span className="text-[9px] text-gray-500 font-semibold mt-0.5">Mute</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleEndCall}
                      className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    >
                      <PhoneOff className="w-4 h-4" />
                    </button>
                    <span className="text-[9px] text-red-600 font-bold mt-0.5">End</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* iOS-Style Home Indicator Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-200 rounded-full shrink-0"></div>
      </div>
    </div>
  );
}
