"use client"

import Link from 'next/link';
import { useState } from 'react';
import CookieSettings from './CookieSettings';

const Footer = () => {
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">&copy; {currentYear} HBDesign. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-4">
            <Link href="/impressum" className="text-gray-600 hover:text-gray-800">Impressum</Link>
            <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-800">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-gray-600 hover:text-gray-800">Terms and Conditions</Link>
            <button 
              onClick={() => setIsCookieSettingsOpen(true)} 
              className="text-gray-600 hover:text-gray-800"
            >
              Manage Cookie Settings
            </button>
          </nav>
        </div>
      </div>
      <CookieSettings 
        isOpen={isCookieSettingsOpen} 
        onClose={() => setIsCookieSettingsOpen(false)} 
      />
    </footer>
  );
};

export default Footer;