import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Link } from "~/components/common/link"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Check your inbox",
  description: `Check your inbox to sign in to ${config.site.name}.`,
  openGraph: { ...metadataConfig.openGraph, url: "/check-inbox" },
  alternates: { ...metadataConfig.alternates, canonical: "/check-inbox" },
}

export default async function VerifyPage({ searchParams }: PageProps) {
  const { email } = await searchParams

  return (
    <>
      <Intro>
        <IntroTitle size="h3">{`${metadata.title}`}</IntroTitle>
        <IntroDescription className="md:text-sm">
          We've sent you a magic link to <strong className="text-foreground">{email}</strong>.
          Please click the link to confirm your address.
        </IntroDescription>
      </Intro>

      <p className="text-xs text-muted-foreground/75">
        No email in your inbox? Check your spam folder or{" "}
        <Link
          href="/auth/login"
          className="text-muted-foreground font-medium hover:text-foreground"
        >
          try a different email address
        </Link>
        .
      </p>
    </>
  )
}
