import { allPosts as posts } from "content-collections"
import type { MetadataRoute } from "next"
import { config } from "~/config"
import { findCategorySlugs } from "~/server/web/categories/queries"
import { findTagSlugs } from "~/server/web/tags/queries"
import { findToolSlugs } from "~/server/web/tools/queries"

type Entry = MetadataRoute.Sitemap[number]

const createEntry = (path: string, lastModified: Date, options?: Partial<Entry>): Entry => ({
  url: `${config.site.url}${path}`,
  lastModified,
  changeFrequency: "weekly",
  ...options,
})

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, categories, tags] = await Promise.all([
    findToolSlugs({}),
    findCategorySlugs({}),
    findTagSlugs({}),
  ])

  const pages = ["/about", "/advertise", "/submit"]
  const now = new Date()

  return [
    // Home
    createEntry("", now, { changeFrequency: "daily", priority: 1 }),

    // Static pages
    ...pages.map(p => createEntry(p, now, { changeFrequency: "monthly" })),

    // Posts
    createEntry("/blog", now),
    ...posts.map(p => createEntry(`/blog/${p._meta.path}`, new Date(p.updatedAt ?? p.publishedAt))),

    // Tools
    ...tools.map(t => createEntry(`/${t.slug}`, t.updatedAt)),

    // Categories
    createEntry("/categories", now),
    ...categories.map(c => createEntry(`/categories/${c.slug}`, c.updatedAt)),

    // Tags
    createEntry("/tags", now),
    ...tags.map(t => createEntry(`/tags/${t.slug}`, t.updatedAt)),
  ]
}
