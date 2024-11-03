// columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type StructuredData = {
  nodulos: string;
  morfologia_nodulos: string;
  margenes_nodulos: string;
  densidad_nodulo: string;
  microcalcificaciones: string;
  presencia_microcalcificaciones: string;
  calcificaciones_benignas: string;
  calcificaciones_sospechosas: string;
  distribucion_calcificaciones: string;
  presencia_asimetrias: string;
  tipo_asimetria: string;
  hallazgos_asociados: string;
  lateralidad_hallazgo: string;
  birads: string;
};

export const columns: ColumnDef<StructuredData>[] = [
  { accessorKey: "nodulos", header: "Nódulos" },
  { accessorKey: "morfologia_nodulos", header: "Morfología Nódulos" },
  { accessorKey: "margenes_nodulos", header: "Márgenes Nódulos" },
  { accessorKey: "densidad_nodulo", header: "Densidad Nódulo" },
  { accessorKey: "microcalcificaciones", header: "Microcalcificaciones" },
  { accessorKey: "presencia_microcalcificaciones", header: "Presencia Microcalcificaciones" },
  { accessorKey: "calcificaciones_benignas", header: "Calcificaciones Benignas" },
  { accessorKey: "calcificaciones_sospechosas", header: "Calcificaciones Sospechosas" },
  { accessorKey: "distribucion_calcificaciones", header: "Distribución Calcificaciones" },
  { accessorKey: "presencia_asimetrias", header: "Presencia Asimetrías" },
  { accessorKey: "tipo_asimetria", header: "Tipo Asimetría" },
  { accessorKey: "hallazgos_asociados", header: "Hallazgos Asociados" },
  { accessorKey: "lateralidad_hallazgo", header: "Lateralidad Hallazgo" },
  { accessorKey: "birads", header: "BIRADS" },
];