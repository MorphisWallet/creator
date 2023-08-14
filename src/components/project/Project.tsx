import { Box, Button, Center, Loader, SimpleGrid, Text } from '@mantine/core'
import Link from 'next/link'
import { ProjectCard } from '@/components/project/ProjectCard'
import { useSession } from 'next-auth/react'
import { api } from '@/utils/api'

export const Project = () => {
  const { status } = useSession({
    required: true,
  })

  const { data: projectData } = api.project.list.useQuery(undefined, {
    enabled: status === 'authenticated',
  })

  return (
    <Box>
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
        <Link href={'/project/new'}>
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
        {projectData ? (
          <SimpleGrid
            cols={3}
            mt={44}
            pb={40}
          >
            {projectData?.projects.map(project => (
              <ProjectCard
                project={project}
                key={project.id}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center mt={44}>
            <Loader
              color={'red'}
              size={30}
            />
          </Center>
        )}
      </Box>
    </Box>
  )
}
