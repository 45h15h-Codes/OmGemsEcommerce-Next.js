"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
}

export function DataTable<T>({ columns, data, isLoading }: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  
  const totalPages = Math.ceil(data.length / pageSize);
  const currentData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="w-full">
      <div className="rounded-md border border-dashboard-border bg-dashboard-card overflow-hidden">
        <Table>
          <TableHeader className="bg-dashboard-bg/50">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index} className="text-dashboard-text-muted font-medium">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-5 w-full skeleton-shimmer" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-dashboard-text-muted">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-dashboard-border hover:bg-dashboard-bg/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className="text-dashboard-text">
                      {col.cell ? col.cell(row) : String(col.accessorKey && row[col.accessorKey] !== undefined ? row[col.accessorKey] : "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && data.length > pageSize && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-dashboard-text-muted">
            Page {page + 1} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
