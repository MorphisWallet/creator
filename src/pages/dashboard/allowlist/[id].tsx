import Head from 'next/head'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'
import { type Perk } from '@prisma/client'
import { Box, Button, Card, Grid, Group, Text, Image, Stack, ActionIcon } from '@mantine/core'
import { PerkStatusBadge } from '@/components/perk/PerkStatusBadge'
import { formatDate } from '@/utils/date'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { ExportToCsv } from 'export-to-csv'
import { api } from '@/utils/api'
import { useDidUpdate } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { TwitterRequirementDetail } from '@/components/perk/TwitterRequirementDetail'
import { TokenRequirementDetail } from '@/components/perk/TokenRequirementDetail'

type Props = {
  perk: Perk
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const id = context.params?.id
  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    }
  }

  const perk = await prisma.perk
    .findFirst({
      where: {
        id,
      },
    })
    .catch(() => null)

  if (!perk) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      perk,
    },
  }
}

const StatCard = ({ title, content }: { title: string; content: string }) => (
  <Card
    shadow="sm"
    padding="lg"
    radius="md"
    withBorder
  >
    <Text
      color="dimmed"
      size="sm"
    >
      {title}
    </Text>
    <Text
      mt={'md'}
      size={'lg'}
    >
      {content}
    </Text>
  </Card>
)

export default function AllowListDetailPage({ perk }: Props) {
  const spotUsed = perk.allowList?.spotsUsed ?? 0
  const spotTotal = perk.allowList?.spots ?? 0
  const starDateString = formatDate(perk.startDate)
  const endDateString = formatDate(perk.endDate)
  const router = useRouter()

  const { isLoading, data, error } = api.perk.downloadAllowList.useQuery(perk.id, {
    refetchInterval: 1000 * 60 * 5, // refetch every 5 minute
    retry: false,
  })

  useDidUpdate(() => {
    if (error) {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: error.message,
      })
    }
  }, [error])

  const downloadAllowlist = () => {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      showLabels: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: 'allowlist',
    }

    const csvExporter = new ExportToCsv(options)

    let csvData = [
      {
        walletAddress: '',
        twitterName: '',
      },
    ]

    if (data && data.length > 0) {
      csvData = data
    }
    csvExporter.generateCsv(csvData)
  }

  const pageTitle = `Airdawg - ${perk.name}`

  return (
    <DashboardLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Box>
        <Group>
          <ActionIcon
            variant="outline"
            radius="xl"
            onClick={() => void router.push('/dashboard/perks')}
          >
            <IconArrowLeft size="1rem" />
          </ActionIcon>
          <Text size="xl">{perk.name} allowlist</Text>
          <PerkStatusBadge
            status={perk.status}
            endDate={perk.endDate}
          />
        </Group>
        <Group
          position={'apart'}
          mt={'lg'}
        >
          <Text size={'lg'}>Manage allowlist</Text>
          <Group>
            <Button
              variant={'outline'}
              color={'orange'}
              onClick={downloadAllowlist}
              loading={isLoading}
            >
              Download Allowlist
            </Button>
            <Button
              variant={'outline'}
              color={'dark'}
              onClick={() => void router.push(`/dashboard/allowlist/edit/${perk.id}`)}
            >
              Edit Requirement
            </Button>
          </Group>
        </Group>
        <Grid mt={'md'}>
          <Grid.Col span={6}>
            <StatCard
              title={'Number of participants'}
              content={`${spotUsed}/${spotTotal} spots filled`}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <StatCard
              title={'Duration'}
              content={`${starDateString} - ${endDateString}`}
            />
          </Grid.Col>
        </Grid>
        <Image
          src={perk.featuredImageUrl}
          withPlaceholder
          height={500}
          mt={'xl'}
          alt={'featured image'}
          radius="md"
        />
        <Text
          mt={'md'}
          size={'lg'}
        >
          {perk.description}
        </Text>
        <Stack mt={'md'}>
          <Text color={'dimmed'}>
            Price: {perk.allowList?.price ?? 'N/A'} {perk.allowList?.priceSymbol}
          </Text>
          <Text color={'dimmed'}>Total Supply: {perk.allowList?.totalSupply ?? 'N/A'}</Text>
        </Stack>
        <Text
          mt={'xl'}
          size={'xl'}
        >
          Requirements to join 🎈
        </Text>
        <Stack mt={'xl'}>
          <TokenRequirementDetail tokenHolderRequirement={perk.tokenHolderRequirement} />
          <TwitterRequirementDetail twitterRequirement={perk.twitterRequirement} />
        </Stack>
      </Box>
    </DashboardLayout>
  )
}
