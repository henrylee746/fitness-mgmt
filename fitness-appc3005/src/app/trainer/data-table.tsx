"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trainer } from "./columns";
import React from "react";

interface WithTrainer {
  trainer: { name: string };
}

//Two generic paramters: TData, TValue
//TData represents the structure of each row
//TValue represents the individual cell values of the table
//extends WithTrainer: TData must contain a trainer
interface DataTableProps<TData extends WithTrainer, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  trainers: Trainer[];
}

//You also need to extend WithTrainer in the function
//in addition to the interface
export function DataTable<TData extends WithTrainer, TValue>({
  columns,
  data,
  trainers,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [filteredData, setFilteredData] = React.useState(data);

  const handleFilter = async (value: string) => {
    const res = await fetch("/api/trainer/search", {
      method: "POST",
      body: JSON.stringify(value === "All" ? { id: "" } : { id: value }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setFilteredData(data);
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      columnFilters,
    },
  });

  console.log(data);

  return (
    <div>
      <div className="flex items-center py-2">
        <Select onValueChange={handleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a trainer" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trainers</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              {trainers.map((trainer) => (
                <SelectItem key={trainer.id} value={String(trainer.id)}>
                  {trainer.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-hidden rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
    </div>
  );
}
