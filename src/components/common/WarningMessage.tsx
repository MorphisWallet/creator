import { Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

export const WarningMessage = ({ message }: { message: string }) => {
  return (
    <Alert
      icon={<IconAlertCircle size="1rem" />}
      color="orange"
    >
      {message}
    </Alert>
  )
}
