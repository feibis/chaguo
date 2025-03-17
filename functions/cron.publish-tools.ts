import { ToolStatus } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { config } from "~/config"
import EmailToolPublished from "~/emails/tool-published"
import { sendEmails } from "~/lib/email"
import { inngest } from "~/services/inngest"

export const publishTools = inngest.createFunction(
  { id: "publish-tools" },
  { cron: "TZ=America/New_York 5 * * * *" }, // Every hour at minute 5
  async ({ step, db, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return await db.tool.findMany({
        where: {
          status: ToolStatus.Scheduled,
          publishedAt: { lte: new Date() },
        },
      })
    })

    if (tools.length) {
      logger.info(`Publishing ${tools.length} tools`, { tools })

      for (const tool of tools) {
        // Update tool status
        await step.run(`update-tool-status-${tool.slug}`, async () => {
          const updatedTool = await db.tool.update({
            where: { id: tool.id },
            data: { status: ToolStatus.Published },
          })

          // Revalidate cache
          revalidateTag(`tool-${tool.slug}`)

          return updatedTool
        })

        // Revalidate cache
        await step.run("revalidate-cache", async () => {
          revalidateTag("tools")
          revalidateTag("schedule")
        })

        // Send email
        await step.run(`send-email-${tool.slug}`, async () => {
          if (!tool.submitterEmail) return

          const to = tool.submitterEmail
          const subject = `${tool.name} has been published on ${config.site.name} 🎉`

          return await sendEmails({
            to,
            subject,
            react: EmailToolPublished({ tool, to, subject }),
          })
        })
      }
    }

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })
  },
)
