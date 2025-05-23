import type { CSSProperties, ComponentProps } from "react"
import { H3 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/common/table"
import { cx } from "~/utils/cva"

type DataTableSkeletonProps = ComponentProps<"div"> & {
  /**
   * The title of the table.
   * @type string
   */
  title?: string

  /**
   * The number of columns in the table.
   * @default 5
   * @type number
   */
  columnCount?: number

  /**
   * The number of rows in the table.
   * @default 10
   * @type number | undefined
   */
  rowCount?: number

  /**
   * The number of searchable columns in the table.
   * @default 0
   * @type number | undefined
   */
  searchableColumnCount?: number

  /**
   * The number of filterable columns in the table.
   * @default 0
   * @type number | undefined
   */
  filterableColumnCount?: number

  /**
   * Flag to show the table view options.
   * @default undefined
   * @type boolean | undefined
   */
  showViewOptions?: boolean

  /**
   * The width of each cell in the table.
   * The length of the array should be equal to the columnCount.
   * Any valid CSS width value is accepted.
   * @default ["auto"]
   * @type string[] | undefined
   */
  cellWidths?: string[]

  /**
   * Flag to show the pagination bar.
   * @default true
   * @type boolean | undefined
   */
  withPagination?: boolean

  /**
   * Flag to prevent the table cells from shrinking.
   * @default false
   * @type boolean | undefined
   */
  shrinkZero?: boolean
}

export function DataTableSkeleton(props: DataTableSkeletonProps) {
  const {
    title,
    columnCount = 5,
    rowCount = 10,
    searchableColumnCount = 1,
    filterableColumnCount = 2,
    showViewOptions = true,
    cellWidths = ["auto"],
    withPagination = true,
    shrinkZero = true,
    className,
    ...skeletonProps
  } = props

  return (
    <div className={cx("w-full space-y-4 overflow-auto", className)} {...skeletonProps}>
      {title && <H3>{title}</H3>}

      <div className="flex w-full items-center justify-between space-x-2 overflow-auto">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumnCount > 0 &&
            Array.from({ length: searchableColumnCount }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-40 lg:w-60" />
            ))}

          {filterableColumnCount > 0 &&
            Array.from({ length: filterableColumnCount }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-18 border-dashed" />
            ))}
        </div>

        {showViewOptions && <Skeleton className="ml-auto hidden h-8 w-18 lg:flex" />}
      </div>

      <Table
        className="rounded-md border"
        style={{ "--table-columns": `repeat(${columnCount}, minmax(0, 1fr))` } as CSSProperties}
      >
        <TableHeader>
          {Array.from({ length: 1 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, j) => (
                <TableHead
                  key={j}
                  style={{
                    width: cellWidths[j],
                    minWidth: shrinkZero ? cellWidths[j] : "auto",
                  }}
                >
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, j) => (
                <TableCell
                  key={j}
                  style={{
                    width: cellWidths[j],
                    minWidth: shrinkZero ? cellWidths[j] : "auto",
                  }}
                >
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {withPagination && (
        <div className="flex w-full items-center justify-between gap-4 overflow-auto sm:gap-8">
          <Skeleton className="h-8 w-40 shrink-0" />
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-18" />
            </div>
            <div className="flex items-center justify-center text-sm font-medium">
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="hidden size-8 lg:block" />
              <Skeleton className="size-8" />
              <Skeleton className="size-8" />
              <Skeleton className="hidden size-8 lg:block" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
