import { ToolStatus } from "@prisma/client"
import { formatDate } from "date-fns"
import { BadgeCheckIcon, CalendarIcon, ChevronDownIcon } from "lucide-react"
import { type ComponentProps, useState } from "react"
import { Button, type ButtonProps } from "~/components/common/button"
import { Calendar } from "~/components/common/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/common/dialog"
import { H5, H6 } from "~/components/common/heading"
import { Input } from "~/components/common/input"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/common/popover"
import { RadioGroup, RadioGroupItem } from "~/components/common/radio-group"
import { Stack } from "~/components/common/stack"
import type { findToolBySlug } from "~/server/admin/tools/queries"

type Tool = NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>

type ToolPublishActionsProps = ComponentProps<typeof Stack> & {
  tool: Tool
  isUpdating: boolean
  onStatusChange: (status: ToolStatus, publishedAt: Date | null) => void
}

type PopoverOption = {
  status: ToolStatus
  title: string
  description?: string
  button?: ButtonProps
}

type ActionConfig = Omit<ButtonProps, "popover"> & {
  popover?: {
    title: string
    options: PopoverOption[]
  }
}

type ToolActionsMap = Record<ToolStatus, ActionConfig[]>

export const ToolPublishActions = ({
  tool,
  onStatusChange,
  isUpdating,
  size = "sm",
  children,
  ...props
}: ToolPublishActionsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [status, setStatus] = useState<ToolStatus>(tool.status)
  const [selectedDate, setSelectedDate] = useState<string>(
    tool.publishedAt
      ? formatDate(tool.publishedAt, "yyyy-MM-dd")
      : formatDate(new Date(), "yyyy-MM-dd"),
  )
  const [selectedTime, setSelectedTime] = useState<string>(
    tool.publishedAt ? formatDate(tool.publishedAt, "HH:mm") : formatDate(new Date(), "HH:mm"),
  )

  const handlePublished = () => {
    onStatusChange(ToolStatus.Published, new Date())
    setStatus(ToolStatus.Published)
    setIsOpen(false)
  }

  const handleScheduled = () => {
    const scheduledDate = new Date(`${selectedDate}T${selectedTime}`)
    onStatusChange(ToolStatus.Scheduled, scheduledDate)
    setStatus(ToolStatus.Scheduled)
    setIsOpen(false)
  }

  const handleDraft = () => {
    onStatusChange(ToolStatus.Draft, null)
    setStatus(ToolStatus.Draft)
    setIsOpen(false)
  }

  const toolActions: ToolActionsMap = {
    [ToolStatus.Draft]: [
      {
        type: "submit",
        children: "Save Draft",
        variant: "primary",
      },
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
    ],
    [ToolStatus.Scheduled]: [
      {
        type: "button",
        children: "Scheduled",
        variant: "secondary",
        prefix: <CalendarIcon />,
        popover: {
          title: "Update tool status",
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
          options: [
            {
              status: ToolStatus.Draft,
              title: "Unpublished",
              description: "Revert this tool to a private draft",
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
    <Stack size={size} {...props}>
      {children}

      {toolActions[tool.status].map(({ popover, ...action }) => {
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
                if (!open) setTimeout(() => setStatus(tool.status), 250)
              }}
            >
              <PopoverTrigger asChild>
                <Button size="md" suffix={<ChevronDownIcon />} {...action} />
              </PopoverTrigger>

              <PopoverContent align="end" onOpenAutoFocus={e => e.preventDefault()} asChild>
                <Stack size="lg" direction="column" className="items-stretch gap-5 min-w-80">
                  <H5>{popover.title}</H5>

                  <RadioGroup
                    defaultValue={getCurrentOption(tool.status).status}
                    className="contents"
                    onValueChange={value => setStatus(value as ToolStatus)}
                  >
                    {popover.options.map(option => (
                      <Stack size="sm" className="items-start" key={option.status}>
                        <RadioGroupItem id={option.status} value={option.status} />

                        <Stack size="sm" direction="column" className="grow" asChild>
                          <label htmlFor={option.status}>
                            <H6>{option.title}</H6>

                            <p className="text-sm text-muted-foreground">{option.description}</p>

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

                    {popoverButton && (
                      <Button size="md" isPending={isUpdating} {...popoverButton} />
                    )}
                  </Stack>
                </Stack>
              </PopoverContent>
            </Popover>
          )
        }

        return <Button key={String(action.children)} size="md" isPending={isUpdating} {...action} />
      })}
    </Stack>
  )
}
