import { type Perk } from '@prisma/client'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'
import Head from 'next/head'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ActionIcon, Group } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { PerkStatusBadge } from '@/components/perk/PerkStatusBadge'
import { GenericPerkForm } from '@/components/perk/GenericPerkForm'

type Props = {
  perk: Perk
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const id = context.params?.id
  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    }
  }

  const perk = await prisma.perk
    .findFirst({
      where: {
        id,
      },
    })
    .catch(() => null)

  if (!perk) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      perk,
    },
  }
}

export default function EditGenericPerk({ perk }: Props) {
  const isPublished = perk?.status === 'Published'
  const { push } = useRouter()

  const goBack = () => {
    if (isPublished) {
      void push(`/dashboard/generic/${perk?.id}`)
    } else {
      void push('/dashboard/perks')
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Generic Perk Edit Page</title>
      </Head>
      <Group align="center">
        <ActionIcon
          variant="outline"
          radius="xl"
          onClick={() => void goBack()}
        >
          <IconArrowLeft size="1rem" />
        </ActionIcon>
        <h1>{perk.name}</h1>
        <PerkStatusBadge
          status={perk.status}
          endDate={perk.endDate}
        />
      </Group>
      <GenericPerkForm perk={perk} />
    </DashboardLayout>
  )
}
