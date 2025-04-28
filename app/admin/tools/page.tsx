import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ToolsTable } from "~/app/admin/tools/_components/tools-table"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findTools } from "~/server/admin/tools/queries"
import { toolsTableParamsCache } from "~/server/admin/tools/schema"

type ToolsPageProps = {
  searchParams: Promise<SearchParams>
}

const ToolsPage = async ({ searchParams }: ToolsPageProps) => {
  const search = toolsTableParamsCache.parse(await searchParams)
  const toolsPromise = findTools(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Tools" />}>
      <ToolsTable toolsPromise={toolsPromise} />
    </Suspense>
  )
}

export default withAdminPage(ToolsPage)
