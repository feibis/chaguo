import Script from "next/script"
import { type PropsWithChildren, Suspense } from "react"
import Providers from "~/app/(web)/providers"
import { AdBanner } from "~/components/web/ads/ad-banner"
import { Bottom } from "~/components/web/bottom"
import { Footer } from "~/components/web/footer"
import { Header } from "~/components/web/header"
import { Container } from "~/components/web/ui/container"
import { UserMenu, UserMenuSkeleton } from "~/components/web/user-menu"
import { config } from "~/config"
import { env } from "~/env"

export default function RootLayout({ children }: PropsWithChildren) {
  const url = config.site.url

  return (
    <Providers>
      <div className="flex flex-col min-h-dvh">
        <Suspense>
          <AdBanner />
        </Suspense>

        <Header>
          <Suspense fallback={<UserMenuSkeleton />}>
            <UserMenu />
          </Suspense>
        </Header>

        <Container asChild>
          <main className="flex flex-col grow py-8 gap-8 md:gap-10 md:py-10 lg:gap-12 lg:py-12">
            {children}

            <Footer />
          </main>
        </Container>
      </div>

      <Bottom />

      {/* Plausible */}
      <Script
        defer
        data-domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        src={`${env.NEXT_PUBLIC_PLAUSIBLE_URL}/js/script.js`}
      />
    </Providers>
  )
}
