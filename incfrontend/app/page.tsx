"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { InputForm } from "@/components/ui/InputForm";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import csv from "@/images/csv.png";
import xlsx from "@/images/xlxs.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function MainPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('No se ha seleccionado ningún archivo');
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!file) {
      setMessage('Por favor seleccione un archivo.');
      return;
    }

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
          <h1 className="text-2xl font-bold mb-4 text-center">Subir archivo CSV</h1>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="file">
                <div className="flex justify-center space-x-4">
                  <img src={csv.src} alt="CSV Icon" className="h-12" />
                  <img src={xlsx.src} alt="Excel Icon" className="h-12" />
                </div>
              </Label>
              <input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer bg-[#e3353b] text-white py-2 px-4 rounded text-center">
                Seleccionar archivo
              </label>
              <span className="text-muted-foreground text-sm">
                {fileName}
              </span>
            </div>
            <Form {...form}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={form.formState.errors.username ? "text-red-500" : ""}>
                      Parámetros a buscar
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="id_paciente, prestacion, nodulos, morfologia_nodulos, margenes_nodulos, densidad_nodulo, microcalcificaciones, calcificaciones_benignas, calcificaciones_sospechosas, distribucion_calcificaciones, presencia_asimetrias, tipo_asimetria, hallazgos_asociados, lateralidad_hallazgo, birads, edad"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className={form.formState.errors.username ? "text-red-500" : ""}>
                      Digite los parámetros que se buscarán en la historias.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
            <div className="flex justify-center">
              <Button type="submit" className="w-1/2" style={{ backgroundColor: '#20b353', color: 'white' }} disabled={loading}>
                Subir
              </Button>
            </div>
          </form>
          {loading && <p className="text-center mt-4">Loading...</p>}
          {message && <p className="text-center mt-4 text-red-500">{message}</p>}
        </div>
      </div>
    </>
  );
}