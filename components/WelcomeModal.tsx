'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [hideFuture, setHideFuture] = useState(false);

  useEffect(() => {
    const isHidden = localStorage.getItem('rsg-hide-welcome-modal');
    if (isHidden === 'true') {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    if (hideFuture) {
      localStorage.setItem('rsg-hide-welcome-modal', 'true');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[90vh] max-w-3xl bg-[var(--color-surface-card)] rounded-none sm:rounded-[var(--radius-lg)] border-0 sm:border border-[var(--color-border-hairline)] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[var(--color-border-hairline)]">
            <span className="text-xs font-semibold tracking-widest text-[var(--color-muted)] uppercase">
              Showroom Experience Overview
            </span>
            <button
              onClick={handleClose}
              className="p-1 rounded-md text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <h2 className="text-xl md:text-3xl font-sans tracking-tight text-[var(--color-primary)] mb-4">
              Welcome to the Real Stone & Granite Showroom Assistant
            </h2>
            <p className="text-[14px] md:text-[15px] text-[var(--color-primary)] opacity-80 leading-relaxed mb-6 md:mb-8">
              This system demonstrates how premium service providers and high-end trade businesses protect their revenue when their team cannot get to the phone. This system acts as an instant overflow and after-hours receptionist—answering seamlessly whenever your main line is busy or when an inquiry comes in after regular business hours—ensuring potential clients connect immediately instead of hanging up to call a competitor.
            </p>

            <h3 className="text-base md:text-lg font-sans font-semibold text-[var(--color-primary)] mb-4">
              The Financial Reality: The True Cost of Missed Overflow Calls
            </h3>
            
            <ul className="space-y-4 mb-6 md:mb-8">
              <li className="flex gap-3 text-sm text-[var(--color-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                <p className="leading-relaxed opacity-90">
                  <strong className="font-semibold opacity-100">The Voicemail Wall:</strong> Industry data shows that small business operations miss an average of 22% to 62% of incoming phone calls during busy overflow periods or after-hours. 85% of high-intent consumers who encounter a standard recorded voicemail box hang up immediately without leaving a message.
                </p>
              </li>
              <li className="flex gap-3 text-sm text-[var(--color-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                <p className="leading-relaxed opacity-90">
                  <strong className="font-semibold opacity-100">The Competitor Shift:</strong> 62% of those unanswered callers will instantly dial a competing service provider further down the page who answers live.
                </p>
              </li>
              <li className="flex gap-3 text-sm text-[var(--color-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                <p className="leading-relaxed opacity-90">
                  <strong className="font-semibold opacity-100">The Speed-to-Lead Threshold:</strong> Homeowners and contractors buy from the first organization that answers their inquiry 78% of the time. Managing an inquiry within a 5-minute window increases your conversion probability by 100x relative to a response sent 30 minutes later.
                </p>
              </li>
            </ul>

            <h3 className="text-xs md:text-sm font-semibold tracking-wider text-[var(--color-muted)] uppercase mb-3">
              Financial Impact of Capturing 1 Missed Call Per Week
            </h3>
            
            <div className="border border-[var(--color-border-hairline)] rounded-xl overflow-x-auto mb-6">
              <table className="w-full text-left text-xs md:text-sm whitespace-nowrap min-w-[500px] sm:min-w-0">
                <tbody className="divide-y divide-[var(--color-border-hairline)] font-sans">
                  <tr className="bg-white">
                    <td className="p-3 pl-4 font-medium text-[var(--color-primary)]">Weekly Baseline</td>
                    <td className="p-3 text-[var(--color-muted)]">1 Phone Call</td>
                    <td className="p-3 text-[var(--color-muted)]">—</td>
                    <td className="p-3 pr-4 text-[var(--color-muted)] text-right">—</td>
                  </tr>
                  <tr className="bg-[var(--color-highlight-bg)] text-[var(--color-highlight-text)]">
                    <td className="p-3 pl-4 font-semibold">Monthly Horizon</td>
                    <td className="p-3">4 Phone Calls</td>
                    <td className="p-3">1 Secured Project</td>
                    <td className="p-3 pr-4 font-bold text-right">$7,500</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 pl-4 font-medium text-[var(--color-primary)]">Annual Aggregation</td>
                    <td className="p-3 text-[var(--color-muted)]">52 Phone Calls</td>
                    <td className="p-3 text-[var(--color-muted)]">13 Secured Projects</td>
                    <td className="p-3 pr-4 font-bold text-[var(--color-lost-text)] text-right">$97,500</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs md:text-sm text-[var(--color-primary)] opacity-80 leading-relaxed italic bg-gray-50 border border-[var(--color-border-hairline)] p-4 rounded-lg">
              <strong className="font-semibold not-italic opacity-100">The Bottom Line:</strong> Successfully capturing just one additional high-value project per month completely covers the operational layout of the system, turning a frustrating communication bottleneck straight into guaranteed, hands-free business growth.
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 border-t border-[var(--color-border-hairline)] bg-gray-50/50">
            <label className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={hideFuture}
                onChange={(e) => setHideFuture(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--color-border-hairline)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              Do not show this overview again
            </label>
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-[var(--color-primary)] hover:bg-black text-white text-xs md:text-sm font-semibold rounded-[var(--radius-md)] transition-colors shadow-sm"
            >
              Enter Showroom Dashboard
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
