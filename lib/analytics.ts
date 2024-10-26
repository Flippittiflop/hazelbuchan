import { getCookie, setCookie } from 'cookies-next';

// Replace with your GA4 Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize GA tracking
export const initGA = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    cookie_flags: 'SameSite=None;Secure',
  });
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track events (like gallery item clicks)
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Cookie consent management
export const setAnalyticsConsent = (consent: boolean) => {
  setCookie('analytics-consent', consent ? 'granted' : 'denied', {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: 'lax',
    secure: true,
  });
};

export const hasAnalyticsConsent = () => {
  return getCookie('analytics-consent') === 'granted';
};