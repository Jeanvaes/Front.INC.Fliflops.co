"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MainPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('File processed successfully!');
      } else {
        setMessage('Error processing file.');
      }
    } catch (error) {
      setMessage('Error processing file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload CSV File</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="file">CSV File</Label>
            <Input id="file" type="file" accept=".csv" onChange={handleFileChange} />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            Upload
          </button>
        </form>
        {loading && <p className="text-center mt-4">Loading...</p>}
        {message && <p className="text-center mt-4">{message}</p>}
      </div>
    </div>
  );
}