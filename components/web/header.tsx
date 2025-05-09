"use client"

import {
  CalendarDaysIcon,
  ChevronDownIcon,
  GalleryHorizontalEndIcon,
  SearchIcon,
  TagIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { type ComponentProps, useEffect, useState } from "react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Container } from "~/components/web/ui/container"
import { Hamburger } from "~/components/web/ui/hamburger"
import { Logo } from "~/components/web/ui/logo"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { useSearch } from "~/contexts/search-context"
import { cx } from "~/utils/cva"

export const Header = ({ children, className, ...props }: ComponentProps<typeof Container>) => {
  const pathname = usePathname()
  const search = useSearch()
  const [isNavOpen, setNavOpen] = useState(false)

  // Close the mobile navigation when the user presses the "Escape" key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  return (
    <Container
      className={cx(
        "group/menu sticky top-(--header-top) inset-x-0 z-[49] duration-300",
        "max-lg:data-[state=open]:bg-background/90",
        className,
      )}
      id="header"
      role="banner"
      data-state={isNavOpen ? "open" : "close"}
      {...props}
    >
      <div className="absolute top-0 inset-x-0 h-[calc(var(--header-top)+var(--header-height)+2rem)] pointer-events-none bg-linear-to-b from-background via-background to-transparent lg:h-[calc(var(--header-top)+var(--header-height)+3rem)]" />

      <div className="relative flex items-center py-3.5 gap-4 text-sm h-(--header-height) isolate duration-300 md:gap-6 lg:gap-8">
        <Stack size="sm" wrap={false}>
          <button
            type="button"
            onClick={() => setNavOpen(!isNavOpen)}
            className="block -m-1 -ml-1.5 md:hidden"
          >
            <Hamburger className="size-7" />
          </button>

          <Logo />
        </Stack>

        <nav className="flex flex-wrap gap-4 max-md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className={cx(navLinkVariants({ className: "gap-1" }))}>
              Browse{" "}
              <ChevronDownIcon className="group-data-[state=open]:-rotate-180 duration-200" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <NavLink href="/?sort=publishedAt.desc">
                  <CalendarDaysIcon className="shrink-0 size-4 opacity-75" /> Latest tools
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink href="/categories">
                  <GalleryHorizontalEndIcon className="shrink-0 size-4 opacity-75" /> Categories
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink href="/tags">
                  <TagIcon className="shrink-0 size-4 opacity-75" /> Tags
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NavLink href="/advertise">Advertise</NavLink>
          <NavLink href="/about">About Us</NavLink>
        </nav>

        <Stack size="sm" wrap={false} className="flex-1 justify-end">
          <Button size="sm" variant="ghost" className="p-1" onClick={search.open}>
            <SearchIcon className="size-4" />
          </Button>

          <Button size="sm" variant="secondary" asChild>
            <Link href="/submit">Submit</Link>
          </Button>

          {children}
        </Stack>
      </div>

      <nav
        className={cx(
          "absolute top-full inset-x-0 h-[calc(100dvh-var(--header-top)-var(--header-height))] -mt-px py-4 px-6 grid grid-cols-2 place-items-start place-content-start gap-x-4 gap-y-6 bg-background/90 backdrop-blur-lg transition-opacity md:hidden",
          isNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <NavLink href="/?sort=publishedAt.desc" className="text-base">
          Latest
        </NavLink>
        <NavLink href="/categories" className="text-base">
          Categories
        </NavLink>
        <NavLink href="/tags" className="text-base">
          Tags
        </NavLink>
        <NavLink href="/submit" className="text-base">
          Submit
        </NavLink>
        <NavLink href="/advertise" className="text-base">
          Advertise
        </NavLink>
        <NavLink href="/about" className="text-base">
          About
        </NavLink>
      </nav>
    </Container>
  )
}
