import { ClockIcon } from "lucide-react"
import { type ComponentProps, useState } from "react"
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

type ToolScheduleDialogProps = ComponentProps<typeof Dialog> & {
  showTrigger?: boolean
  date: Date
  onDateChange: (date: Date) => void
}

export const ToolScheduleDialog = ({
  onDateChange,
  date,
  showTrigger,
  ...props
}: ToolScheduleDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date)

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button prefix={<ClockIcon />} className="bg-green-600 text-white">
            Schedule
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Pick a date to publish</DialogTitle>
          <DialogDescription>This tool will be published on the date you choose.</DialogDescription>
        </DialogHeader>

        <Calendar autoFocus mode="single" selected={selectedDate} onSelect={setSelectedDate} />

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="md"
            className="min-w-24"
            onClick={() => selectedDate && onDateChange(selectedDate)}
            disabled={!selectedDate}
          >
            Pick date
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
