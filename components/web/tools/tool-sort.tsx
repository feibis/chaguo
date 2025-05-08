"use client"

import type { ComponentProps } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { useFilters } from "~/contexts/filter-context"

export const ToolSort = ({ ...props }: ComponentProps<typeof Select>) => {
  const { filters, updateFilters } = useFilters()

  const sortOptions = [
    { value: "publishedAt.desc", label: "Latest" },
    { value: "name.asc", label: "Name (A to Z)" },
    { value: "name.desc", label: "Name (Z to A)" },
  ]

  return (
    <Select value={filters.sort} onValueChange={value => updateFilters({ sort: value })} {...props}>
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
  )
}
