import { customSessionClient, magicLinkClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import type { auth } from "~/lib/auth"
import { env } from "~/env"

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: `${env.NEXT_PUBLIC_SITE_URL}/api/auth`,
  plugins: [customSessionClient<typeof auth>(), magicLinkClient()],
})
