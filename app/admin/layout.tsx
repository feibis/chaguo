import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { PropsWithChildren } from "react"
import { Shell } from "~/components/admin/shell"
import { auth } from "~/lib/auth"

export const metadata: Metadata = {
  title: "Admin Panel",
}

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user.role !== "admin") {
    redirect("/auth/login")
  }

  return <Shell>{children}</Shell>
}
