import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Badge } from "~/components/common/badge"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H4 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { Favicon } from "~/components/web/ui/favicon"
import { VerifiedBadge } from "~/components/web/verified-badge"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany

  /**
   * Disables the view transition.
   */
  isRelated?: boolean
}

const ToolCard = ({ className, tool, isRelated, ...props }: ToolCardProps) => {
  const maxCategories = 2
  const visibleCategories = tool.categories.slice(0, maxCategories)
  const hiddenCount = tool.categories.length - maxCategories

  return (
    <Card asChild {...props}>
      <Link href={`/${tool.slug}`} className="group">
        <CardHeader wrap={false}>
          <Favicon src={tool.faviconUrl} title={tool.name} />

          <H4 as="h3" className="truncate">
            {tool.name}
          </H4>

          {tool.owner && <VerifiedBadge size="md" className="-ml-1.5" />}
        </CardHeader>

        <div className="relative size-full flex flex-col">
          <Stack size="lg" direction="column" className="flex-1 duration-200 group-hover:opacity-0">
            {tool.tagline && <CardDescription className="min-h-10">{tool.tagline}</CardDescription>}

            {!!visibleCategories.length && (
              <Stack className="mt-auto gap-1">
                {visibleCategories.map(category => (
                  <Badge key={category.slug} variant="outline">
                    {category.name}
                  </Badge>
                ))}

                {hiddenCount > 0 && <Badge variant="outline">+{hiddenCount} more</Badge>}
              </Stack>
            )}
          </Stack>

          {tool.description && (
            <div className="absolute inset-0 opacity-0 duration-200 group-hover:opacity-100">
              <CardDescription className="line-clamp-3">{tool.description}</CardDescription>
            </div>
          )}
        </div>
      </Link>
    </Card>
  )
}

const ToolCardSkeleton = () => {
  const insights = [
    { label: "Stars", value: <Skeleton className="h-4 w-16" />, icon: <StarIcon /> },
    { label: "Forks", value: <Skeleton className="h-4 w-14" />, icon: <GitForkIcon /> },
    { label: "Last commit", value: <Skeleton className="h-4 w-20" />, icon: <TimerIcon /> },
  ]

  return (
    <Card hover={false} className="items-stretch select-none">
      <CardHeader>
        <Favicon src="/favicon.png" className="animate-pulse opacity-25 grayscale" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </CardDescription>

      <Stack size="sm" className="mt-auto">
        {[...Array(2)].map((_, index) => (
          <Badge key={index} variant="outline" className="w-12">
            &nbsp;
          </Badge>
        ))}
      </Stack>
    </Card>
  )
}

export { ToolCard, ToolCardSkeleton }
