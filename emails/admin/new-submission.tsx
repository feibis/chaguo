import type { Tool } from "@prisma/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"
import { config } from "~/config"

export type EmailProps = EmailWrapperProps & {
  tool?: Tool | Jsonify<Tool>
}

const EmailAdminNewSubmission = ({ tool, ...props }: EmailProps) => {
  return (
    <EmailWrapper {...props}>
      <Text>Hi!</Text>

      <Text>
        {tool?.submitterName} has opted to expedite the submission of {tool?.name}. You should
        review and approve it as soon as possible.
      </Text>

      <EmailButton href={`${config.site.url}/admin/tools/${tool?.slug}`}>
        Review {tool?.name}'s submission
      </EmailButton>
    </EmailWrapper>
  )
}

export default EmailAdminNewSubmission
