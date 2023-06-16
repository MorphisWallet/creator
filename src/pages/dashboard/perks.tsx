import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { type GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/server/db'
import { Alert, Box, Button, Stack, Space } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { PerkList } from '@/components/perk/PerkList'

type Props = {
  hasVerifiedTwitter: boolean
  hasCreatedProject: boolean
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
  const providers = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: 'twitter',
    },
  })

  const project = await prisma.project.findUnique({
    where: {
      userId: session.user.id,
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

const VerificationAlert = ({ message }: { message: string }) => {
  return (
    <Alert
      icon={<IconAlertCircle size="1rem" />}
      color="orange"
    >
      {message}
    </Alert>
  )
}

export default function Perks({ hasVerifiedTwitter, hasCreatedProject }: Props) {
  const { push } = useRouter()

  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Perks</title>
      </Head>
      <h1>Perks</h1>
      <Box>
        <Stack>
          {!hasVerifiedTwitter && (
            <VerificationAlert message={'You have not verified your Twitter account yet. Please verify your Twitter to create perks.'} />
          )}
          {!hasCreatedProject && <VerificationAlert message="Please Fill in project information first" />}
        </Stack>
        {hasVerifiedTwitter && hasCreatedProject && (
          <Button onClick={() => void push('/dashboard/allowlist/create')}>Create New Allowlist</Button>
        )}
        <Space h={'md'} />
        {hasVerifiedTwitter && hasCreatedProject && <PerkList />}
      </Box>
    </DashboardLayout>
  )
}
