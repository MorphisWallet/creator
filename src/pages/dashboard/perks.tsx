import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { type GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/server/db'
import { Box, Stack } from '@mantine/core'
import Head from 'next/head'
import { PerkList } from '@/components/perk/PerkList'
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

export default function Perks({ hasVerifiedTwitter, hasCreatedProject }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Perks</title>
      </Head>
      <h1>Perks</h1>
      <Box>
        <Stack>
          {!hasVerifiedTwitter && (
            <WarningMessage message={'You have not verified your Twitter account yet. Please verify your Twitter to create perks.'} />
          )}
          {!hasCreatedProject && <WarningMessage message="Please Fill in project information first" />}
        </Stack>
        {hasVerifiedTwitter && hasCreatedProject && <PerkList />}
      </Box>
    </DashboardLayout>
  )
}
