import type { Column } from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, EyeOffIcon } from "lucide-react"
import type { ComponentProps } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { cva, cx } from "~/utils/cva"

const dataTableColumnHeaderVariants = cva({
  base: "text-start font-medium text-muted-foreground whitespace-nowrap",

  variants: {
    toggleable: {
      true: "flex items-center gap-1 hover:text-foreground data-[state=open]:text-foreground",
    },
  },
})

type DataTableColumnHeaderProps<TData, TValue> = ComponentProps<typeof DropdownMenuTrigger> & {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cx(dataTableColumnHeaderVariants({ className }))}>{title}</div>
  }

  const buttonLabel =
    column.getCanSort() && column.getIsSorted() === "desc"
      ? "Sorted descending. Click to sort ascending."
      : column.getIsSorted() === "asc"
        ? "Sorted ascending. Click to sort descending."
        : "Not sorted. Click to sort ascending."

  const buttonSuffix =
    column.getCanSort() && column.getIsSorted() === "desc" ? (
      <ArrowDownIcon />
    ) : column.getIsSorted() === "asc" ? (
      <ArrowUpIcon />
    ) : (
      <ChevronsUpDownIcon />
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cx(dataTableColumnHeaderVariants({ toggleable: true, className }))}
        aria-label={buttonLabel}
        {...props}
      >
        {title}
        {buttonSuffix}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {column.getCanSort() && (
          <>
            <DropdownMenuItem
              aria-label="Sort ascending"
              onClick={() => column.toggleSorting(false)}
            >
              <ArrowUpIcon className="mr-2 text-muted-foreground/70" aria-hidden="true" />
              Asc
            </DropdownMenuItem>

            <DropdownMenuItem
              aria-label="Sort descending"
              onClick={() => column.toggleSorting(true)}
            >
              <ArrowDownIcon className="mr-2 text-muted-foreground/70" aria-hidden="true" />
              Desc
            </DropdownMenuItem>
          </>
        )}
        {column.getCanSort() && column.getCanHide() && <DropdownMenuSeparator />}
        {column.getCanHide() && (
          <DropdownMenuItem aria-label="Hide column" onClick={() => column.toggleVisibility(false)}>
            <EyeOffIcon className="mr-2 text-muted-foreground/70" aria-hidden="true" />
            Hide
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
