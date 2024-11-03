// components/ui/Header.tsx
"use client";

import React from 'react';
import Logo from '@/images/logo.jpg';
import LogoMedio from '@/images/logomedio.png';

export default function Header() {
  return (
    <header className="bg-[#e3353b] p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={Logo.src} alt="Logo" className="h-16" />
          <img src={LogoMedio.src} alt="Logo Medio" className="h-16" />
        </div>
      </div>
    </header>
  );
}