// results/page.tsx
"use client";

import React from 'react';
import Header from "@/components/ui/header";
import { DataTable } from "./data-table";

export default function ResultsPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-10">
        <DataTable />
      </div>
    </>
  );
}