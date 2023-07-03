import Head from 'next/head'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'
import { type Perk } from '@prisma/client'
import { Box, Button, Card, Grid, Group, Text, Image, Stack, ActionIcon, Anchor } from '@mantine/core'
import { PerkStatusBadge } from '@/components/perk/PerkStatusBadge'
import { formatDate } from '@/utils/date'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/router'
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

export default function GenericPerkDetailPage({ perk }: Props) {
  const starDateString = formatDate(perk.startDate)
  const endDateString = formatDate(perk.endDate)
  const router = useRouter()
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
          <Text size="xl">{perk.name}</Text>
          <PerkStatusBadge
            status={perk.status}
            endDate={perk.endDate}
          />
        </Group>
        <Group
          position={'apart'}
          mt={'lg'}
        >
          <Text size={'lg'}>Manage perk</Text>
          <Group>
            <Button
              variant={'outline'}
              color={'dark'}
              onClick={() => void router.push(`/dashboard/generic/edit/${perk.id}`)}
            >
              Edit Requirement
            </Button>
          </Group>
        </Group>
        <Grid mt={'md'}>
          <Grid.Col span={6}>
            <StatCard
              title={'Perk Type'}
              content={perk.generic?.type ?? ''}
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
        <Group spacing={8}>
          <Text size={'lg'}>Link to claim:</Text>
          <Anchor
            href={perk.generic?.link}
            target="_blank"
          >
            {perk.generic?.link}
          </Anchor>
        </Group>
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
