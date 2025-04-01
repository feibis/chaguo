import { ToolFormCreate } from "~/app/admin/tools/_components/tool-form-create"
import { Wrapper } from "~/components/admin/wrapper"
import { H3 } from "~/components/common/heading"

export default function CreateToolPage() {
  return (
    <Wrapper size="md">
      <H3>Create tool</H3>

      <ToolFormCreate />
    </Wrapper>
  )
}
