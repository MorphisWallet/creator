import { Box, Button, Center, Loader, SimpleGrid, Text } from '@mantine/core'
import Link from 'next/link'
import { ProjectCard } from '@/components/project/ProjectCard'
import { useSession } from 'next-auth/react'
import { api } from '@/utils/api'
import { useDidUpdate } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

export const Project = () => {
  const { status } = useSession({
    required: true,
  })

  const { data: projectData, error } = api.project.list.useQuery(undefined, {
    enabled: status === 'authenticated',
    retry: false,
  })

  useDidUpdate(() => {
    if (error) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    }
  }, [error])

  return (
    <Box mb={20}>
      <Text
        size={42}
        fw={700}
        mt={{
          xs: 25,
          md: 50,
        }}
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
            breakpoints={[
              { minWidth: 'xs', cols: 1 },
              { minWidth: 'sm', cols: 2 },
              { minWidth: 'md', cols: 3 },
            ]}
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

export default Project
