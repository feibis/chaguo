import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"

export const toolsFilterParamsSchema = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(35),
  category: parseAsString.withDefault(""),
}

export const toolsFilterParamsCache = createSearchParamsCache(toolsFilterParamsSchema)
export type ToolsFiltersSchema = Awaited<ReturnType<typeof toolsFilterParamsCache.parse>>
