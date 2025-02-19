"use server"

import { createServerAction } from "zsa"
import { findCategories } from "~/server/web/categories/queries"
import type { FilterOption, FilterType } from "~/types/search"

export const findFilterOptions = createServerAction().handler(
  async (): Promise<Record<FilterType, FilterOption[]>> => {
    const [category] = await Promise.all([
      findCategories({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
    ])

    return {
      category,
    }
  },
)
