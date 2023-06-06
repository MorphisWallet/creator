import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { type GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/server/db'
import { Alert, Box, Button, Text } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import Head from 'next/head'

type Props = {
  hasVerifiedTwitter: boolean
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

  return {
    props: {
      hasVerifiedTwitter: Boolean(providers),
    },
  }
}

const VerificationAlert = () => {
  return (
    <Alert
      icon={<IconAlertCircle size="1rem" />}
      color="orange"
    >
      You have not verified your Twitter account yet. Please verify your Twitter to create perks.
    </Alert>
  )
}

export default function Perks({ hasVerifiedTwitter }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Perks</title>
      </Head>
      <h1>Perks</h1>
      <Box>{!hasVerifiedTwitter ? <VerificationAlert /> : <Button>Create new perk</Button>}</Box>
    </DashboardLayout>
  )
}
