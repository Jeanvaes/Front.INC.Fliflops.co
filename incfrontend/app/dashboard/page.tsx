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
import data from "@/json/respuesta.json";
import Header from '@/components/ui/header';

export const description = "A dashboard with dynamic cards";

const columnNames = {
  nodulos: "Nódulos",
  morfologia_nodulos: "Morfología Nódulos",
  margenes_nodulos: "Márgenes Nódulos",
  densidad_nodulo: "Densidad Nódulo",
  microcalcificaciones: "Microcalcificaciones",
  presencia_microcalcificaciones: "Presencia Microcalcificaciones",
  calcificaciones_benignas: "Calcificaciones Benignas",
  calcificaciones_sospechosas: "Calcificaciones Sospechosas",
  distribucion_calcificaciones: "Distribución Calcificaciones",
  presencia_asimetrias: "Presencia Asimetrías",
  tipo_asimetria: "Tipo Asimetría",
  hallazgos_asociados: "Hallazgos Asociados",
  lateralidad_hallazgo: "Lateralidad Hallazgo",
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
          <Button variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Jan 20, 2023 - Feb 09, 2023
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 gap-2 mb-4">
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

      <div className="grid grid-cols-2 gap-2 mb-4">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {selectedColumns.map((column) => (
          <Card key={column}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {columnNames[column as keyof typeof columnNames]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getColumnSum(column)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBirads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart - BIRADS</CardTitle>
            <CardDescription>Distribution of BIRADS categories</CardDescription>
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
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      )}

      <div className="flex justify-end py-4">
        <Button onClick={() => router.push('/results')} variant="outline" style={{ backgroundColor: '#e3353b', color: 'white' }}>
          Ir al Dashboard
        </Button>
      </div>
    </div>
    </>
  );
}