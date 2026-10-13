"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
} from "@tabler/icons-react"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
})

export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<typeof dataTableFeatures, TData>()
}

type DataTableProps<TData extends RowData> = {
  columns: any[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  pageSize?: number
  emptyMessage?: string
  toolbar?: React.ReactNode
  loading?: boolean
  className?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  pageSize = 10,
  emptyMessage = "No results.",
  toolbar,
  loading = false,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  })

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  })

  const from =
    table.getFilteredRowModel().rows.length === 0
      ? 0
      : table.state.pagination.pageIndex * table.state.pagination.pageSize + 1
  const to = Math.min(
    (table.state.pagination.pageIndex + 1) * table.state.pagination.pageSize,
    table.getFilteredRowModel().rows.length,
  )
  const total = table.getFilteredRowModel().rows.length

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-card",
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Show</span>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" className="h-9 w-18 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="bottom">
              {[5, 10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          {searchKey ? (
            <div className="relative w-full sm:max-w-xs">
              <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={
                  (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                placeholder={searchPlaceholder}
                className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 dark:bg-transparent"
              />
            </div>
          ) : null}
          {toolbar ? (
            <div className="flex shrink-0 items-center justify-end gap-2">
              {toolbar}
            </div>
          ) : null}
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-0 hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="h-12 bg-primary px-4 text-[11px] font-bold tracking-[0.08em] text-white uppercase first:rounded-none last:rounded-none dark:bg-white dark:text-slate-900"
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-white dark:text-slate-900"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <FlexRender header={header} />
                      </button>
                    ) : (
                      <FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-slate-100 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/40"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-3.5">
                    <FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <p className="text-sm text-slate-500">
          {from}-{to} of {total}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium dark:border-slate-700">
            {table.state.pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
