"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import csv from "@/images/csv.png";
import xlsx from "@/images/xlxs.png";

export default function MainPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('No se ha seleccionado ningún archivo');
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage('');

    // Simular el proceso de la API
    setTimeout(() => {
      setLoading(false);
      router.push('/loading'); // Redirige a la página de carga
    }, 1000);
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Seleccionar archivo</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="file">
                <div className="flex justify-center space-x-4">
                  <img src={csv.src} alt="CSV Icon" className="h-12" />
                  <img src={xlsx.src} alt="Excel Icon" className="h-12" />
                </div>
              </Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition-colors"
                >
                  Elegir Archivo
                </label>
                <span className="text-muted-foreground text-sm">
                  {fileName}
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="w-1/2" style={{ backgroundColor: '#20b353', color: 'white' }} disabled={loading}>
                Subir
              </Button>
            </div>
          </form>
          {loading && <p className="text-center mt-4">Loading...</p>}
          {message && <p className="text-center mt-4">{message}</p>}
        </div>
      </div>
    </>
  );
}