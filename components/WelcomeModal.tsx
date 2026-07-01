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
            <h2 className="text-lg sm:text-xl md:text-2xl font-sans font-bold tracking-tight text-[var(--color-primary)] mb-4 text-center sm:text-left">
              Welcome to the Real Stone & Granite Assistant
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[var(--color-primary)] opacity-85 leading-relaxed mb-4">
              For over 30 years, our family-owned business has been fabricating custom stone countertops, elegant bath vanities, fireplaces, and architectural monuments here in Florida. Every customer inquiry is incredibly important to us. However, during busy showroom hours or late evenings when our offices are closed, it can be tough to answer every incoming call.
            </p>
            <p className="text-[13px] sm:text-[14px] text-[var(--color-primary)] opacity-85 leading-relaxed mb-6">
              To make sure our customers are always taken care of, we created <strong>Sarah</strong>—our virtual after-hours receptionist. When our team is busy in the slab yard or away from the desk, Sarah answers immediately, greets callers warmly, guides them through our premium stone materials (Marble, Quartzite, Granite, Quartz), explains our 3D digital laser scanner measurements, and schedules showroom visits.
            </p>

            <h3 className="text-sm sm:text-base font-sans font-semibold text-[var(--color-primary)] mb-3">
              How Sarah Helps Our Customers
            </h3>
            
            <ul className="space-y-3 mb-6">
              <li className="flex gap-2.5 text-xs sm:text-sm text-[var(--color-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                <p className="leading-relaxed opacity-90">
                  <strong className="font-semibold opacity-100">Immediate Warm Welcome:</strong> Instead of getting an empty voicemail box or a busy signal, callers get an instant, polite, and helpful conversation.
                </p>
              </li>
              <li className="flex gap-2.5 text-xs sm:text-sm text-[var(--color-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                <p className="leading-relaxed opacity-90">
                  <strong className="font-semibold opacity-100">Broad Stone Knowledge:</strong> Sarah understands custom slab pricing factors, can answer layout questions, and knows our premium inventory details.
                </p>
              </li>
              <li className="flex gap-2.5 text-xs sm:text-sm text-[var(--color-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                <p className="leading-relaxed opacity-90">
                  <strong className="font-semibold opacity-100">Seamless Follow-up:</strong> The moment a conversation ends, Sarah instantly schedules showroom walk-throughs in our system and dispatches customized material checklists directly to the client&apos;s inbox.
                </p>
              </li>
            </ul>

            <h3 className="text-xs md:text-sm font-semibold tracking-wider text-[var(--color-muted)] uppercase mb-3">
              Humble and Human Impact
            </h3>
            
            <div className="border border-[var(--color-border-hairline)] rounded-xl overflow-x-auto mb-6">
              <table className="w-full text-left text-xs md:text-sm whitespace-nowrap min-w-[320px]">
                <tbody className="divide-y divide-[var(--color-border-hairline)] font-sans">
                  <tr className="bg-white">
                    <td className="p-3 pl-4 font-medium text-[var(--color-primary)]">Secured Bookings</td>
                    <td className="p-3 text-[var(--color-muted)]">1 Showroom Walkthrough</td>
                    <td className="p-3 pr-4 text-right text-[var(--color-muted)]">Warmly Welcomed</td>
                  </tr>
                  <tr className="bg-[var(--color-highlight-bg)] text-[var(--color-highlight-text)]">
                    <td className="p-3 pl-4 font-semibold">Monthly Saved Inquiries</td>
                    <td className="p-3">4 Guided Conversations</td>
                    <td className="p-3 pr-4 font-bold text-right text-emerald-700">1 Saved Custom Project</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 pl-4 font-medium text-[var(--color-primary)]">Yearly Community Results</td>
                    <td className="p-3 text-[var(--color-muted)]">12 Crafted Kitchens & Baths</td>
                    <td className="p-3 pr-4 font-bold text-emerald-800 text-right">12 Happy Families</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs md:text-sm text-[var(--color-primary)] opacity-80 leading-relaxed italic bg-gray-50 border border-[var(--color-border-hairline)] p-4 rounded-lg">
              <strong className="font-semibold not-italic opacity-100">The Bottom Line:</strong> Helping just one extra custom fabrication customer each month covers Sarah&apos;s support indefinitely, letting our team focus on our handcraft in the yard while ensuring new families always receive our warmest signature experience.
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
