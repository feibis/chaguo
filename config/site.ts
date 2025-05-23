import { getUrlHostname } from "@curiousleaf/utils"
import { env } from "~/env"

export const siteConfig = {
  name: "Chaguo",
  tagline: "Kenya online shops directory",
  description:
    "Chaguo is a directory of online shops in Kenya. Find the best online shops to buy from.",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,
  domain: getUrlHostname(env.NEXT_PUBLIC_SITE_URL),
}
