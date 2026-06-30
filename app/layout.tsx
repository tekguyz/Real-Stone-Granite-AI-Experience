import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tekguyz-sarah.vercel.app'),
  title: 'Real Stone & Granite | Showroom Front Desk Workspace',
  description: 'Capturing high-value architectural masonry and custom countertop leads around the clock seamlessly.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Real Stone & Granite | Showroom Front Desk Workspace',
    description: 'Capturing high-value architectural masonry and custom countertop leads around the clock seamlessly.',
    url: 'https://tekguyz-sarah.vercel.app',
    siteName: 'Real Stone & Granite',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Real Stone & Granite | Showroom Front Desk Workspace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
