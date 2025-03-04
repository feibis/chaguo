import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"

export const toolsSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(35),
  category: parseAsString.withDefault(""),
}

export const toolsSearchParamsCache = createSearchParamsCache(toolsSearchParams)
export type ToolsSearchParams = Awaited<ReturnType<typeof toolsSearchParamsCache.parse>>
