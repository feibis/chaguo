import { notFound } from "next/navigation"
import { UserForm } from "~/app/admin/users/_components/user-form"
import { Wrapper } from "~/components/admin/wrapper"
import { findUserById } from "~/server/admin/users/queries"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function UpdateUserPage({ params }: PageProps) {
  const { id } = await params
  const user = await findUserById(id)

  if (!user) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <UserForm title="Update user" user={user} />
    </Wrapper>
  )
}
