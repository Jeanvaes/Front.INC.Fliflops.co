"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressDemo } from '@/components/ui/progress-demo';
import Header from "@/components/ui/header";
export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/results'); // Redirige a la página de resultados después de 3 segundos
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
    <Header />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Procesando archivo...</h1>
        <ProgressDemo />
      </div>
    </div>
    </>
  );
}