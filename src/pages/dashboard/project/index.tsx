import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Box, Button, Space } from '@mantine/core'
import Head from 'next/head'
import { ProjectList } from '@/components/project/ProjectList'
import { useRouter } from 'next/router'

export default function Project() {
  const { push } = useRouter()

  return (
    <DashboardLayout>
      <Head>
        <title>Kiosk - Projects</title>
      </Head>
      <h1>Project</h1>
      <Box>
        <Button onClick={() => void push('/dashboard/project/new')}>Create new project</Button>
        <Space h={'md'} />
        <ProjectList />
      </Box>
    </DashboardLayout>
  )
}
