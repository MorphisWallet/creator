import Head from 'next/head'
import { ProjectForm } from '@/components/project/ProjectForm'
import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { Alert, Center, Loader } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

export default function ProjectEdit() {
  const { query } = useRouter()

  const { data, isLoading, error } = api.project.getProjectById.useQuery(
    {
      id: query.id as string,
    },
    {
      retry: false,
      enabled: Boolean(query.id),
    }
  )

  return (
    <Layout>
      <Head>
        <title>Kiosk Creator - Project</title>
      </Head>
      {error && (
        <Center mt={'md'}>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error!"
            color="red"
          >
            {error.message}
          </Alert>
        </Center>
      )}
      {isLoading && (
        <Center mt={'md'}>
          <Loader
            color={'red'}
            size={40}
          />
        </Center>
      )}
      {data?.project && <ProjectForm project={data.project} />}
    </Layout>
  )
}
