"use client"

import { useEffect } from "react"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { env } from "~/env"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Intro>
      <IntroTitle>Something went wrong!</IntroTitle>

      <Prose>
        <p>
          Please try again. If the problem persists, contact support at{" "}
          <Link href={`mailto:${env.NEXT_PUBLIC_SITE_EMAIL}`}>{env.NEXT_PUBLIC_SITE_EMAIL}</Link>.
        </p>
      </Prose>

      <Button className="mt-4" onClick={() => reset()}>
        Try again
      </Button>
    </Intro>
  )
}
