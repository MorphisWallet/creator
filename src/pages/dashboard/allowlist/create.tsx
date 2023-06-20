import Head from 'next/head'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Group, ActionIcon } from '@mantine/core'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { AllowListPerkForm } from '@/components/perk/AllowListPerkForm'
dayjs.extend(utc)

export default function CreateAllowlist() {
  const { push } = useRouter()
  const goBack = () => push('/dashboard/perks')

  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Create Allowlist</title>
      </Head>
      <Group>
        <ActionIcon
          variant="outline"
          radius="xl"
          onClick={() => void goBack()}
        >
          <IconArrowLeft size="1rem" />
        </ActionIcon>
        <h1>Create an allowlist perk</h1>
      </Group>
      <AllowListPerkForm />
    </DashboardLayout>
  )
}
