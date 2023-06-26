import { Group, Stack, Text, Image, Box } from '@mantine/core'
import { formatDate } from '@/utils/date'
import { api } from '@/utils/api'

type Props = {
  perkName: string
  perkDescription: string
  perkImage: string
  spotsAvailable: number
  startDate?: Date
  endDate?: Date
}

export const PerkPreview = ({ perkName, perkDescription, perkImage, spotsAvailable, endDate, startDate }: Props) => {
  const { data } = api.project.getProjectDetail.useQuery()

  return (
    <Box>
      <Text
        size="xl"
        fw={'bold'}
        mb={'xl'}
      >
        Preview of your allowlist 👀
      </Text>
      <Group
        noWrap
        align="flex-start"
      >
        <Image
          fit="cover"
          height={240}
          width={307}
          src={perkImage}
          withPlaceholder
          radius="md"
          alt={''}
          sx={{ flexShrink: 0 }}
        />
        <Stack spacing={'xs'}>
          <Text>Offered by {data?.name}</Text>
          <Text
            fw={'bold'}
            size={'xl'}
          >
            {perkName}
          </Text>
          <Text color={'dimmed'}>{perkDescription}</Text>
        </Stack>
      </Group>
      <Group
        position="apart"
        mt={'sm'}
      >
        <Text>
          {spotsAvailable}/{spotsAvailable} spots available to claim
        </Text>
        {startDate && endDate && (
          <Text>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        )}
      </Group>
    </Box>
  )
}
