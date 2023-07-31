import { Badge } from '@mantine/core'
import { ProjectStatus } from '@prisma/client'
import { pascalToNormal } from '@/utils/string'

type Props = {
  status: ProjectStatus
}

export const ProjectStatusBadge = ({ status }: Props) => {
  const badgeColorMap = {
    [ProjectStatus.Published]: 'teal',
    [ProjectStatus.InReview]: 'purple',
    [ProjectStatus.Draft]: 'yellow',
    [ProjectStatus.Rejected]: 'red',
  }

  return (
    <Badge
      color={badgeColorMap[status]}
      variant="light"
      size={'lg'}
    >
      {pascalToNormal(status)}
    </Badge>
  )
}
