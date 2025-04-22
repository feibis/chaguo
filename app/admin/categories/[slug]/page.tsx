import { notFound } from "next/navigation"
import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { Wrapper } from "~/components/admin/wrapper"
import { findCategoryBySlug } from "~/server/admin/categories/queries"
import { findToolList } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function UpdateCategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await findCategoryBySlug(slug)

  if (!category) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <CategoryForm title="Update category" category={category} tools={findToolList()} />
    </Wrapper>
  )
}
