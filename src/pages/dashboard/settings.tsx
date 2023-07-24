import { Box } from '@mantine/core'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Head from 'next/head'
import { AccountConnect } from '@/components/project/AccountConnect'

export default function Settings() {
  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Settings</title>
      </Head>
      <h1>Settings</h1>
      <Box w={550}>
        <AccountConnect />
      </Box>
    </DashboardLayout>
  )
}
