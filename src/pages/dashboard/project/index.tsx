import { type GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { Box, Button, SimpleGrid, Text } from '@mantine/core'
import Head from 'next/head'
import { Layout } from '@/components/layout/Layout'
import { prisma } from '@/server/db'
import { type Project } from '@prisma/client'
import Link from 'next/link'
import { ProjectCard } from '@/components/project/ProjectCard'

type Props = {
  projects: Project[]
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const session = await getSession(context)
  const userId = session?.user?.id
  if (!userId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const projects = await prisma.project.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  })

  return {
    props: {
      projects,
    },
  }
}

export default function Project({ projects }: Props) {
  return (
    <Layout>
      <Head>
        <title>Kiosk - Projects</title>
      </Head>
      <Text
        size={42}
        fw={700}
        mt={50}
        color={'white.1'}
      >
        My Projects
      </Text>
      <Text
        size={'lg'}
        mb={44}
        color={'white.1'}
      >
        Create, curate, and manage your ERC6551 projects information.
      </Text>
      <Box>
        <Link href={'/dashboard/project/new'}>
          <Button
            color={'red'}
            h={53}
            radius={20}
            w={196}
            sx={{
              backgroundColor: '#ED3733',
            }}
          >
            <Text
              fw={700}
              size={'md'}
              color={'white.0'}
            >
              Create new project
            </Text>
          </Button>
        </Link>
        <SimpleGrid
          cols={3}
          mt={44}
          pb={40}
        >
          {projects.map(project => (
            <ProjectCard
              project={project}
              key={project.id}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  )
}
