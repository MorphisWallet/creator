import { Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

type Props = {
  message: string | undefined | null
}

export const RejectMessage = ({ message }: Props) => (
  <Alert
    icon={<IconAlertCircle size="1rem" />}
    title="This project has been rejected"
    color="red"
  >
    Reason: {message || 'No reason provided'}
  </Alert>
)
