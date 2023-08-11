import { Box, Text } from '@mantine/core'
import Head from 'next/head'
import { AccountConnect } from '@/components/settings/AccountConnect'
import { Layout } from '@/components/layout/Layout'
import { WalletLoginProviders } from '@/providers/WalletLoginProviders'

export default function Settings() {
  return (
    <Layout>
      <Head>
        <title>Kiosk - Settings</title>
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
        <WalletLoginProviders>
          <AccountConnect />
        </WalletLoginProviders>
      </Box>
    </Layout>
  )
}
