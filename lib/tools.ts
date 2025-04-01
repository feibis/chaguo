import type { Jsonify } from "inngest/helpers/jsonify"
import type { ToolOne } from "~/server/web/tools/payloads"

/**
 * Check if a tool is publicly available to be viewed.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is public.
 */
export const isToolVisible = (tool: Pick<ToolOne | Jsonify<ToolOne>, "status">) => {
  return ["Scheduled", "Published"].includes(tool.status)
}

/**
 * Check if a tool is published.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is published.
 */
export const isToolPublished = (tool: Pick<ToolOne | Jsonify<ToolOne>, "status">) => {
  return ["Published"].includes(tool.status)
}
