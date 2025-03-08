import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ToolsTable } from "~/app/admin/tools/_components/tools-table"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findTools } from "~/server/admin/tools/queries"
import { adminToolsSearchParams } from "~/server/admin/tools/schemas"

type ToolsPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function ToolsPage(props: ToolsPageProps) {
  const searchParams = await props.searchParams
  const search = adminToolsSearchParams.parse(searchParams)
  const toolsPromise = findTools(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Tools" />}>
      <ToolsTable toolsPromise={toolsPromise} />
    </Suspense>
  )
}
