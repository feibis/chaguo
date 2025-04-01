"use client"

import type { Tool } from "@prisma/client"
import { useRouter } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolsDeleteDialog } from "~/app/admin/tools/_components/tools-delete-dialog"
import type { Button } from "~/components/common/button"
import type { DataTableRowAction } from "~/types"

type UpdateToolActionProps = ComponentProps<typeof Button> & {
  tool: Tool
}

export const UpdateToolActions = ({ tool, ...props }: UpdateToolActionProps) => {
  const router = useRouter()
  const [rowAction, setRowAction] = useState<DataTableRowAction<Tool> | null>(null)

  return (
    <>
      <ToolActions tool={tool} setRowAction={setRowAction} {...props} />

      <ToolsDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        tools={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => router.push("/admin/tools")}
      />
    </>
  )
}
