import { type Prisma, ToolStatus } from "@prisma/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import { tagManyPayload, tagOnePayload } from "~/server/web/tags/payloads"
import type { TagsSearchParams } from "~/server/web/tags/schema"
import { db } from "~/services/db"

export const searchTags = async (search: TagsSearchParams, where?: Prisma.TagWhereInput) => {
  "use cache"

  cacheTag("tags")
  cacheLife("max")

  const { page, perPage } = search
  const skip = (page - 1) * perPage
  const take = perPage

  const [tags, totalCount] = await db.$transaction([
    db.tag.findMany({
      orderBy: { name: "asc" },
      where: { tools: { some: { status: ToolStatus.Published } }, ...where },
      select: tagManyPayload,
      take,
      skip,
    }),

    db.tag.count({
      where: { ...where },
    }),
  ])

  const pageCount = Math.ceil(totalCount / perPage)
  return { tags, totalCount, pageCount }
}

export const findTagSlugs = async ({ where, orderBy, ...args }: Prisma.TagFindManyArgs) => {
  "use cache"

  cacheTag("tags")
  cacheLife("max")

  return db.tag.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findTag = async ({ ...args }: Prisma.TagFindFirstArgs = {}) => {
  "use cache"

  cacheTag("tag", `tag-${args.where?.slug}`)
  cacheLife("max")

  return db.tag.findFirst({
    ...args,
    select: tagOnePayload,
  })
}
