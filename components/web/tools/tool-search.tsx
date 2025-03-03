"use client"

import { LoaderIcon, SearchIcon } from "lucide-react"
import { Input } from "~/components/common/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { useFilters } from "~/contexts/filter-context"
import type { CategoryMany } from "~/server/web/categories/payloads"

export type ToolSearchProps = {
  categories?: CategoryMany[]
  placeholder?: string
}

export const ToolSearch = ({ categories, placeholder }: ToolSearchProps) => {
  const { filters, isLoading, updateFilters } = useFilters()

  const sortOptions = [
    { value: "publishedAt.desc", label: "Latest" },
    { value: "name.asc", label: "Name (A to Z)" },
    { value: "name.desc", label: "Name (Z to A)" },
  ]

  return (
    <Stack size="lg" direction="column" className="w-full">
      <Stack className="w-full">
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

        {!!categories?.length && (
          <Select value={filters.category} onValueChange={category => updateFilters({ category })}>
            <SelectTrigger size="lg" className="w-auto min-w-40 max-sm:flex-1">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>

            <SelectContent align="end">
              {categories.map(category => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={filters.sort} onValueChange={value => updateFilters({ sort: value })}>
          <SelectTrigger size="lg" className="w-auto min-w-36 max-sm:flex-1">
            <SelectValue placeholder="Order by" />
          </SelectTrigger>

          <SelectContent align="end">
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Stack>
    </Stack>
  )
}
