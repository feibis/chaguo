import { siteConfig } from "~/config/site"

export default function SitePage() {
  return (
    <iframe
      src={siteConfig.url}
      title="Site Preview"
      className="-m-4 size-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+4rem)]"
    />
  )
}
