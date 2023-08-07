import Head from 'next/head'
import { type Project } from '@prisma/client'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'
import { ProjectForm } from '@/components/project/ProjectForm'
import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'

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
  const session = await getServerAuthSession(context)
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
  const title = `Kiosk - ${project.name}`

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <ProjectForm project={project} />
    </Layout>
  )
}
