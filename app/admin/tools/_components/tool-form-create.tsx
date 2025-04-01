"use client"

import { slugify } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Input } from "~/components/common/input"
import { Link } from "~/components/common/link"
import { useComputedField } from "~/hooks/use-computed-field"
import { createTool } from "~/server/admin/tools/actions"
import { toolSchema } from "~/server/admin/tools/schemas"
import { cx } from "~/utils/cva"

export function ToolFormCreate({ children, className, ...props }: ComponentProps<"form">) {
  const [isPreviewing, setIsPreviewing] = useState(false)

  const form = useForm({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: "",
      slug: "",
      websiteUrl: "",
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
  })

  // Create tool
  const { execute: createToolAction, isPending: isCreatingTool } = useServerAction(createTool, {
    onSuccess: ({ data }) => {
      toast.success("Tool successfully created")
      redirect(`/admin/tools/${data.slug}`)
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => createToolAction(data))}
        className={cx("grid gap-4 sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input data-1p-ignore {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button variant="secondary" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>

          <Button variant="primary" isPending={isCreatingTool}>
            Create Tool
          </Button>
        </div>
      </form>
    </Form>
  )
}
