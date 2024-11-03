// dashboard/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Download, TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip as ChartTooltip } from "recharts";
import data from "@/json/respuestav2.json";
import Header from '@/components/ui/header';

export const description = "A dashboard with dynamic cards";

const columnNames = {
  nodulos: "Nódulos",
  morfologia_nodulos: "Morfología Nódulos",
  margenes_nodulos: "Márgenes Nódulos",
  densidad_nodulo: "Densidad Nódulo",
  microcalcificaciones: "Microcalcificaciones",
  calcificaciones_benignas: "Calcificaciones Benignas",
  calcificaciones_sospechosas: "Calcificaciones Sospechosas",
  distribucion_calcificaciones: "Distribución Calcificaciones",
  presencia_asimetrias: "Presencia Asimetrías",
  tipo_asimetria: "Tipo Asimetría",
  hallazgos_asociados: "Hallazgos Asociados",
  lateralidad_hallazgo: "Lateralidad Hallazgo",
};

const columnValues = {
  nodulos: { "0": "No", "1": "Sí" },
  morfologia_nodulos: { "1": "Ovalado", "2": "Redondo", "3": "Irregular" },
  margenes_nodulos: { "1": "Circunscritos", "2": "Microlobulados", "3": "Indistintos o mal definidos", "4": "Obscurecidos", "5": "Espiculados" },
  densidad_nodulo: { "1": "Densidad Grasa", "2": "Baja Densidad (hipodenso)", "3": "Igual Densidad (isodenso)", "4": "Alta Densidad (hiperdenso)" },
  microcalcificaciones: { "0": "No", "1": "Sí" },
  calcificaciones_benignas: { "1": "Cutaneas", "2": "Vasculares", "3": "Gruesas o Pop Corn", "4": "Leño o Vara", "5": "Redondas o puntiformes", "6": "Anulares", "7": "Distroficas", "8": "Leche de Calcio", "9": "Suturas" },
  calcificaciones_sospechosas: { "1": "Gruesas heterogeneas", "2": "Amorfas", "3": "Finas pleomorficas", "4": "Lineas finas o lineales ramificadas" },
  distribucion_calcificaciones: { "1": "Difusas", "2": "Regionales", "3": "Agrupadas (cumulo)", "4": "Segmentaria", "5": "Lineal" },
  presencia_asimetrias: { "0": "No", "1": "Sí" },
  tipo_asimetria: { "1": "Asimetria", "2": "Asimetria global", "3": "Asimetria focal", "4": "Asimetria focal evolutiva" },
  hallazgos_asociados: { "1": "Retracción de la piel", "2": "Retracción del pezón", "3": "Engrosamiento de la piel", "4": "Engrosamiento trabecular", "5": "Adenopatias axilares" },
  lateralidad_hallazgo: { "1": "Derecho", "2": "Izquierdo", "3": "Bilateral" },
};

const biradsCategories = ["0", "1", "2", "3", "4A", "4B", "4C", "5", "6"];

export default function DashboardPage() {
  const router = useRouter();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedBirads, setSelectedBirads] = useState<string[]>([]);

  const handleCheckboxChange = (column: string) => {
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.includes(column)
        ? prevSelectedColumns.filter((col) => col !== column)
        : [...prevSelectedColumns, column]
    );
  };

  const handleBiradsCheckboxChange = (category: string) => {
    setSelectedBirads((prevSelectedBirads) =>
      prevSelectedBirads.includes(category)
        ? prevSelectedBirads.filter((cat) => cat !== category)
        : [...prevSelectedBirads, category]
    );
  };

  const getColumnSum = (column: string) => {
    return data.structured_data.reduce((sum, item: { [key: string]: string }) => {
      const value = parseInt(item[column], 10);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
  };

  const getColumnData = (column: keyof typeof columnValues) => {
    const values = columnValues[column];
    const counts = Object.keys(values).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<string, number>);

    data.structured_data.forEach((item: { [key: string]: string }) => {
      const value = item[column];
      if (counts[value] !== undefined) {
        counts[value]++;
      }
    });

    return Object.keys(values).map((key) => ({
      key,
      label: (values as Record<string, string>)[key],
      count: counts[key],
    }));
  };

  const getBiradsData = () => {
    const biradsCounts = biradsCategories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {} as Record<string, number>);

    data.structured_data.forEach((item) => {
      const biradsValue = item.birads;
      if (biradsCounts[biradsValue] !== undefined) {
        biradsCounts[biradsValue]++;
      }
    });

    return biradsCategories.map((category) => ({
      category,
      count: biradsCounts[category],
    }));
  };

  const biradsData = getBiradsData().filter((item) =>
    selectedBirads.includes(item.category)
  );

  return (
    <>
      <Header />
      <div className="flex flex-col gap-6 p-8 bg-white min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>


        <div className="mb-4">
          <h2 className="text-lg text-muted-foreground mb-2">Parámetros</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(columnNames).map((column) => (
              <div key={column} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedColumns.includes(column)}
                  onCheckedChange={() => handleCheckboxChange(column)}
                  aria-label={`Toggle ${column}`}
                />
                <span className="text-sm">
                  {columnNames[column as keyof typeof columnNames]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg text-muted-foreground mb-2">Clasificación de BIRADS</h2>
          <div className="grid grid-cols-2 gap-2">
            {biradsCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedBirads.includes(category)}
                  onCheckedChange={() => handleBiradsCheckboxChange(category)}
                  aria-label={`Toggle ${category}`}
                />
                <span className="text-sm">BIRADS {category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {selectedColumns.map((column) => {
            const columnData = getColumnData(column as keyof typeof columnValues);
            return columnData.map((data) => (
              <Card key={`${column}-${data.key}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {columnNames[column as keyof typeof columnNames]} - {data.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.count}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de registros con {columnNames[column as keyof typeof columnNames]} {data.label}
                  </p>
                </CardContent>
              </Card>
            ));
          })}
        </div>

        {selectedBirads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Gráfico - BIRADS</CardTitle>
              <CardDescription>Distribución de categorías de BIRADS</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                width={500}
                height={300}
                data={biradsData}
                layout="vertical"
                margin={{
                  left: -20,
                }}
              >
                <XAxis type="number" dataKey="count" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip />
                <Bar dataKey="count" fill="#8884d8" radius={5} />
              </BarChart>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="leading-none text-muted-foreground">
                Mostrando total de diagnósticos BIRAD
              </div>
            </CardFooter>
          </Card>
        )}

        <div className="flex justify-end py-4">
          <Button onClick={() => router.push('/results')} variant="outline" style={{ backgroundColor: '#e3353b', color: 'white' }}>
            Ir a Resultados
          </Button>
        </div>
      </div>
    </>
  );
}