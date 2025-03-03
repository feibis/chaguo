import { CategoryList } from "~/components/web/categories/category-list"
import { findCategories } from "~/server/web/categories/queries"

type CategoryQueryProps = {
  placeholder?: string
}

const CategoryQuery = async ({ placeholder }: CategoryQueryProps) => {
  const categories = await findCategories({})

  return <CategoryList categories={categories} />
}

export { CategoryQuery }
