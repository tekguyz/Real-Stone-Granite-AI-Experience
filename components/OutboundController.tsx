'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { triggerOutboundCall } from '@/app/actions/vapiOutbound';

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must contain at least 10 digits' })
    .regex(/^\+?[1-9]\d{9,14}$/, {
      message: 'Enter phone in E.164 standard (e.g., +14155552673)',
    }),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

interface OutboundControllerProps {
  onCallInitiated?: (phoneNumber: string, callId: string) => void;
}

export default function OutboundController({ onCallInitiated }: OutboundControllerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const onSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      const result = await triggerOutboundCall(values.phoneNumber);

      if (result.success) {
        setSuccessMsg('Outbound call successfully dispatched via Vapi.');
        const callId = (result.data as any)?.id || `vapi-sim-${values.phoneNumber.replace(/\D/g, '')}`;
        onCallInitiated?.(values.phoneNumber, callId);
        reset();
      } else {
        setApiError(result.error || 'Call routing failed. Please check line parameters and retry.');
      }
    } catch (err: any) {
      setApiError('Call routing failed. Please check line parameters and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="outbound-controller-card" className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] p-5 w-full max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border-hairline)] flex items-center justify-center">
          <Phone className="w-4 h-4 text-[var(--color-primary)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">Run Live Phone Test</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">Triggers Sarah to call your real-world test line.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-xs">
              E.164
            </span>
            <input
              type="text"
              placeholder="+14155552673"
              disabled={isLoading}
              {...register('phoneNumber')}
              className={`w-full pl-14 pr-3 py-2.5 bg-white border rounded-md text-sm font-sans focus:outline-hidden focus:ring-1 focus:ring-gray-900 transition-colors ${
                errors.phoneNumber || apiError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--color-border-hairline)]'
              }`}
            />
          </div>

          {errors.phoneNumber && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.phoneNumber.message}
            </p>
          )}

          {apiError && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {apiError}
            </p>
          )}

          {successMsg && (
            <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1 bg-green-50 p-2 rounded-md border border-green-100">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              {successMsg}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white py-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-opacity"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Dispatching Connection...
            </>
          ) : (
            'Call My Device'
          )}
        </button>
      </form>
    </div>
  );
}
