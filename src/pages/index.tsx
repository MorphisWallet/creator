import { Center, Loader } from '@mantine/core'
import Head from 'next/head'
import { Layout } from '@/components/layout/Layout'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'

const Spinner = () => {
  return (
    <Center my={60}>
      <Loader
        color={'red'}
        size={40}
      />
    </Center>
  )
}

const Login = dynamic(() => import('@/components/login/Login'), {
  loading: () => <Spinner />,
})

const Project = dynamic(() => import('@/components/project/Project'), {
  loading: () => <Spinner />,
})

export default function Home() {
  const { status } = useSession()

  return (
    <Layout>
      <Head>
        <title>Kiosk Creator</title>
      </Head>
      {status === 'loading' && <Spinner />}
      {status === 'authenticated' && <Project />}
      {status === 'unauthenticated' && <Login />}
    </Layout>
  )
}
