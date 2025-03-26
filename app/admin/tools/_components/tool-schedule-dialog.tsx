"use client"

import type { Tool } from "@prisma/client"
import { ClockIcon } from "lucide-react"
import { type ComponentProps, useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import { Calendar } from "~/components/common/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/common/dialog"
import { scheduleTool } from "~/server/admin/tools/actions"

type ToolScheduleDialogProps = ComponentProps<typeof Dialog> & {
  tool?: Tool
  showTrigger?: boolean
  onSuccess?: () => void
}

export const ToolScheduleDialog = ({
  tool,
  showTrigger = true,
  onSuccess,
  ...props
}: ToolScheduleDialogProps) => {
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(undefined)

  const { execute, isPending } = useServerAction(scheduleTool, {
    onSuccess: () => {
      props.onOpenChange?.(false)
      toast.success("Tool scheduled")
      onSuccess?.()
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="md">
            <ClockIcon className="max-sm:mr-2" aria-hidden="true" />
            Schedule
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a date to publish</DialogTitle>
          <DialogDescription>This tool will be published on the date you choose.</DialogDescription>
        </DialogHeader>

        <Calendar autoFocus mode="single" selected={publishedAt} onSelect={setPublishedAt} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Publish selected rows"
            size="md"
            className="min-w-28"
            onClick={() => publishedAt && tool && execute({ id: tool.id, publishedAt })}
            isPending={isPending}
            disabled={!publishedAt || isPending}
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
