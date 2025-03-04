import type { Metadata } from "next"
import { Button } from "~/components/common/button"
import { AdsPicker } from "~/components/web/ads-picker"
import { ExternalLink } from "~/components/web/external-link"
import { Stats } from "~/components/web/stats"
import { Testimonial } from "~/components/web/testimonial"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { findAds } from "~/server/web/ads/queries"

export const metadata: Metadata = {
  title: "Advertise",
  description: `Promote your business or software on ${config.site.name} and reach a wide audience of software enthusiasts.`,
  openGraph: { ...metadataConfig.openGraph, url: "/advertise" },
  alternates: { ...metadataConfig.alternates, canonical: "/advertise" },
}

export default async function AdvertisePage() {
  const ads = await findAds({})

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <AdsPicker ads={ads} className="w-full max-w-2xl mx-auto" />

      <Testimonial
        quote="After advertising on this platform, we saw a 38% increase in qualified leads and 2.4x ROI within the first month. The targeted audience was exactly what our business needed. Highly recommended!"
        author={{
          name: "Piotr Kulpinski",
          image: "/authors/piotrkulpinski.webp",
          title: "Founder of Dirstarter",
        }}
      />

      <Stats className="my-4" />

      <hr />

      <Intro alignment="center" className="md:my-4 lg:my-8">
        <IntroTitle size="h2" as="h3">
          Need a custom partnership?
        </IntroTitle>

        <IntroDescription className="max-w-lg">
          Tell us more about your company and we will get back to you as soon as possible.
        </IntroDescription>

        <Button className="mt-4 min-w-40" asChild>
          <ExternalLink href={`mailto:${config.site.email}`}>Contact us</ExternalLink>
        </Button>
      </Intro>
    </>
  )
}
