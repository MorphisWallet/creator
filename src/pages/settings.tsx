import { Box, Loader, Text } from '@mantine/core'
import Head from 'next/head'
import { Layout } from '@/components/layout/Layout'
import dynamic from 'next/dynamic'

const AccountConnect = dynamic(() => import('@/components/settings/AccountConnect'), {
  loading: () => (
    <Loader
      color={'red'}
      size={40}
      mt={20}
    />
  ),
})

export default function Settings() {
  return (
    <Layout>
      <Head>
        <title>Kiosk Creator - Setting</title>
      </Head>
      <Text
        size={42}
        fw={700}
        mt={50}
        mb={40}
        color={'white.1'}
      >
        Settings
      </Text>
      <Box w={550}>
        <AccountConnect />
      </Box>
    </Layout>
  )
}
