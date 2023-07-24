import { Avatar, Box, Button, Card, Center, Group, Loader, SegmentedControl, SimpleGrid, Space, Text, Badge } from '@mantine/core'
import { api } from '@/utils/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { ProjectStatusBadge } from '@/components/project/ProjectStatusBadge'
import { ProjectDropdownMenu } from '@/components/project/ProjectDropdownMenu'

const EmptyPerkMessage = () => {
  const { push } = useRouter()

  return (
    <Card
      withBorder
      radius={'lg'}
      padding={'xl'}
    >
      <Center>
        <Box
          maw={600}
          py={40}
        >
          <Text
            fw={'bold'}
            size="xl"
            align={'center'}
            mb={'md'}
          >
            You don’t have projects
          </Text>
          <Group
            position={'center'}
            sx={{ fontSize: 53 }}
            mb={'md'}
          >
            <Text>🐶</Text>
            <Text>✨</Text>
          </Group>
          <Button
            fullWidth
            variant="outline"
            radius="xl"
            onClick={() => void push('/dashboard/project/new')}
          >
            Start creating
          </Button>
        </Box>
      </Center>
    </Card>
  )
}

type ProjectStatusFilter = 'published' | 'draft' | 'in-review' | 'all'

export const ProjectList = () => {
  const [status, setStatus] = useState('all')
  const { data, isLoading } = api.project.list.useQuery()

  const filterOptions: { label: string; value: ProjectStatusFilter }[] = [
    { label: '🔥 All', value: 'all' },
    { label: '✨ Published', value: 'published' },
    { label: '📄 In Review', value: 'in-review' },
    { label: '✏️ Draft', value: 'draft' },
  ]

  const filteredProjects =
    data?.projects.filter(perk => {
      if (status === 'all') {
        return true
      }
      if (status === 'draft') {
        return perk.status === 'Draft'
      }
      if (status === 'in-review') {
        return perk.status === 'InReview'
      }
      if (status === 'published') {
        return perk.status === 'Published'
      }
      return false
    }) ?? []

  const router = useRouter()

  const projects = (
    <SimpleGrid
      cols={4}
      spacing="lg"
      breakpoints={[
        { maxWidth: 'xl', cols: 2, spacing: 'sm' },
        { maxWidth: 'xs', cols: 1, spacing: 'sm' },
      ]}
    >
      {filteredProjects.map(project => {
        return (
          <Card
            key={project.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            sx={{ cursor: 'pointer', alignSelf: 'stretch' }}
            onClick={() => {
              if (project.status === 'Draft') {
                void router.push(`/dashboard/project/edit/${project.id}`)
              } else {
                void router.push(`/dashboard/project/${project.id}`)
              }
            }}
          >
            <Group
              position={'apart'}
              align={'flex-start'}
            >
              <Avatar
                src={project.logoUrl}
                alt="logo image"
                radius="50%"
                size="xl"
              />
              <Group>
                <ProjectStatusBadge status={project.status} />
                <ProjectDropdownMenu id={project.id} />
              </Group>
            </Group>
            <Space h={'md'} />
            <Text
              weight={500}
              lineClamp={1}
              truncate
              size={'xl'}
              mt={'xs'}
            >
              {project.name}
            </Text>
            <Text
              lineClamp={4}
              mt={'xs'}
              color={'dimmed'}
            >
              {project.description}
            </Text>
            <Group mt={'md'}>
              <Badge>{project.projectStage}</Badge>
              <Badge>{project.blockchain}</Badge>
              {project.categories.map((category, index) => (
                <Badge key={index}>{category}</Badge>
              ))}
            </Group>
          </Card>
        )
      })}
    </SimpleGrid>
  )

  return (
    <Box>
      <SegmentedControl
        mb={'md'}
        value={status}
        onChange={setStatus}
        data={filterOptions}
      />
      {isLoading && (
        <Box>
          <Loader size="md" />
        </Box>
      )}
      {data?.projects?.length === 0 && <EmptyPerkMessage />}
      {data && projects}
    </Box>
  )
}
