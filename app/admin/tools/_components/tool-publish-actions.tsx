import { formatDateTime } from "@curiousleaf/utils"
import { ToolStatus } from "@prisma/client"
import { formatDate } from "date-fns"
import { BadgeCheckIcon, CalendarIcon } from "lucide-react"
import { type ComponentProps, type ReactNode, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button, type ButtonProps } from "~/components/common/button"
import { Calendar } from "~/components/common/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/common/dialog"
import { H5, H6 } from "~/components/common/heading"
import { Input } from "~/components/common/input"
import { Note } from "~/components/common/note"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/common/popover"
import { RadioGroup, RadioGroupItem } from "~/components/common/radio-group"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { siteConfig } from "~/config/site"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import type { ToolSchema } from "~/server/admin/tools/schemas"

type ToolPublishActionsProps = ComponentProps<typeof Stack> & {
  tool?: NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>
  isPending: boolean
  onFormSubmit: (data: ToolSchema) => void
}

type PopoverOption = {
  status: ToolStatus
  title: ReactNode
  description?: ReactNode
  button?: ButtonProps
}

type ActionConfig = Omit<ButtonProps, "popover"> & {
  popover?: {
    title: ReactNode
    description?: ReactNode
    options: PopoverOption[]
  }
}

export const ToolPublishActions = ({
  tool,
  isPending,
  onFormSubmit,
  children,
  ...props
}: ToolPublishActionsProps) => {
  const { watch, setValue, resetField, getValues } = useFormContext<ToolSchema>()
  const [slug, status, publishedAt] = watch(["slug", "status", "publishedAt"])

  const [isOpen, setIsOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(
    publishedAt ? formatDate(publishedAt, "yyyy-MM-dd") : formatDate(new Date(), "yyyy-MM-dd"),
  )
  const [selectedTime, setSelectedTime] = useState<string>(
    publishedAt ? formatDate(publishedAt, "HH:mm") : formatDate(new Date(), "HH:mm"),
  )

  const handlePublished = () => {
    handleStatusChange(ToolStatus.Published, new Date())
  }

  const handleScheduled = () => {
    handleStatusChange(ToolStatus.Scheduled, new Date(`${selectedDate}T${selectedTime}`))
  }

  const handleDraft = () => {
    handleStatusChange(ToolStatus.Draft, null)
  }

  // Handle status changes from the PublishStatusButton
  const handleStatusChange = (status: ToolStatus, publishedAt: Date | null) => {
    // Update form values
    setValue("status", status)
    setValue("publishedAt", publishedAt)

    // Close the popover
    setIsOpen(false)

    // Submit tool update
    onFormSubmit(getValues())
  }

  const toolActions: Record<ToolStatus, ActionConfig[]> = {
    [ToolStatus.Draft]: [
      {
        type: "button",
        children: "Publish",
        variant: "fancy",
        popover: {
          title: "Ready to publish this tool?",
          options: [
            {
              status: ToolStatus.Published,
              title: "Set it live now",
              description: "Publish this tool immediately",
              button: {
                onClick: handlePublished,
                children: "Publish",
              },
            },
            {
              status: ToolStatus.Scheduled,
              title: "Schedule for later",
              description: "Set automatic future publish date",
              button: {
                onClick: handleScheduled,
                children: "Schedule",
              },
            },
          ],
        },
      },
      {
        type: "submit",
        children: "Save Draft",
        variant: "primary",
      },
    ],

    [ToolStatus.Scheduled]: [
      {
        type: "button",
        children: "Scheduled",
        variant: "secondary",
        prefix: <CalendarIcon />,
        popover: {
          title: "Update tool status",
          description: (
            <>
              Preview:{" "}
              <ExternalLink href={`/${slug}`} className="text-primary underline">
                {siteConfig.url}/{slug}
              </ExternalLink>
              <br />
              Will be published on <strong>{formatDateTime(publishedAt ?? new Date())}</strong>
            </>
          ),
          options: [
            {
              status: ToolStatus.Draft,
              title: "Revert to draft",
              description: "Do not publish",
              button: {
                onClick: handleDraft,
                children: "Unschedule",
              },
            },
            {
              status: ToolStatus.Scheduled,
              title: "Schedule for later",
              description: "Set automatic future publish date",
              button: {
                onClick: handleScheduled,
                children: "Reschedule",
              },
            },
          ],
        },
      },
      {
        type: "submit",
        children: "Update",
        variant: "primary",
      },
    ],

    [ToolStatus.Published]: [
      {
        type: "button",
        children: "Published",
        variant: "secondary",
        prefix: <BadgeCheckIcon />,
        popover: {
          title: "Update tool status",
          description: (
            <>
              View:{" "}
              <ExternalLink href={`/${slug}`} className="text-primary underline">
                {siteConfig.url}/{slug}
              </ExternalLink>
            </>
          ),
          options: [
            {
              status: ToolStatus.Draft,
              title: "Unpublished",
              description: "Revert this tool to a draft",
              button: {
                onClick: handleDraft,
                children: "Unpublish",
              },
            },
            {
              status: ToolStatus.Published,
              title: "Published",
              description: "Keep this tool publicly available",
            },
          ],
        },
      },
      {
        type: "submit",
        children: "Update",
        variant: "primary",
      },
    ],
  }

  return (
    <Stack size="sm" {...props}>
      {children}

      {toolActions[tool?.status ?? ToolStatus.Draft].map(({ popover, ...action }) => {
        if (popover) {
          const getCurrentOption = (status: ToolStatus) => {
            return popover.options.find(o => o.status === status) || popover.options[0]
          }

          const popoverButton = getCurrentOption(status).button

          return (
            <Popover
              key={String(action.children)}
              open={isOpen}
              onOpenChange={open => {
                setIsOpen(open)

                // Reset temporary UI states when popover is closed
                if (!open) setTimeout(() => resetField("status"), 250)
              }}
            >
              <PopoverTrigger asChild>
                <Button size="md" isPending={isPending} {...action} />
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-72"
                onOpenAutoFocus={e => e.preventDefault()}
                asChild
              >
                <Stack size="lg" direction="column" className="items-stretch gap-5 min-w-80">
                  <Stack size="sm" direction="column">
                    <H5>{popover.title}</H5>

                    {popover.description && <Note>{popover.description}</Note>}
                  </Stack>

                  <RadioGroup
                    defaultValue={getCurrentOption(status).status}
                    className="contents"
                    onValueChange={value => setValue("status", value as ToolStatus)}
                  >
                    {popover.options.map(option => (
                      <Stack size="sm" className="items-start" key={option.status}>
                        <RadioGroupItem id={option.status} value={option.status} />

                        <Stack size="sm" direction="column" className="grow" asChild>
                          <label htmlFor={option.status}>
                            <H6>{option.title}</H6>

                            {option.description && <Note>{option.description}</Note>}

                            {option.status === ToolStatus.Scheduled &&
                              status === ToolStatus.Scheduled && (
                                <Stack size="sm" wrap={false} className="mt-2 items-stretch w-full">
                                  <Button
                                    size="md"
                                    variant="secondary"
                                    onClick={() => setIsScheduleOpen(true)}
                                    suffix={<CalendarIcon />}
                                    className="w-full tabular-nums"
                                  >
                                    {selectedDate}
                                  </Button>

                                  <Input
                                    type="time"
                                    value={selectedTime}
                                    onChange={e => setSelectedTime(e.target.value)}
                                    className="w-full tabular-nums"
                                  />

                                  <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                                    <DialogContent className="max-w-sm">
                                      <DialogHeader>
                                        <DialogTitle>Pick a date to publish</DialogTitle>
                                      </DialogHeader>

                                      <Calendar
                                        mode="single"
                                        selected={new Date(selectedDate)}
                                        onSelect={date => {
                                          date && setSelectedDate(formatDate(date, "yyyy-MM-dd"))
                                          setIsScheduleOpen(false)
                                        }}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </Stack>
                              )}
                          </label>
                        </Stack>
                      </Stack>
                    ))}
                  </RadioGroup>

                  <Stack className="justify-between">
                    <Button size="md" variant="secondary" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>

                    {popoverButton && <Button size="md" {...popoverButton} />}
                  </Stack>
                </Stack>
              </PopoverContent>
            </Popover>
          )
        }

        return <Button key={String(action.children)} size="md" isPending={isPending} {...action} />
      })}
    </Stack>
  )
}
