import { Input } from "~/components/common/input"
import { Pagination } from "~/components/web/pagination"
import { ToolList, type ToolListProps } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolSearch, type ToolSearchProps } from "~/components/web/tools/tool-search"
import { FiltersProvider } from "~/contexts/filter-context"

type ToolListingProps = ToolListProps &
  ToolSearchProps & {
    perPage: number
    totalCount: number
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
