import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs"
import { ToolListing } from "~/components/web/tools/tool-listing"
import { findCategories } from "~/server/web/categories/queries"
import { filterParamsCache } from "~/server/web/shared/schema"
import { searchTools } from "~/server/web/tools/queries"

type ToolQueryProps = {
  searchParams: Promise<SearchParams>
  where?: Prisma.ToolWhereInput
  placeholder?: string
}

const ToolQuery = async ({ searchParams, where, placeholder }: ToolQueryProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)

  const [{ tools, totalCount }, categories] = await Promise.all([
    searchTools(parsedParams, where),
    findCategories({}),
  ])

  return (
    <ToolListing
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      categories={where?.categories ? undefined : categories}
      placeholder={placeholder}
    />
  )
}

export { ToolQuery }
