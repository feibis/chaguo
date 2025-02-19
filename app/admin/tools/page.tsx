import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ToolsTable } from "~/app/admin/tools/_components/tools-table"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import { findTools } from "~/server/admin/tools/queries"
import { searchParamsCache } from "~/server/admin/tools/validations"

type ToolsPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function ToolsPage(props: ToolsPageProps) {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)
  const toolsPromise = findTools(search)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Tools"
          columnCount={5}
          rowCount={15}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["12%", "48%", "15%", "15%", "10%"]}
          shrinkZero
        />
      }
    >
      <ToolsTable toolsPromise={toolsPromise} />
    </Suspense>
  )
}
