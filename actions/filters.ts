"use server"

import { createServerAction } from "zsa"
import { findCategories } from "~/server/web/categories/queries"

export const findFilterOptions = createServerAction().handler(async () => {
  const filters = await Promise.all([findCategories({})])

  // Map the filters to the expected format
  const [category] = filters.map(r =>
    r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
  )

  return { category } as const
})
