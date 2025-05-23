"use client"

import type { Tag } from "@prisma/client"
import { TrashIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
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
import { deleteTags } from "~/server/admin/tags/actions"

type TagsDeleteDialogProps = ComponentProps<typeof Dialog> & {
  tags: Tag[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const TagsDeleteDialog = ({
  tags,
  showTrigger = true,
  onSuccess,
  ...props
}: TagsDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteTags, {
    onSuccess: () => {
      props.onOpenChange?.(false)
      toast.success("Tags deleted")
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
          <Button variant="secondary" size="md" prefix={<TrashIcon />}>
            Delete ({tags.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{tags.length}</span>
            {tags.length === 1 ? " tag" : " tags"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            size="md"
            variant="destructive"
            className="min-w-28"
            onClick={() => execute({ ids: tags.map(({ id }) => id) })}
            isPending={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
