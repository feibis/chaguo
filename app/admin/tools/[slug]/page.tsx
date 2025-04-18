import { notFound } from "next/navigation"
import { ToolForm } from "~/app/admin/tools/_components/tool-form"
import { Wrapper } from "~/components/admin/wrapper"
import { findCategoryList } from "~/server/admin/categories/queries"
import { findToolBySlug } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function UpdateToolPage({ params }: PageProps) {
  const { slug } = await params
  const tool = await findToolBySlug(slug)

  if (!tool) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <ToolForm title={`Edit ${tool.name}`} tool={tool} categories={findCategoryList()} />
    </Wrapper>
  )
}
