"use client"

import type { Category } from "@prisma/client"
import { PlusIcon } from "lucide-react"
import { useQueryStates } from "nuqs"
import { use, useMemo } from "react"
import { getColumns } from "~/app/admin/categories/_components/categories-table-columns"
import { CategoriesTableToolbarActions } from "~/app/admin/categories/_components/categories-table-toolbar-actions"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import type { findCategories } from "~/server/admin/categories/queries"
import { categoriesTableParamsSchema } from "~/server/admin/categories/schema"
import type { DataTableFilterField } from "~/types"

type CategoriesTableProps = {
  categoriesPromise: ReturnType<typeof findCategories>
}

export function CategoriesTable({ categoriesPromise }: CategoriesTableProps) {
  const { categories, categoriesTotal, pageCount } = use(categoriesPromise)
  const [{ perPage, sort }] = useQueryStates(categoriesTableParamsSchema)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), [])

  // Search filters
  const filterFields: DataTableFilterField<Category>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Filter by name...",
    },
  ]

  const { table } = useDataTable({
    data: categories,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <>
      <DataTable table={table}>
        <DataTableHeader
          title="Categories"
          total={categoriesTotal}
          callToAction={
            <Button variant="primary" size="md" prefix={<PlusIcon />} asChild>
              <Link href="/admin/categories/new">
                <div className="max-sm:sr-only">New category</div>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <CategoriesTableToolbarActions table={table} />
            <DateRangePicker align="end" />
            <DataTableViewOptions table={table} />
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>
    </>
  )
}
