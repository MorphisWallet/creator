import { Badge } from '@mantine/core'
import { PerkStatus } from '@prisma/client'
import { type DisplayStatus } from '@/server/api/routers/perk'

type Props = {
  status: PerkStatus
  endDate: Date
}

export const PerkStatusBadge = ({ status, endDate }: Props) => {
  let displayStatus: DisplayStatus = status === PerkStatus.Draft ? 'draft' : 'published'
  if (status === PerkStatus.Published && endDate < new Date()) {
    displayStatus = 'expired'
  }
  const badgeColorMap = {
    expired: 'gray',
    published: 'teal',
    draft: 'orange',
  }

  return (
    <Badge
      color={badgeColorMap[displayStatus]}
      variant="light"
      size={'lg'}
    >
      {displayStatus}
    </Badge>
  )
}
