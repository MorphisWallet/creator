import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Head from 'next/head'
import { ActionIcon, Group } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { ProjectForm } from '@/components/project/ProjectForm'
import { type Project } from '@prisma/client'
import { type GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/server/db'

type Props = {
  project: Project
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const id = context.params?.id
  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    }
  }
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const project = await prisma.project.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  })
  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: { project },
  }
}

export default function ProjectEdit({ project }: Props) {
  const isPublished = project.status === 'Published'
  const { push } = useRouter()
  const name = project.name

  const goBack = () => {
    if (isPublished) {
      void push(`/dashboard/project/${project.id}`)
    } else {
      void push('/dashboard/project')
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Kiosk - {name}</title>
      </Head>
      <Group>
        <ActionIcon
          variant="outline"
          radius="xl"
          onClick={() => void goBack()}
        >
          <IconArrowLeft size="1rem" />
        </ActionIcon>
        <h1>Edit {name}</h1>
      </Group>
      <ProjectForm project={project} />
    </DashboardLayout>
  )
}
