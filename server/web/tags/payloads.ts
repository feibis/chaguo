import { Prisma, ToolStatus } from "@prisma/client"

export const tagOnePayload = Prisma.validator<Prisma.TagSelect>()({
  name: true,
  slug: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export const tagManyPayload = Prisma.validator<Prisma.TagSelect>()({
  name: true,
  slug: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export type TagOne = Prisma.TagGetPayload<{ select: typeof tagOnePayload }>
export type TagMany = Prisma.TagGetPayload<{ select: typeof tagManyPayload }>
