import Head from 'next/head'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { type GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/server/db'
import { type Perk } from '@prisma/client'
import { Box, Button, Card, Grid, Group, Text, Image, Stack, ActionIcon } from '@mantine/core'
import { PerkStatusBadge } from '@/components/perk/PerkStatusBadge'
import { formatDate } from '@/utils/date'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/router'

type Props = {
  perk: Perk
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

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
  const mustHoldTokenContracts = perk.tokenHolderRequirement?.mustHoldTokenContracts ?? []
  const mustHoldTokens = perk.tokenHolderRequirement?.tokenRequirement ?? []
  let tokenRequirementText = ''
  if (mustHoldTokens[0]) {
    tokenRequirementText = `Must hold at least ${mustHoldTokens[0].mustHoldAmount} ${mustHoldTokens[0]?.tokenSymbol ?? ''}`
  }
  if (mustHoldTokens[1]) {
    const prefix = mustHoldTokenContracts.length > 0 ? 'and' : 'or'
    tokenRequirementText = `${tokenRequirementText} ${prefix} hold at least ${mustHoldTokens[1].mustHoldAmount} ${
      mustHoldTokens[1]?.tokenSymbol ?? ''
    }`
  }

  const router = useRouter()

  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - {perk.name}</title>
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
          {tokenRequirementText && (
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group>
                <svg
                  width="24"
                  height="18"
                  viewBox="0 0 24 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.25 5.39719V4.875C17.25 2.52375 13.7034 0.75 9 0.75C4.29656 0.75 0.75 2.52375 0.75 4.875V8.625C0.75 10.5834 3.21094 12.1397 6.75 12.6056V13.125C6.75 15.4762 10.2966 17.25 15 17.25C19.7034 17.25 23.25 15.4762 23.25 13.125V9.375C23.25 7.43437 20.8669 5.87625 17.25 5.39719ZM5.25 10.7691C3.41344 10.2562 2.25 9.41156 2.25 8.625V7.30594C3.015 7.84781 4.03969 8.28469 5.25 8.57812V10.7691ZM12.75 8.57812C13.9603 8.28469 14.985 7.84781 15.75 7.30594V8.625C15.75 9.41156 14.5866 10.2562 12.75 10.7691V8.57812ZM11.25 15.2691C9.41344 14.7562 8.25 13.9116 8.25 13.125V12.7341C8.49656 12.7434 8.74594 12.75 9 12.75C9.36375 12.75 9.71906 12.7378 10.0678 12.7172C10.4552 12.8559 10.8499 12.9736 11.25 13.0697V15.2691ZM11.25 11.0859C10.5051 11.196 9.75302 11.2508 9 11.25C8.24698 11.2508 7.49493 11.196 6.75 11.0859V8.85563C7.49604 8.95283 8.24765 9.00106 9 9C9.75235 9.00106 10.504 8.95283 11.25 8.85563V11.0859ZM17.25 15.5859C15.758 15.8047 14.242 15.8047 12.75 15.5859V13.35C13.4958 13.4503 14.2475 13.5004 15 13.5C15.7523 13.5011 16.504 13.4528 17.25 13.3556V15.5859ZM21.75 13.125C21.75 13.9116 20.5866 14.7562 18.75 15.2691V13.0781C19.9603 12.7847 20.985 12.3478 21.75 11.8059V13.125Z"
                    fill="#07070B"
                  />
                </svg>
                <Text>Token holders</Text>
              </Group>
              <Text mt={'sm'}>{tokenRequirementText}</Text>
            </Card>
          )}
        </Stack>
      </Box>
    </DashboardLayout>
  )
}
