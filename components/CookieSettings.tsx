"use client"

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { setAnalyticsConsent } from '@/lib/analytics';
import { X } from 'lucide-react';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CookieSettings({ isOpen, onClose }: CookieSettingsProps) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const consent = getCookie('analytics-consent');
      setAnalyticsEnabled(consent === 'granted');
    }
  }, [isOpen]);

  const handleSave = () => {
    setAnalyticsConsent(analyticsEnabled);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="cookie-settings-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 id="cookie-settings-title" className="text-xl font-semibold">Cookie Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close cookie settings"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Essential Cookies</h3>
            <p className="text-sm text-gray-600">
              These cookies are necessary for the website to function and cannot be disabled.
            </p>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-900">Always Active</label>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Analytics Cookies</h3>
            <p className="text-sm text-gray-600">
              These cookies help us understand how visitors interact with our website.
            </p>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="analytics-consent"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
              />
              <label 
                htmlFor="analytics-consent" 
                className="ml-2 text-sm text-gray-900 cursor-pointer"
              >
                Enable Analytics
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}