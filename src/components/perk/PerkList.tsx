import { Box, Button, Card, Center, Group, Image, Loader, SegmentedControl, SimpleGrid, Space, Stack, Text } from '@mantine/core'
import { api } from '@/utils/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { PerkStatusBadge } from '@/components/perk/PerkStatusBadge'
import { formatDate } from '@/utils/date'
import { type Perk } from '@prisma/client'

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

const PerkDescription = ({ label, value }: { label: string; value: string }) => {
  return (
    <Group position={'apart'}>
      <Text
        c="dimmed"
        size={'sm'}
      >
        {label}
      </Text>
      <Text
        c="dimmed"
        size={'sm'}
      >
        {value}
      </Text>
    </Group>
  )
}

const AllowlistPerkDescription = ({ perk }: { perk: Perk }) => {
  return (
    <>
      <PerkDescription
        label={'Spots available'}
        value={`${perk.allowList?.spotsUsed ?? 0} / ${perk.allowList?.spots ?? 0}`}
      />
      <PerkDescription
        label={'Price'}
        value={`${perk?.allowList?.price ?? ''} ${perk.allowList?.priceSymbol ?? ''}`}
      />
    </>
  )
}

const GenericPerkDescription = ({ perk }: { perk: Perk }) => {
  return (
    <>
      <PerkDescription
        label={'Type'}
        value={perk.generic?.type ?? ''}
      />
    </>
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
    <SimpleGrid
      cols={4}
      spacing="lg"
      breakpoints={[
        { maxWidth: 'xl', cols: 2, spacing: 'sm' },
        { maxWidth: 'xs', cols: 1, spacing: 'sm' },
      ]}
    >
      {filteredPerks.map(perk => {
        return (
          <Card
            key={perk.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            sx={{ cursor: 'pointer', alignSelf: 'stretch' }}
            onClick={() => {
              const type = perk.type.toLowerCase()
              if (perk.status === 'Draft') {
                void router.push(`/dashboard/${type}/edit/${perk.id}`)
              } else {
                void router.push(`/dashboard/${type}/${perk.id}`)
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
            <Space h={'md'} />
            <PerkStatusBadge
              status={perk.status}
              endDate={perk.endDate}
            />
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
            <Space h={'md'} />
            <Stack spacing={'xs'}>
              {perk.type === 'Allowlist' && <AllowlistPerkDescription perk={perk} />}
              {perk.type === 'Generic' && <GenericPerkDescription perk={perk} />}
              <PerkDescription
                label={'Date'}
                value={`${formatDate(perk.startDate)} - ${formatDate(perk.endDate)}`}
              />
            </Stack>
          </Card>
        )
      })}
    </SimpleGrid>
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
