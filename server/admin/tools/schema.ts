import { type Tool, ToolStatus } from "@prisma/client"
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import { getSortingStateParser } from "~/lib/parsers"

export const toolsTableParamsSchema = {
  name: parseAsString.withDefault(""),
  sort: getSortingStateParser<Tool>().withDefault([{ id: "createdAt", desc: true }]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  status: parseAsArrayOf(z.nativeEnum(ToolStatus)).withDefault([]),
}

export const toolsTableParamsCache = createSearchParamsCache(toolsTableParamsSchema)
export type ToolsTableSchema = Awaited<ReturnType<typeof toolsTableParamsCache.parse>>

export const toolSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  websiteUrl: z.string().min(1, "Website is required").url(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  faviconUrl: z.string().optional(),
  screenshotUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  submitterName: z.string().optional(),
  submitterEmail: z.string().optional(),
  submitterNote: z.string().optional(),
  publishedAt: z.coerce.date().nullish(),
  status: z.nativeEnum(ToolStatus).default("Draft"),
  categories: z.array(z.string()).optional(),
  notifySubmitter: z.boolean().default(true),
})

export type ToolSchema = z.infer<typeof toolSchema>
