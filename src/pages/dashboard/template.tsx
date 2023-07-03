import Head from 'next/head'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Box, Button, Card, Grid, Stack, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import { type GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/server/db'
import { WarningMessage } from '@/components/common/WarningMessage'

type Props = {
  hasVerifiedTwitter: boolean
  hasCreatedProject: boolean
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const session = await getSession(context)

  const providers = await prisma.account.findFirst({
    where: {
      userId: session?.user.id,
      provider: 'twitter',
    },
  })

  const project = await prisma.project.findUnique({
    where: {
      userId: session?.user.id,
    },
  })

  const hasVerifiedTwitter = Boolean(providers)
  const hasCreatedProject = Boolean(project)

  return {
    props: {
      hasVerifiedTwitter,
      hasCreatedProject,
    },
  }
}

export default function Template({ hasVerifiedTwitter, hasCreatedProject }: Props) {
  const { push } = useRouter()

  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Project</title>
      </Head>
      <h1>Perk templates 🎁</h1>
      <Box>
        <Stack>
          {!hasVerifiedTwitter && (
            <WarningMessage message={'You have not verified your Twitter account yet. Please verify your Twitter to create perks.'} />
          )}
          {!hasCreatedProject && <WarningMessage message="Please Fill in project information first" />}
        </Stack>
        {hasVerifiedTwitter && hasCreatedProject && (
          <Grid>
            <Grid.Col
              md={6}
              lg={3}
            >
              <Card
                padding="lg"
                radius="lg"
                withBorder
              >
                <Text
                  fw={'bold'}
                  size={'xl'}
                >
                  Allowlist
                </Text>
                <Text
                  color={'dimmed'}
                  my={'md'}
                >
                  Let Airdawg help you gather a list of user wallets based on your specific criteria.
                </Text>
                <Box sx={{ fontSize: 52 }}>🔖</Box>
                <Button
                  fullWidth
                  variant="outline"
                  radius="xl"
                  onClick={() => void push('/dashboard/allowlist/create')}
                >
                  Use this
                </Button>
              </Card>
            </Grid.Col>
            <Grid.Col
              md={6}
              lg={3}
            >
              <Card
                padding="lg"
                radius="lg"
                withBorder
              >
                <Text
                  fw={'bold'}
                  size={'xl'}
                >
                  Create your own perk
                </Text>
                <Text
                  color={'dimmed'}
                  my={'md'}
                >
                  Have other perks to offer? Reach Airdawg&apos;s users by filling in this form.
                </Text>
                <Box sx={{ fontSize: 52 }}>✏</Box>
                <Button
                  fullWidth
                  variant="outline"
                  radius="xl"
                  onClick={() => void push('/dashboard/generic/create')}
                >
                  Start creating
                </Button>
              </Card>
            </Grid.Col>
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  )
}
