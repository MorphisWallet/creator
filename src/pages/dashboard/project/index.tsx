import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { type GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { Alert, Box, Button, Space, Stack } from '@mantine/core'
import Head from 'next/head'
import { ProjectList } from '@/components/project/ProjectList'
import { useRouter } from 'next/router'
import { IconAlertCircle } from '@tabler/icons-react'

type Props = {
  hasVerifiedTwitter: boolean
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const session = await getSession(context)
  const hasVerifiedTwitter = Boolean(session?.user?.twitter?.username)

  return {
    props: {
      hasVerifiedTwitter,
    },
  }
}

export default function Project({ hasVerifiedTwitter }: Props) {
  const { push } = useRouter()

  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Projects</title>
      </Head>
      <h1>Project</h1>
      <Box>
        <Stack>
          {!hasVerifiedTwitter && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              color="orange"
            >
              You have not verified your Twitter account yet. Please verify your Twitter to create projects.
            </Alert>
          )}
        </Stack>
        {hasVerifiedTwitter && (
          <>
            <Button onClick={() => void push('/dashboard/project/new')}>Create new project</Button>
            <Space h={'md'} />
            <ProjectList />
          </>
        )}
      </Box>
    </DashboardLayout>
  )
}
