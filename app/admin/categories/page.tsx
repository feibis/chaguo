import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { CategoriesTable } from "~/app/admin/categories/_components/categories-table"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findCategories } from "~/server/admin/categories/queries"
import { categoriesTableParamsCache } from "~/server/admin/categories/schema"

type CategoriesPageProps = {
  searchParams: Promise<SearchParams>
}

const CategoriesPage = async ({ searchParams }: CategoriesPageProps) => {
  const search = categoriesTableParamsCache.parse(await searchParams)
  const categoriesPromise = findCategories(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Categories" />}>
      <CategoriesTable categoriesPromise={categoriesPromise} />
    </Suspense>
  )
}

export default withAdminPage(CategoriesPage)
