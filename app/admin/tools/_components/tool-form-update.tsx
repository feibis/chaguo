"use client"

import { formatDateTime } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Tool, ToolStatus } from "@prisma/client"
import { EyeIcon, PencilIcon, RefreshCwIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { generateFavicon, generateScreenshot } from "~/actions/media"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolPublishActions } from "~/app/admin/tools/_components/tool-publish-actions"
import { RelationSelector } from "~/components/admin/relation-selector"
import { Button } from "~/components/common/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { H3 } from "~/components/common/heading"
import { Input, inputVariants } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { Switch } from "~/components/common/switch"
import { TextArea } from "~/components/common/textarea"
import { ExternalLink } from "~/components/web/external-link"
import { Markdown } from "~/components/web/markdown"
import { isToolVisible } from "~/lib/tools"
import type { findCategoryList } from "~/server/admin/categories/queries"
import { updateTool } from "~/server/admin/tools/actions"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import { toolSchema } from "~/server/admin/tools/schemas"
import type { DataTableRowAction } from "~/types"
import { cx } from "~/utils/cva"

type ToolFormUpdateProps = ComponentProps<"form"> & {
  tool: NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>
  categories: ReturnType<typeof findCategoryList>
}

export function ToolFormUpdate({
  children,
  className,
  tool,
  categories,
  ...props
}: ToolFormUpdateProps) {
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isStatusChanging, setIsStatusChanging] = useState(false)
  const [rowAction, setRowAction] = useState<DataTableRowAction<Tool> | null>(null)

  const form = useForm({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: tool.name ?? "",
      slug: tool.slug ?? "",
      tagline: tool.tagline ?? "",
      description: tool.description ?? "",
      content: tool.content ?? "",
      websiteUrl: tool.websiteUrl ?? "",
      faviconUrl: tool.faviconUrl ?? "",
      screenshotUrl: tool.screenshotUrl ?? "",
      isFeatured: tool.isFeatured ?? false,
      submitterName: tool.submitterName ?? "",
      submitterEmail: tool.submitterEmail ?? "",
      submitterNote: tool.submitterNote ?? "",
      status: tool.status ?? ToolStatus.Draft,
      publishedAt: tool.publishedAt ?? undefined,
      categories: tool.categories.map(c => c.id) ?? [],
    },
  })

  // Update tool
  const { execute: updateToolAction, isPending: isUpdatingTool } = useServerAction(updateTool, {
    onSuccess: ({ data }) => {
      toast.success(
        isStatusChanging ? (
          <>
            {isToolVisible(tool) ? (
              <ExternalLink href={`/${tool.slug}`} className="font-semibold underline inline-block">
                {tool.name}
              </ExternalLink>
            ) : (
              tool.name
            )}{" "}
            is now {tool.status.toLowerCase()}.{" "}
            {tool.status === "Scheduled" && (
              <>
                Will be published on {formatDateTime(tool.publishedAt ?? new Date(), "long")} (
                {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/^.+\//, "")}).
              </>
            )}
          </>
        ) : (
          "Tool successfully updated"
        ),
      )

      if (data.slug !== tool.slug) {
        redirect(`/admin/tools/${data.slug}`)
      }

      setIsStatusChanging(false)
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  // Generate favicon
  const { execute: generateFaviconAction, isPending: isGeneratingFavicon } = useServerAction(
    generateFavicon,
    {
      onSuccess: ({ data }) => {
        toast.success("Favicon successfully generated. Please save the tool to update.")
        form.setValue("faviconUrl", data)
      },
    },
  )

  // Generate screenshot
  const { execute: generateScreenshotAction, isPending: isGeneratingScreenshot } = useServerAction(
    generateScreenshot,
    {
      onSuccess: ({ data }) => {
        toast.success("Screenshot successfully generated. Please save the tool to update.")
        form.setValue("screenshotUrl", data)
      },
    },
  )

  // Handle status changes from the PublishStatusButton
  const handleStatusChange = (status: ToolStatus, publishedAt: Date | null) => {
    setIsStatusChanging(true)

    // Update form values
    form.setValue("status", status)
    form.setValue("publishedAt", publishedAt)

    // Update tool
    updateToolAction({ id: tool.id, ...form.getValues() })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => updateToolAction({ id: tool.id, ...data }))}
        className={cx("contents", className)}
        noValidate
        {...props}
      >
        <Stack className="justify-between">
          <H3>Edit {tool.name}</H3>

          <ToolPublishActions
            tool={tool}
            isUpdating={isUpdatingTool}
            onStatusChange={handleStatusChange}
          >
            <ToolActions tool={tool} setRowAction={setRowAction} size="md" />
          </ToolPublishActions>

          {tool.status === ToolStatus.Scheduled && tool.publishedAt && (
            <p className="w-full font-medium text-sm text-blue-600 dark:text-blue-400">
              Will be published on {formatDateTime(tool.publishedAt)}
            </p>
          )}
        </Stack>

        <div className="grid gap-4 sm:grid-cols-2">
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
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <TextArea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="col-span-full items-stretch">
                <Stack className="justify-between">
                  <FormLabel>Content</FormLabel>

                  {field.value && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsPreviewing(prev => !prev)}
                      prefix={isPreviewing ? <PencilIcon /> : <EyeIcon />}
                      className="-my-1"
                    >
                      {isPreviewing ? "Edit" : "Preview"}
                    </Button>
                  )}
                </Stack>

                <FormControl>
                  {field.value && isPreviewing ? (
                    <Markdown
                      code={field.value}
                      className={cx(
                        inputVariants(),
                        "max-w-none min-h-18 bg-card border leading-normal",
                      )}
                    />
                  ) : (
                    <TextArea className="min-h-18" {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {tool.submitterName && (
            <FormField
              control={form.control}
              name="submitterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submitter Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {tool.submitterEmail && (
            <FormField
              control={form.control}
              name="submitterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submitter Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {tool.submitterNote && (
            <FormField
              control={form.control}
              name="submitterNote"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Submitter Note</FormLabel>
                  <FormControl>
                    <TextArea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="faviconUrl"
            render={({ field }) => (
              <FormItem className="items-stretch">
                <Stack className="justify-between">
                  <FormLabel>Favicon URL</FormLabel>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    prefix={<RefreshCwIcon className={cx(isGeneratingFavicon && "animate-spin")} />}
                    className="-my-1"
                    disabled={isGeneratingFavicon}
                    onClick={() => {
                      generateFaviconAction({ url: tool.websiteUrl, path: `tools/${tool.slug}` })
                    }}
                  >
                    {field.value ? "Regenerate" : "Generate"}
                  </Button>
                </Stack>

                <Stack size="sm">
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Favicon"
                      className="h-8 border box-content rounded-md"
                    />
                  )}

                  <FormControl>
                    <Input type="url" className="flex-1" {...field} />
                  </FormControl>
                </Stack>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="screenshotUrl"
            render={({ field }) => (
              <FormItem className="items-stretch">
                <Stack className="justify-between">
                  <FormLabel>Screenshot URL</FormLabel>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    prefix={
                      <RefreshCwIcon className={cx(isGeneratingScreenshot && "animate-spin")} />
                    }
                    className="-my-1"
                    disabled={isGeneratingScreenshot}
                    onClick={() => {
                      generateScreenshotAction({ url: tool.websiteUrl, path: `tools/${tool.slug}` })
                    }}
                  >
                    {field.value ? "Regenerate" : "Generate"}
                  </Button>
                </Stack>

                <Stack size="sm">
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Screenshot"
                      className="h-8 border box-content rounded-md"
                    />
                  )}

                  <FormControl>
                    <Input type="url" className="flex-1" {...field} />
                  </FormControl>
                </Stack>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Categories</FormLabel>
                <RelationSelector
                  promise={categories}
                  selectedIds={field.value ?? []}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem direction="row">
                <FormControl>
                  <Switch onCheckedChange={field.onChange} checked={field.value} />
                </FormControl>
                <FormLabel>Feature this tool</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
