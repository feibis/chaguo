import Image from "next/image"
import { Stack } from "~/components/common/stack"
import { LoginButton } from "~/components/web/auth/login-button"
import { LoginForm } from "~/components/web/auth/login-form"
import googleIcon from "~/public/google.svg"

export const Login = () => {
  return (
    <Stack direction="column" className="items-stretch w-full">
      <LoginForm />

      <div className="flex items-center justify-center gap-3 my-2 text-sm text-muted-foreground before:flex-1 before:border-t after:flex-1 after:border-t">
        or
      </div>

      <LoginButton
        provider="google"
        suffix={<Image src={googleIcon} alt="Google" className="size-4" />}
      />
    </Stack>
  )
}
