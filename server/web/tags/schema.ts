import { createSearchParamsCache, parseAsInteger } from "nuqs/server"

export const tagsSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(96),
}

export const tagsSearchParamsCache = createSearchParamsCache(tagsSearchParams)
export type TagsSearchParams = Awaited<ReturnType<typeof tagsSearchParamsCache.parse>>
