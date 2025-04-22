import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { Wrapper } from "~/components/admin/wrapper"
import { findToolList } from "~/server/admin/tools/queries"

export default function CreateCategoryPage() {
  return (
    <Wrapper size="md">
      <CategoryForm title="Create category" tools={findToolList()} />
    </Wrapper>
  )
}
