import { ToolStatus } from "@prisma/client"
import type { Jsonify } from "inngest/helpers/jsonify"
import type { ToolOne } from "~/server/web/tools/payloads"

type Tool = ToolOne | Jsonify<ToolOne>

export const isToolPublished = (tool: Pick<Tool, "status">) => {
  return tool.status === ToolStatus.Published
}
