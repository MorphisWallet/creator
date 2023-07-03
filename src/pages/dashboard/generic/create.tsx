import Head from 'next/head'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Group, ActionIcon } from '@mantine/core'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { GenericPerkForm } from '@/components/perk/GenericPerkForm'
dayjs.extend(utc)

export default function CreateGenericPerk() {
  const { push } = useRouter()
  const goBack = () => push('/dashboard/template')

  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Create a perk</title>
      </Head>
      <Group>
        <ActionIcon
          variant="outline"
          radius="xl"
          onClick={() => void goBack()}
        >
          <IconArrowLeft size="1rem" />
        </ActionIcon>
        <h1>Create a perk</h1>
      </Group>
      <GenericPerkForm />
    </DashboardLayout>
  )
}
