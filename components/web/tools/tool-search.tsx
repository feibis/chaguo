"use client"

import { LoaderIcon, SearchIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { ToolSort } from "~/components/web/tools/tool-sort"
import { useFilters } from "~/contexts/filter-context"
import { cx } from "~/utils/cva"

export type ToolSearchProps = ComponentProps<typeof Stack> & {
  placeholder?: string
}

export const ToolSearch = ({ className, placeholder, ...props }: ToolSearchProps) => {
  const { filters, isLoading, enableSort, enableFilters, updateFilters } = useFilters()

  return (
    <Stack className={cx("w-full", className)} {...props}>
      <div className="relative grow min-w-0">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
          {isLoading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
        </div>

        <Input
          size="lg"
          value={filters.q || ""}
          onChange={e => updateFilters({ q: e.target.value })}
          placeholder={isLoading ? "Loading..." : placeholder || "Search tools..."}
          className="w-full truncate px-10"
        />
      </div>

      {enableFilters && <ToolFilters />}
      {enableSort && <ToolSort />}
    </Stack>
  )
}
