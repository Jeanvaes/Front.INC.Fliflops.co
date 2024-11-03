import Logo from '@/images/logo.jpg';
import React from 'react';

export default function Header() {
  return (
    <header className="bg-[#e3353b] p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <img src={Logo.src} alt="Logo" className="h-16" />
      </div>
    </header>
  );
}