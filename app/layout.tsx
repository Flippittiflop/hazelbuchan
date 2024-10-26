import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'HBDesign - Creative Portfolio',
    template: '%s | HBDesign'
  },
  description: 'Explore the creative portfolio of HBDesign, featuring graphic design, paper art, and illustrations.',
  keywords: ['design', 'paper art', 'illustration', 'creative portfolio', 'graphic design'],
  authors: [{ name: 'HBDesign' }],
  creator: 'HBDesign',
  publisher: 'HBDesign',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.hbdesign.com',
    title: 'HBDesign - Creative Portfolio',
    description: 'Explore the creative portfolio of HBDesign, featuring graphic design, paper art, and illustrations.',
    siteName: 'HBDesign',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HBDesign - Creative Portfolio',
    description: 'Explore the creative portfolio of HBDesign, featuring graphic design, paper art, and illustrations.',
    creator: '@hbdesign',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}