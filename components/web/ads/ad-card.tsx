import type { AdType } from "@prisma/client"
import { ArrowUpRightIcon } from "lucide-react"
import { Slot } from "radix-ui"
import type { ComponentProps } from "react"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import {
  Card,
  CardBadges,
  CardDescription,
  CardHeader,
  type CardProps,
} from "~/components/common/card"
import { H4 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { ExternalLink } from "~/components/web/external-link"
import { Favicon, FaviconImage } from "~/components/web/ui/favicon"
import { LogoSymbol } from "~/components/web/ui/logo-symbol"
import { config } from "~/config"
import { findAd } from "~/server/web/ads/queries"
import { cx } from "~/utils/cva"

type AdCardProps = CardProps & {
  rel?: string
  type: AdType
}

const AdCard = async ({ className, type, ...props }: AdCardProps) => {
  if (!config.ads.enabled) {
    return null
  }

  const ad = (await findAd({ where: { type } })) ?? config.ads.defaultAd
  const isDefault = !ad.websiteUrl.startsWith("http")

  return (
    <Card className={cx("group/button", className)} asChild {...props}>
      <ExternalLink
        href={ad.websiteUrl}
        target={isDefault ? "_self" : undefined}
        eventName="click_ad"
        eventProps={{ url: ad.websiteUrl, type: ad.type }}
      >
        {!isDefault && (
          <CardBadges>
            <Badge variant="outline">Ad</Badge>
          </CardBadges>
        )}

        <CardHeader wrap={false}>
          <Favicon src={ad.faviconUrl} title={ad.name} />

          <H4 as="strong" className="truncate">
            {ad.name}
          </H4>
        </CardHeader>

        <CardDescription className="mb-auto line-clamp-4">{ad.description}</CardDescription>

        <Button size="md" className="pointer-events-none" suffix={<ArrowUpRightIcon />} asChild>
          <span>{isDefault ? "Advertise" : `Visit ${ad.name}`}</span>
        </Button>

        <div className="absolute inset-0 overflow-clip pointer-events-none">
          <Slot.Root className="absolute -bottom-2/5 -right-1/4 -z-10 size-60 opacity-3.5 rotate-12 transition group-hover/button:rotate-17">
            {isDefault ? <LogoSymbol /> : <FaviconImage src={ad.faviconUrl} title={ad.name} />}
          </Slot.Root>
        </div>
      </ExternalLink>
    </Card>
  )
}

const AdCardSkeleton = ({ className }: ComponentProps<typeof Card>) => {
  if (!config.ads.enabled) {
    return null
  }

  return (
    <Card hover={false} className={cx("items-stretch select-none", className)}>
      <CardHeader>
        <Favicon src="/favicon.png" className="animate-pulse opacity-25 grayscale" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5 mb-auto">
        <Skeleton className="h-5 w-full">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-2/3">&nbsp;</Skeleton>
      </CardDescription>

      <Button size="md" className="pointer-events-none opacity-10 text-transparent" asChild>
        <span>&nbsp;</span>
      </Button>
    </Card>
  )
}

export { AdCard, AdCardSkeleton }
