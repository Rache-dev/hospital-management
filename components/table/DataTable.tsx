"use client"

import { ColumnDef, getPaginationRowModel, flexRender, getCoreRowModel, useReactTable, ColumnFiltersState, getFilteredRowModel} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from "react"
import Image from "next/image"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data,}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), onColumnFiltersChange: setColumnFilters, getFilteredRowModel: getFilteredRowModel(), 
    state: {
      columnFilters,
    },
  })
  return (
    <div className='flex flex-col w-full'>
      <div className="flex items-center py-4">
        <Input placeholder="Filter status..." value={(table.getColumn("status")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("status")?.setFilterValue(event.target.value)} className="max-w-sm" />
      </div>
      <div className="data-table">
        <Table className="shad-table">
          <TableHeader className="bg-dark-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="shad-table-row-header">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender( header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="shad-table-row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      </div>
      <div className="table-actions">
        <Button className="shad-gray-btn" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <Image  src="/assets/icons/arrow.svg" alt="arrow" width={24} height={24}/>
        </Button>
        <Button className="shad-gray-btn" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <Image  src="/assets/icons/arrow.svg" alt="arrow" width={24} height={24} className="rotate-180"/>
        </Button>
      </div>
    </div>
  )
}
