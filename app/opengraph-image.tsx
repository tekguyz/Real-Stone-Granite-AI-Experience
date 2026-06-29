import { ImageResponse } from 'next/og';

export const alt = 'Real Stone & Granite | Autonomous Front Desk Engine';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col justify-between bg-white p-20 border-[16px] border-[#f5f5f5]">
        {/* Main Content Area */}
        <div tw="flex flex-col">
          {/* Badge & Meta Row */}
          <div tw="flex items-center gap-4">
            <span tw="bg-[#111111] text-white text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-md">
              TEKGUYZ SYSTEMS
            </span>
            <span tw="text-gray-400 text-sm font-medium">
              • Showroom Intelligence Portal
            </span>
          </div>

          {/* Heading */}
          <h1 tw="text-6xl font-bold text-[#111111] tracking-tight mt-12 mb-4">
            Real Stone & Granite
          </h1>

          {/* Tagline / Description */}
          <p tw="text-xl text-gray-500 max-w-[850px] leading-relaxed m-0">
            Capturing high-value architectural masonry and custom countertop leads around the clock seamlessly using advanced voice automation.
          </p>
        </div>

        {/* Footer Specification Bar */}
        <div tw="flex w-full justify-between items-center border-t border-[#e5e7eb] pt-8">
          <div tw="flex flex-col">
            <span tw="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Specialist Tenure
            </span>
            <span tw="text-base font-semibold text-[#111111] mt-1">
              30-Year Family Countertop Fabrication
            </span>
          </div>

          <div tw="flex flex-col items-end">
            <span tw="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Integration Stack
            </span>
            <span tw="text-base font-semibold text-[#111111] mt-1">
              Resend, Supabase & Vapi Real-time
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
