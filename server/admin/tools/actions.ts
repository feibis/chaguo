"use server"

import { slugify } from "@curiousleaf/utils"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { isProd } from "~/env"
import { removeS3Directories } from "~/lib/media"
import { adminProcedure } from "~/lib/safe-actions"
import { toolSchema } from "~/server/admin/tools/schemas"
import { db } from "~/services/db"
import { inngest } from "~/services/inngest"

export const createTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input: { categories, ...input } }) => {
    const tool = await db.tool.create({
      data: {
        ...input,
        slug: input.slug || slugify(input.name),
        categories: { connect: categories?.map(id => ({ id })) },
      },
    })

    // Send an event to the Inngest pipeline
    if (tool.publishedAt) {
      isProd && (await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } }))
    }

    return tool
  })

export const updateTool = adminProcedure
  .createServerAction()
  .input(toolSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, categories, ...input } }) => {
    const tool = await db.tool.update({
      where: { id },
      data: {
        ...input,
        categories: { set: categories?.map(id => ({ id })) },
      },
    })

    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)

    return tool
  })

export const deleteTools = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await db.tool.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/tools")
    revalidateTag("tools")

    // Remove the tool images from S3 asynchronously
    after(async () => {
      await removeS3Directories(tools.map(tool => `tools/${tool.slug}`))
    })

    return true
  })
