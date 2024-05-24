"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ActivityType } from "@/data/queries/getPositionActivity";
import { Card } from "../ui/card";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import ExternalLink from "../ExternalLink";

export const selectItems: { value: ActivityType; name: string }[] = [
  { value: "supply-base", name: "Supply Base" },
  { value: "withdraw-base", name: "Withdraw Base" },
  { value: "supply-collateral", name: "Supply Collateral" },
  { value: "withdraw-collateral", name: "Withdraw Collateral" },
  { value: "absorb-debt", name: "Absorb Debt" },
  { value: "claim-reward", name: "Claim Reward" },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function ClientActivityTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <>
      <Table className="pt-3">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="pb-2">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-caption-md text-content-primary font-semibold"
                    style={{ width: header.column.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center gap-3 py-4">
        <Button
          variant="ghost"
          className={clsx(
            "h-8 w-8 p-0",
            table.getCanPreviousPage() && "border-border-primary border",
          )}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          Page {table.getState().pagination.pageIndex + 1} or{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="ghost"
          className={clsx(
            "h-8 w-8 p-0",
            table.getCanNextPage() && "border-border-primary border",
          )}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRight size={16} />
        </Button>
      </div>
    </>
  );
}
