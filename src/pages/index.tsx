import { Center, Loader } from '@mantine/core'
import Head from 'next/head'
import { Layout } from '@/components/layout/Layout'
import { useSession } from 'next-auth/react'
import { Project } from '@/components/project/Project'
import { Login } from '@/components/login/Login'

export default function Home() {
  const { status } = useSession()

  return (
    <Layout>
      <Head>
        <title>Kiosk Creator</title>
      </Head>
      {status === 'loading' && (
        <Center mt={60}>
          <Loader
            color={'red'}
            size={40}
          />
        </Center>
      )}
      {status === 'authenticated' && <Project />}
      {status === 'unauthenticated' && <Login />}
    </Layout>
  )
}
