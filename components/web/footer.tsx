"use client"

import { formatNumber } from "@curiousleaf/utils"
import { AtSignIcon, RssIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { H5, H6 } from "~/components/common/heading"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { Stack } from "~/components/common/stack"
import { Tooltip, TooltipProvider } from "~/components/common/tooltip"
import { ExternalLink } from "~/components/web/external-link"
import { NewsletterForm } from "~/components/web/newsletter-form"
import { NavLink } from "~/components/web/ui/nav-link"
import { config } from "~/config"
import { cx } from "~/utils/cva"

type FooterProps = HTMLAttributes<HTMLElement> & {
  hideNewsletter?: boolean
}

export const Footer = ({ children, className, hideNewsletter, ...props }: FooterProps) => {
  return (
    <footer className="flex flex-col gap-y-8 mt-auto pt-8 border-t border-foreground/10 md:pt-10 lg:pt-12">
      <div
        className={cx(
          "grid grid-cols-3 gap-y-8 gap-x-4 md:gap-x-6 md:grid-cols-[repeat(16,minmax(0,1fr))]",
          className,
        )}
        {...props}
      >
        <Stack
          direction="column"
          className="flex flex-col items-start gap-4 col-span-full md:col-span-6"
        >
          <Stack size="lg" direction="column" className="min-w-0 max-w-64">
            <H5 as="strong" className="px-0.5 font-medium">
              Subscribe to our newsletter
            </H5>

            <p className="-mt-2 px-0.5 text-sm text-muted-foreground first:mt-0">
              Join {formatNumber(5000, "standard")}+ other members and get updates on new directory
              websites.
            </p>

            <NewsletterForm medium="footer_form" />
          </Stack>

          <Stack className="text-sm/normal">
            <TooltipProvider delayDuration={500}>
              <Tooltip tooltip="RSS Feed">
                <NavLink
                  href={config.links.feed}
                  target="_blank"
                  rel="nofollow noreferrer"
                  aria-label="RSS Feed"
                >
                  <RssIcon className="size-[1.44em]" />
                </NavLink>
              </Tooltip>

              <Tooltip tooltip="Contact us">
                <NavLink
                  href={`mailto:${config.site.email}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                  aria-label="Contact us"
                >
                  <AtSignIcon className="size-[1.44em] stroke-[1.25]" />
                </NavLink>
              </Tooltip>

              <Tooltip tooltip="View source code">
                <NavLink href={config.links.github} target="_blank" rel="nofollow noreferrer">
                  <BrandGitHubIcon className="size-[1.44em] stroke-[1.25]" />
                </NavLink>
              </Tooltip>
            </TooltipProvider>
          </Stack>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3 md:col-start-8">
          <H6 as="strong">Browse:</H6>

          <NavLink href="/">Tools</NavLink>
          <NavLink href="/categories">Categories</NavLink>
          <NavLink href="/tags">Tags</NavLink>
          <NavLink href="/blog">Blog</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3">
          <H6 as="strong">Quick Links:</H6>

          <NavLink href="/submit">Submit</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/advertise">Advertise</NavLink>
        </Stack>
      </div>

      <div className="flex flex-row flex-wrap items-end justify-between gap-x-4 gap-y-2 w-full text-sm text-muted-foreground">
        <p>
          Made with{" "}
          <ExternalLink
            href={config.links.madeWith}
            className="font-medium text-foreground hover:text-secondary-foreground"
            doFollow
          >
            Dirstarter
          </ExternalLink>{" "}
          by{" "}
          <ExternalLink
            href={config.links.author}
            className="font-medium text-foreground hover:text-secondary-foreground"
            doFollow
          >
            Piotr Kulpinski
          </ExternalLink>
        </p>
      </div>

      {children}
    </footer>
  )
}
