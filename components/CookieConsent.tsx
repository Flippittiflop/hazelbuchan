"use client"

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { setAnalyticsConsent } from '@/lib/analytics';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = getCookie('analytics-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    setAnalyticsConsent(true);
    setShowBanner(false);
  };

  const declineCookies = () => {
    setAnalyticsConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50" role="alert" aria-live="polite">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-700">
            We use cookies to analyze site usage and improve your experience.
            See our <a href="/privacy-policy" className="text-blue-600 hover:underline">privacy policy</a> for details.
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={acceptCookies}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={declineCookies}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}