"use client"

import { useHotkeys } from "@mantine/hooks"
import type { Table } from "@tanstack/react-table"
import { XIcon } from "lucide-react"
import * as React from "react"
import { useRef } from "react"
import { DataTableFacetedFilter } from "~/components/admin/data-table/data-table-faceted-filter"
import { Button } from "~/components/common/button"
import { Input } from "~/components/common/input"
import { Kbd } from "~/components/common/kbd"
import { Stack } from "~/components/common/stack"
import type { DataTableFilterField } from "~/types"
import { cx } from "~/utils/cva"

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const inputRef = useRef<HTMLInputElement>(null)

  useHotkeys([["/", () => inputRef.current?.focus()]])

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter(field => !field.options),
      filterableColumns: filterFields.filter(field => field.options),
    }
  }, [filterFields])

  return (
    <div
      className={cx(
        "flex items-center justify-between gap-2 w-full py-1 -my-1 overflow-auto",
        className,
      )}
      {...props}
    >
      <Stack size="sm" wrap={false}>
        {searchableColumns.map(
          column =>
            table.getColumn(column.id) && (
              <div className="relative">
                <Input
                  key={String(column.id)}
                  ref={inputRef}
                  className="w-40 lg:w-60"
                  placeholder={column.placeholder}
                  value={String(table.getColumn(column.id)?.getFilterValue() ?? "")}
                  onChange={e => table.getColumn(column.id)?.setFilterValue(e.target.value)}
                />

                <Kbd className="absolute right-2 top-1/2 -translate-y-1/2 m-0 pointer-events-none">
                  /
                </Kbd>
              </div>
            ),
        )}

        {filterableColumns.map(
          column =>
            table.getColumn(column.id) && (
              <DataTableFacetedFilter
                key={String(column.id)}
                column={table.getColumn(column.id)}
                title={column.label}
                options={column.options ?? []}
              />
            ),
        )}

        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            size="md"
            onClick={() => table.resetColumnFilters()}
            suffix={<XIcon />}
          >
            Reset
          </Button>
        )}
      </Stack>

      <Stack size="sm" wrap={false}>
        {children}
      </Stack>
    </div>
  )
}
