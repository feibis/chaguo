import { ToolForm } from "~/app/admin/tools/_components/tool-form"
import { Wrapper } from "~/components/admin/wrapper"
import { findCategoryList } from "~/server/admin/categories/queries"

export default function CreateToolPage() {
  return (
    <Wrapper size="md">
      <ToolForm title="Create tool" categories={findCategoryList()} />
    </Wrapper>
  )
}
