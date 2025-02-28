import { LoaderIcon } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { Suspense } from "react"
import { LoginButton } from "~/app/(web)/auth/login/login-button"
import { LoginForm } from "~/app/(web)/auth/login/login-form"
import { Stack } from "~/components/common/stack"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import googleIcon from "~/public/google.svg"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Get access to the dashboard and manage your submitted tools.",
  openGraph: { ...metadataConfig.openGraph, url: "/auth/login" },
  alternates: { ...metadataConfig.alternates, canonical: "/auth/login" },
}

export default function LoginPage() {
  return (
    <>
      <Intro>
        <IntroTitle size="h3">{`${metadata.title}`}</IntroTitle>
        <IntroDescription className="md:text-sm">{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<LoaderIcon className="animate-spin mx-auto" />}>
        <Stack direction="column" className="items-stretch w-full">
          <LoginForm />

          <div className="flex items-center justify-center gap-3 my-2 text-sm text-muted-foreground before:flex-1 before:border-t after:flex-1 after:border-t">
            or
          </div>

          <LoginButton provider="google" suffix={<Image src={googleIcon} alt="Google" />} />
        </Stack>
      </Suspense>
    </>
  )
}
