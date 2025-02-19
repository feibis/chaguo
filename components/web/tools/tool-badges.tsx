import { formatDate } from "@curiousleaf/utils"
import { differenceInDays } from "date-fns"
import { BellPlusIcon, ClockIcon, SparklesIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { Stack } from "~/components/common/stack"
import { Tooltip, TooltipProvider } from "~/components/common/tooltip"
import type { ToolMany } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolBadgesProps = HTMLAttributes<HTMLElement> & {
  tool: ToolMany
}

export const ToolBadges = ({ tool, children, className, ...props }: ToolBadgesProps) => {
  const publishedDiff = tool.publishedAt ? differenceInDays(new Date(), tool.publishedAt) : null
  const isFresh = publishedDiff !== null && publishedDiff <= 30 && publishedDiff >= 0
  const isScheduled = tool.publishedAt !== null && tool.publishedAt > new Date()

  return (
    <TooltipProvider delayDuration={500}>
      <Stack size="sm" className={cx("flex-nowrap justify-end text-sm", className)} {...props}>
        {isFresh && (
          <Tooltip tooltip="Published in the last 30 days">
            <BellPlusIcon className="text-green-500" />
          </Tooltip>
        )}

        {isScheduled && (
          <Tooltip tooltip={`Scheduled for ${formatDate(tool.publishedAt!)}`}>
            <ClockIcon className="text-yellow-500" />
          </Tooltip>
        )}

        {children}
      </Stack>
    </TooltipProvider>
  )
}
