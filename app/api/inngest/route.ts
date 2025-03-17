import { serve } from "inngest/next"
import { publishTools } from "~/functions/cron.publish-tools"
import { toolExpedited } from "~/functions/tool-expedited"
import { toolFeatured } from "~/functions/tool-featured"
import { toolScheduled } from "~/functions/tool-scheduled"
import { toolSubmitted } from "~/functions/tool-submitted"
import { inngest } from "~/services/inngest"

export const maxDuration = 60

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [publishTools, toolScheduled, toolSubmitted, toolExpedited, toolFeatured],
})
