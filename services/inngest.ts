import { EventSchemas, Inngest, InngestMiddleware } from "inngest"
import { db } from "~/services/db"

type ToolEventData = { slug: string }

type Events = {
  "tool.submitted": { data: ToolEventData }
  "tool.expedited": { data: ToolEventData }
  "tool.featured": { data: ToolEventData }
  "tool.scheduled": { data: ToolEventData }
  "tool.published": { data: ToolEventData }
}

const prismaMiddleware = new InngestMiddleware({
  name: "Prisma Middleware",
  init: () => ({
    onFunctionRun: () => ({
      transformInput: () => ({ ctx: { db } }),
    }),
  }),
})

export const inngest = new Inngest({
  id: "dirstarter",
  schemas: new EventSchemas().fromRecord<Events>(),
  middleware: [prismaMiddleware],
})
