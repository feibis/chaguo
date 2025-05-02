"use client"

import { useHotkeys, useMediaQuery } from "@mantine/hooks"
import { cx } from "cva"
import {
  DockIcon,
  ExternalLinkIcon,
  GalleryHorizontalEndIcon,
  GemIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  TagIcon,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { CommandMenu } from "~/components/admin/command-menu"
import { Nav } from "~/components/admin/nav"
import { Button } from "~/components/common/button"
import { Kbd } from "~/components/common/kbd"
import { Tooltip } from "~/components/common/tooltip"
import { siteConfig } from "~/config/site"
import { signOut } from "~/lib/auth-client"

export const Sidebar = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  useHotkeys(
    [
      ["mod+K", () => setIsCommandOpen(prev => !prev)],
      ["mod+1", () => handleRedirect("/admin/tools/new")],
      ["mod+2", () => handleRedirect("/admin/categories/new")],
      ["mod+3", () => handleRedirect("/admin/tags/new")],
    ],
    [],
    true,
  )

  const handleRedirect = (path: string) => {
    router.push(path)
    setIsCommandOpen(false)
  }

  const handleOpenSite = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    window.open(siteConfig.url, "_blank")
  }

  const handleSignOut = async () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You've been signed out successfully")
          router.push("/")
        },
      },
    })
  }

  return (
    <>
      <Nav
        isCollapsed={!!isMobile}
        className={cx("sticky top-0 h-dvh z-40 border-r", isMobile ? "w-12" : "w-48")}
        links={[
          {
            title: "Dashboard",
            href: "/admin",
            prefix: <LayoutDashboardIcon />,
          },

          undefined, // Separator

          {
            title: "Tools",
            href: "/admin/tools",
            prefix: <GemIcon />,
          },
          {
            title: "Categories",
            href: "/admin/categories",
            prefix: <GalleryHorizontalEndIcon />,
          },
          {
            title: "Tags",
            href: "/admin/tags",
            prefix: <TagIcon />,
          },
          {
            title: "Users",
            href: "/admin/users",
            prefix: <UsersIcon />,
          },
          {
            title: "Reports",
            href: "/admin/reports",
            prefix: <TriangleAlertIcon />,
          },

          undefined, // Separator

          {
            title: "Visit Site",
            href: "/admin/site",
            prefix: <GlobeIcon />,
            suffix: (
              <Tooltip tooltip="Open site in new tab">
                <Button
                  variant="secondary"
                  onClick={handleOpenSite}
                  className="-my-0.5 px-1 py-[0.2em] text-xs/tight rounded-sm"
                >
                  <ExternalLinkIcon className="size-3" />
                </Button>
              </Tooltip>
            ),
          },
          {
            title: "Quick Menu",
            href: "#",
            onClick: () => setIsCommandOpen(true),
            prefix: <DockIcon />,
            suffix: <Kbd meta>K</Kbd>,
          },
          {
            title: "Logout",
            href: "#",
            onClick: handleSignOut,
            prefix: <LogOutIcon />,
          },
        ]}
      />

      <CommandMenu isOpen={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  )
}
