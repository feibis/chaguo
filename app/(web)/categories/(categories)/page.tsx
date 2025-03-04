import type { Metadata } from "next"
import { Suspense } from "react"
import { CategoryListSkeleton } from "~/components/web/categories/category-list"
import { CategoryQuery } from "~/components/web/categories/category-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Browse Categories",
  openGraph: { ...metadataConfig.openGraph, url: "/categories" },
  alternates: { ...metadataConfig.alternates, canonical: "/categories" },
}

export default function Categories() {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/categories",
            name: "Categories",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
      </Intro>

      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryQuery />
      </Suspense>
    </>
  )
}
