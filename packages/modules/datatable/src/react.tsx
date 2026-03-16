"use client";

import {
  Badge,
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Input,
  Progress,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shandapha/core";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  savedViewLabel?: string;
}

export function DataTableToolbar({
  query,
  onQueryChange,
  rowCount,
  totalCount,
  savedViewLabel,
  placeholder,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  rowCount: number;
  totalCount: number;
  savedViewLabel?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/70 p-4 md:flex-row md:items-center md:justify-between">
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder ?? "Search records..."}
        className="md:max-w-sm"
      />
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>
          {rowCount} of {totalCount} rows
        </span>
        <Progress
          value={totalCount === 0 ? 0 : (rowCount / totalCount) * 100}
          className="hidden w-24 md:block"
        />
        {savedViewLabel ? (
          <Badge variant="outline">{savedViewLabel}</Badge>
        ) : null}
      </div>
    </div>
  );
}

export function DataTableLoadingState({
  rows = 6,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  const loadingColumnKeys = Array.from(
    { length: columns },
    (_, columnIndex) => `loading-column-${columnIndex}`,
  );
  const loadingRowKeys = Array.from(
    { length: rows },
    (_, rowIndex) => `loading-row-${rowIndex}`,
  );

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {loadingColumnKeys.map((columnKey) => (
              <TableHead key={columnKey}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingRowKeys.map((rowKey) => (
            <TableRow key={rowKey}>
              {loadingColumnKeys.map((columnKey) => (
                <TableCell key={`${rowKey}-${columnKey}`}>
                  <Skeleton className="h-4 w-full max-w-[12rem]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function DataTableEmptyState({
  label = "No records found.",
}: {
  label?: string;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Nothing matched this view</EmptyTitle>
        <EmptyDescription>{label}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        Adjust filters, clear search terms, or switch to a different saved view.
      </EmptyContent>
    </Empty>
  );
}

export function DataTableErrorState({ message }: { message: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Table data failed to load</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        Keep the free path usable by falling back to a basic table or retrying
        with a narrower query.
      </EmptyContent>
    </Empty>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search records...",
  emptyLabel = "No records found.",
  savedViewLabel,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  React.useEffect(() => {
    if (searchKey) {
      const column = table.getColumn(searchKey);
      column?.setFilterValue(globalFilter);
      return;
    }

    table.setGlobalFilter(globalFilter);
  }, [globalFilter, searchKey, table]);

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="grid gap-4">
      <DataTableToolbar
        query={globalFilter}
        onQueryChange={setGlobalFilter}
        rowCount={filteredCount}
        totalCount={data.length}
        savedViewLabel={savedViewLabel}
        placeholder={searchPlaceholder}
      />
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-8">
                  <DataTableEmptyState label={emptyLabel} />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Free baseline stays usable with client mode, filtering, sorting,
          selection, sticky header, and pagination.
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Badge variant="secondary">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </Badge>
          <Button
            type="button"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
