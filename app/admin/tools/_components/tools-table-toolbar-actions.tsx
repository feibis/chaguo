"use client"

import type { Tool } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import { ToolsDeleteDialog } from "~/app/admin/tools/_components/tools-delete-dialog"

interface ToolsTableToolbarActionsProps {
  table: Table<Tool>
}

export function ToolsTableToolbarActions({ table }: ToolsTableToolbarActionsProps) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <ToolsDeleteDialog
          tools={table.getFilteredSelectedRowModel().rows.map(row => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}

      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </>
  )
}
