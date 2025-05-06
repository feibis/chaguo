import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"
import { config } from "~/config"

export const toolsFilterParamsSchema = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(config.ads.enabled ? 5 : 6),
  category: parseAsString.withDefault(""),
}

export const toolsFilterParamsCache = createSearchParamsCache(toolsFilterParamsSchema)
export type ToolsFiltersSchema = Awaited<ReturnType<typeof toolsFilterParamsCache.parse>>
