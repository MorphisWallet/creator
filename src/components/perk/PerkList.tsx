import { Box, Button, Card, Center, Grid, Group, Image, Loader, SegmentedControl, Text } from '@mantine/core'
import { api } from '@/utils/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { PerkStatusBadge } from '@/components/perk/PerkStatusBadge'
import { formatDate } from '@/utils/date'

const EmptyPerkMessage = () => {
  const { push } = useRouter()

  return (
    <Card
      withBorder
      radius={'lg'}
      padding={'xl'}
    >
      <Center>
        <Box
          maw={600}
          py={40}
        >
          <Text
            fw={'bold'}
            size="xl"
            align={'center'}
            mb={'md'}
          >
            You don’t have perks
          </Text>
          <Text
            color={'dimmed'}
            align={'center'}
            mb={'md'}
          >
            Perks are things you want to offer to your community holders to engage, reward or simply thank them for being part of your
            growing community.
          </Text>
          <Group
            position={'center'}
            sx={{ fontSize: 53 }}
            mb={'md'}
          >
            <Text>🐶</Text>
            <Text>✨</Text>
          </Group>
          <Button
            fullWidth
            variant="outline"
            radius="xl"
            onClick={() => void push('/dashboard/template')}
          >
            Start creating
          </Button>
        </Box>
      </Center>
    </Card>
  )
}

type PerkStatusFilter = 'published' | 'draft' | 'expired' | 'all'

export const PerkList = () => {
  const [status, setStatus] = useState('all')
  const { data, isLoading } = api.perk.list.useQuery()

  const filterOptions: { label: string; value: PerkStatusFilter }[] = [
    { label: '🔥 All', value: 'all' },
    { label: '✨ Published', value: 'published' },
    { label: '✏️ Draft', value: 'draft' },
    { label: '📦 Expired', value: 'expired' },
  ]

  const filteredPerks =
    data?.perks.filter(perk => {
      if (status === 'all') {
        return true
      }
      if (status === 'draft') {
        return perk.status === 'Draft'
      }
      if (status === 'published') {
        return perk.endDate > new Date() && perk.status === 'Published'
      }
      if (status === 'expired') {
        return perk.endDate < new Date()
      }
      return false
    }) ?? []

  const router = useRouter()

  const perks = (
    <Grid>
      {filteredPerks.map(perk => {
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
      {data?.perks?.length === 0 && <EmptyPerkMessage />}
      {data && perks}
    </Box>
  )
}
