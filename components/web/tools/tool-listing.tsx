import { Input } from "~/components/common/input"
import { Pagination } from "~/components/web/pagination"
import { ToolList, type ToolListProps } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolSearch } from "~/components/web/tools/tool-search"
import { FiltersProvider } from "~/contexts/filter-context"
import type { CategoryMany } from "~/server/web/categories/payloads"

type ToolListingProps = ToolListProps & {
  perPage: number
  totalCount: number
  placeholder?: string
  categories?: CategoryMany[]
}

const ToolListing = ({
  perPage,
  totalCount,
  placeholder,
  categories,
  ...props
}: ToolListingProps) => {
  return (
    <FiltersProvider>
      <div className="flex flex-col gap-5" id="tools">
        <ToolSearch placeholder={placeholder} categories={categories} />
        <ToolList {...props} />
      </div>

      <Pagination pageSize={perPage} totalCount={totalCount} />
    </FiltersProvider>
  )
}

const ToolListingSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  )
}

export { ToolListing, ToolListingSkeleton }
