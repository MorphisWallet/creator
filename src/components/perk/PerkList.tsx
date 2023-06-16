import { Box, Card, Grid, Group, Image, Loader, SegmentedControl, Text } from '@mantine/core'
import { api } from '@/utils/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { PerkStatusBadge } from '@/components/perk/PerkStatusBadge'
import { formatDate } from '@/utils/date'

type PerkStatusFilter = 'published' | 'draft' | 'expired' | 'all'

export const PerkList = () => {
  const [status, setStatus] = useState('all')
  const { data, isLoading } = api.perk.list.useQuery({
    status: status as PerkStatusFilter,
  })

  const filterOptions: { label: string; value: PerkStatusFilter }[] = [
    { label: '🔥 All', value: 'all' },
    { label: '✨ Published', value: 'published' },
    { label: '✏️ Draft', value: 'draft' },
    { label: '📦 Expired', value: 'expired' },
  ]

  const router = useRouter()

  const perks = (
    <Grid>
      {data?.perks.map(perk => {
        return (
          <Grid.Col
            key={perk.id}
            md={6}
            lg={3}
          >
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                if (perk.status === 'Draft') {
                  void router.push(`/dashboard/allowlist/edit/${perk.id}`)
                } else {
                  void router.push(`/dashboard/allowlist/${perk.id}`)
                }
              }}
            >
              <Card.Section>
                <Image
                  src={perk.featuredImageUrl}
                  height={270}
                  withPlaceholder
                  alt="perk image"
                />
              </Card.Section>
              <Text
                weight={500}
                lineClamp={1}
                display={'block'}
                truncate
                size={'xl'}
                mt={'xs'}
              >
                {perk.name}
              </Text>
              <Group position={'apart'}>
                <Text
                  c="dimmed"
                  size={'sm'}
                >
                  Spots available
                </Text>
                <Text
                  c="dimmed"
                  size={'sm'}
                >
                  {perk.allowList?.spotsUsed} / {perk.allowList?.spots ?? 0}
                </Text>
              </Group>
              <Group position={'apart'}>
                <Text
                  c="dimmed"
                  size={'sm'}
                >
                  Price
                </Text>
                <Text
                  c="dimmed"
                  size={'sm'}
                >
                  {perk.allowList?.price} {perk.allowList?.priceSymbol}
                </Text>
              </Group>
              <Group
                position={'apart'}
                mb={'md'}
              >
                <Text
                  c="dimmed"
                  size={'sm'}
                >
                  Date
                </Text>
                <Text
                  c="dimmed"
                  size={'sm'}
                >
                  {formatDate(perk.startDate)} - {formatDate(perk.endDate)}
                </Text>
              </Group>
              <PerkStatusBadge
                status={perk.status}
                endDate={perk.endDate}
              />
            </Card>
          </Grid.Col>
        )
      })}
    </Grid>
  )

  return (
    <Box>
      <SegmentedControl
        mb={'md'}
        value={status}
        onChange={setStatus}
        data={filterOptions}
      />
      {isLoading && (
        <Box>
          <Loader size="md" />
        </Box>
      )}
      {data && perks}
    </Box>
  )
}
