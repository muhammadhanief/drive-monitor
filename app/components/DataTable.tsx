"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileDown, ArrowUpDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { useRouter, usePathname } from 'next/navigation';

interface DownloadItem {
  id: number;
  timestamp: number;
  user: string;
  fileName: string;
  filePath: string;
  kabkot?: string;
}

export function DataTable({
  data,
  page,
  limit,
  total,
  totalPages
}: {
  data: DownloadItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const columns: ColumnDef<DownloadItem>[] = [
    {
      accessorKey: "timestamp",
      header: "Waktu",
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp") as number;
        return new Date(timestamp * 1000).toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta"
        }).replace(/\./g, ':');
      },
      sortingFn: "datetime",
    },
    {
      accessorKey: "kabkot",
      header: "Kab/Kot",
      cell: ({ row }) => <span className="font-semibold text-gray-700">{row.getValue("kabkot")}</span>,
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => <span className="font-medium text-gray-900">{row.getValue("user")}</span>,
    },
    {
      accessorKey: "fileName",
      header: "File",
      cell: ({ row }) => <span className="max-w-md truncate block text-gray-700">{row.getValue("fileName")}</span>,
    },
  ];

  const exportToExcel = () => {
    const exportData = table.getFilteredRowModel().rows.map(row => {
      const timestamp = row.getValue("timestamp") as number;
      const formattedDate = new Date(timestamp * 1000).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta"
      }).replace(/\./g, ':');

      return {
        'Waktu': formattedDate,
        'Kab/Kot': row.getValue("kabkot"),
        'User': row.getValue("user"),
        'File': row.getValue("fileName"),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aktivitas Unduh");
    XLSX.writeFile(workbook, `Aktivitas_Unduh_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Cari data..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <FileDown className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-6 py-2 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <div className="ml-1 opacity-60">
                            {{
                              asc: <ChevronUp className="w-4 h-4 text-blue-600 opacity-100" />,
                              desc: <ChevronDown className="w-4 h-4 text-blue-600 opacity-100" />,
                            }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="w-3.5 h-3.5" />}
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-2 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Halaman {page} dari {totalPages || 1} ({total} data)
          </span>
          <select
            value={limit}
            onChange={(e) => {
              router.push(`${pathname}?page=1&limit=${e.target.value}`);
            }}
            className="ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 cursor-pointer"
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Tampilkan {pageSize}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`${pathname}?page=1&limit=${limit}`)}
            disabled={page <= 1}
            className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Halaman Pertama"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push(`${pathname}?page=${page - 1}&limit=${limit}`)}
            disabled={page <= 1}
            className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push(`${pathname}?page=${page + 1}&limit=${limit}`)}
            disabled={page >= totalPages}
            className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Halaman Selanjutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push(`${pathname}?page=${totalPages}&limit=${limit}`)}
            disabled={page >= totalPages}
            className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Halaman Terakhir"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
