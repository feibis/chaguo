import type { ComponentProps } from "react"
import { Note } from "~/components/common/note"
import { cx } from "~/utils/cva"

const Table = ({ className, ...props }: ComponentProps<"table">) => {
  return (
    <table
      className={cx("w-full text-sm grid grid-cols-(--table-columns) overflow-auto", className)}
      {...props}
    />
  )
}

const TableHeader = ({ className, ...props }: ComponentProps<"thead">) => {
  return <thead className={cx("contents", className)} {...props} />
}

const TableBody = ({ className, ...props }: ComponentProps<"tbody">) => {
  return <tbody className={cx("contents", className)} {...props} />
}

const TableRow = ({ className, ...props }: ComponentProps<"tr">) => {
  return (
    <tr
      className={cx(
        "relative grid grid-cols-subgrid col-span-full items-center h-9 border-t",
        "[thead>&:first-child,tbody:first-child>&:first-child]:border-t-0 [tbody>&:not([aria-disabled])]:hover:bg-accent data-[state=selected]:bg-accent",
        className,
      )}
      {...props}
    />
  )
}

const TableHead = ({ className, ...props }: ComponentProps<"th">) => {
  return (
    <th
      className={cx(
        "px-2 text-left font-medium text-muted-foreground first:not-[&:has([type=checkbox])]:pl-4",
        className,
      )}
      {...props}
    />
  )
}

const TableCell = ({ className, ...props }: ComponentProps<"td">) => {
  return <td className={cx("px-2 first:not-[&:has([type=checkbox])]:pl-4", className)} {...props} />
}

const TableCaption = ({ className, ...props }: ComponentProps<typeof Note>) => {
  return <Note as="caption" className={cx("mt-4", className)} {...props} />
}

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption }
