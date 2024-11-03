// data-table.tsx
"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StructuredData, columns } from "./columns";
import data from "@/json/respuestav2.json";
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

const columnNames = {
  id_paciente: "ID Paciente",
  prestacion: "Prestación",
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
  birads: "BIRADS",
  edad: "Edad",
};

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();

  const table = useReactTable({
    data: data.structured_data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const downloadCSV = () => {
    const visibleColumns = table
      .getAllColumns()
      .filter((column) => column.getIsVisible())
      .map((column) => column.id);

    const rows = table.getFilteredRowModel().rows.map((row) =>
      visibleColumns.map((columnId) => row.getValue(columnId))
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [visibleColumns.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadXLSX = () => {
    const visibleColumns = table
      .getAllColumns()
      .filter((column) => column.getIsVisible())
      .map((column) => column.id);

    const rows = table.getFilteredRowModel().rows.map((row) =>
      visibleColumns.map((columnId) => row.getValue(columnId))
    );

    const worksheet = XLSX.utils.aoa_to_sheet([visibleColumns, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

    XLSX.writeFile(workbook, "filtered_data.xlsx");
  };

  const toggleAllColumns = (checked: boolean) => {
    table.getAllColumns().forEach((column) => {
      column.toggleVisibility(checked);
    });
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex">
      <div className="w-3/4 pr-4"> {/* Added padding-right here */}
        <div className="flex items-center py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnNames[column.id as keyof typeof columnNames] || column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="bg-[#62c985] text-black font-bold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{ backgroundColor: '#e3353b', color: 'white' }}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{ backgroundColor: '#e3353b', color: 'white' }}
            >
              Siguiente
            </Button>
          </div>
        </div>
        <div className="flex justify-end space-x-2 py-4">
          <Button onClick={downloadCSV} variant="outline" style={{ backgroundColor: '#e3353b', color: 'white' }}>
            Descargar CSV
          </Button>
          <Button onClick={downloadXLSX} variant="outline" style={{ backgroundColor: '#e3353b', color: 'white' }}>
            Descargar XLSX
          </Button>
        </div>
      </div>
      <div className="w-1/4 p-4 ml-8"> {/* Increased margin-left here */}
        <h2 className="text-lg font-bold mb-4">Filtrar Columnas</h2>
        <div className="mb-4 flex items-center">
          <Checkbox
            checked={table.getIsAllColumnsVisible()}
            onCheckedChange={(value) => toggleAllColumns(!!value)}
            aria-label="Select all columns"
          />
          <span className="ml-2 text-sm">Seleccionar Todas</span> {/* Decreased font size */}
        </div>
        <div className="grid grid-cols-2 gap-4"> {/* Increased gap to 4 */}
          {table.getAllColumns().map((column) => (
            <div key={column.id} className="flex items-center space-x-2">
              <Checkbox
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                aria-label={`Toggle ${column.id}`}
              />
              <span className="text-xs"> {/* Decreased font size */}
                {columnNames[column.id as keyof typeof columnNames] || column.id}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-end py-4">
          <Button onClick={navigateToDashboard} variant="outline" style={{ backgroundColor: '#e3353b', color: 'white' }}>
            Ir al Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}