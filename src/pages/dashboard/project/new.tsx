import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Head from 'next/head'
import { ActionIcon, Group } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { ProjectForm } from '@/components/project/ProjectForm'

export default function NewProjectPage() {
  const { push } = useRouter()
  const goBack = () => push('/dashboard/project')

  return (
    <DashboardLayout>
      <Head>
        <title>Kiosk - Submit a project</title>
      </Head>
      <Group>
        <ActionIcon
          variant="outline"
          radius="xl"
          onClick={() => void goBack()}
        >
          <IconArrowLeft size="1rem" />
        </ActionIcon>
        <h1>Create an new project</h1>
      </Group>
      <ProjectForm />
    </DashboardLayout>
  )
}
