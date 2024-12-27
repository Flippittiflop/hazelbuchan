"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Menu, X, Origami, Brush, Mail, Flower, CalendarHeart } from 'lucide-react';

const NavLink = ({ href, children, icon: Icon, hoverColor }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-gray-800 transition-colors duration-200 relative group flex flex-col items-center text-center w-full`}
      aria-label={`Navigate to ${children}`}
    >
      <Icon className={`mb-1 w-5 h-5 text-gray-400 ${hoverColor} transition-colors duration-200`} aria-hidden="true" />
      <span className="w-full">{children}</span>
      <span
        className={`absolute -bottom-1 left-0 w-full h-0.5 bg-current origin-left transform transition-transform duration-200
          ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
      ></span>
    </Link>
  );
};

const MobileNavLink = ({ href, onClick, children, icon: Icon, hoverColor }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-base font-medium
        ${isActive
          ? 'text-blue-600 bg-blue-50'
          : `text-gray-700 hover:${hoverColor} hover:bg-gray-50`
        }`}
      onClick={onClick}
      aria-label={`Navigate to ${children}`}
    >
      <Icon className={`mr-2 w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'} transition-colors duration-200`} aria-hidden="true" />
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { href: "/flower-rentals", label: "Flowers", icon: Flower, hoverColor: "group-hover:text-pink-500" },
    { href: "/paper-sculpture", label: "Paper", icon: Origami, hoverColor: "group-hover:text-green-500" },
    { href: "/events-decor", label: "Events", icon: CalendarHeart, hoverColor: "group-hover:text-yellow-500" },
    { href: "/illustration", label: "Illustration", icon: Brush, hoverColor: "group-hover:text-purple-500" },
    { href: "/contact", label: "Contact", icon: Mail, hoverColor: "group-hover:text-red-500" },
  ];

  return (
    (<nav className="bg-white shadow-md sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/"
            className={`flex items-center relative group`}
            aria-label="Go to homepage"
          >
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-200">
              <Image
                src="/assets/nav/HB_Logo_Alt.jpg"
                alt="Hazel Buchan Logo"
                width={64}
                height={64}
                priority
                style={{
                  maxWidth: "100%"
                }} />
            </div>
            <span className="ml-2 text-xl font-bold hidden md:inline">Hazel Buchan</span>
            <span
              className={`absolute left-0 -bottom-1 w-full h-0.5 bg-current origin-left transform transition-transform duration-200
                ${pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
            ></span>
          </Link>

          <div className="hidden md:flex md:space-x-6 lg:space-x-8" role="menubar">
            {navItems.map((item) => (
              <div key={item.href} role="none" className="flex-1 min-w-[80px]">
                <NavLink href={item.href} icon={item.icon} hoverColor={item.hoverColor}>
                  {item.label}
                </NavLink>
              </div>
            ))}
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          className="md:hidden"
          id="mobile-menu"
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div key={item.href} role="none">
                <MobileNavLink
                  href={item.href}
                  onClick={toggleMenu}
                  icon={item.icon}
                  hoverColor={item.hoverColor}
                >
                  {item.label}
                </MobileNavLink>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>)
  );
};

export default Navbar;
