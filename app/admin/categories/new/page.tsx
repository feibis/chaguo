import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findToolList } from "~/server/admin/tools/queries"

const CreateCategoryPage = () => {
  return (
    <Wrapper size="md">
      <CategoryForm title="Create category" tools={findToolList()} />
    </Wrapper>
  )
}

export default withAdminPage(CreateCategoryPage)
