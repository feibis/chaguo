"use client"

import { useMediaQuery } from "@mantine/hooks"
import { cx } from "cva"
import {
  DockIcon,
  GalleryHorizontalEndIcon,
  GemIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Nav } from "~/components/admin/nav"
import { Kbd } from "~/components/common/kbd"
import { siteConfig } from "~/config/site"
import { signOut } from "~/lib/auth-client"

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

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

  const handleQuickMenu = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
      }),
    )
  }

  return (
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

        undefined, // Separator

        {
          title: "Quick Menu",
          href: "#",
          onClick: handleQuickMenu,
          prefix: <DockIcon />,
          suffix: (
            <Kbd meta className="size-auto">
              K
            </Kbd>
          ),
        },
        {
          title: "Visit Site",
          href: siteConfig.url,
          prefix: <GlobeIcon />,
        },
        {
          title: "Sign Out",
          href: "#",
          onClick: handleSignOut,
          prefix: <LogOutIcon />,
        },
      ]}
    />
  )
}
