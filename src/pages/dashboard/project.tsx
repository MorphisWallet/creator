import { getSession } from 'next-auth/react'
import { type GetServerSideProps } from 'next'
import { Box, Space } from '@mantine/core'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { prisma } from '@/server/db'
import Head from 'next/head'
import { ProjectInfo, type ProjectInfoProps } from '@/components/project/ProjectInfo'
import { AccountConnect } from '@/components/project/AccountConnect'

type Props = {
  project: ProjectInfoProps
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const session = await getSession(context)

  const project = await prisma.project.findUnique({
    where: {
      userId: session?.user.id,
    },
  })

  return {
    props: {
      project: {
        name: project?.name ?? '',
        description: project?.description ?? '',
        link: project?.link ?? '',
      },
    },
  }
}

export default function Project({ project }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Project</title>
      </Head>
      <h1>Project</h1>
      <Box w={550}>
        <AccountConnect />
        <Space h={'md'} />
        <ProjectInfo {...project} />
      </Box>
    </DashboardLayout>
  )
}
