import { getSession, signIn } from 'next-auth/react'
import { type GetServerSideProps } from 'next'
import { Button, Group, Space, Stack, Text } from '@mantine/core'
import { IconBrandDiscord, IconBrandTwitter, IconCheck, IconCurrencyEthereum } from '@tabler/icons-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { prisma } from '@/server/db'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useSignMessage } from 'wagmi'
import { api } from '@/utils/api'
import { EthereumVerificationMessage } from '@/constants'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { useDidUpdate } from '@mantine/hooks'
import Head from 'next/head'
import { ProjectInfo, type ProjectInfoProps } from '@/components/project/ProjectInfo'

type Props = {
  providers: string[]
  project: ProjectInfoProps
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const providers = await prisma.account.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      provider: true,
    },
  })

  const project = await prisma.project.findUnique({
    where: {
      userId: session.user.id,
    },
  })

  return {
    props: {
      providers: providers.map(provider => provider.provider),
      project: {
        name: project?.name ?? '',
        description: project?.description ?? '',
        link: project?.link ?? '',
      },
    },
  }
}

export default function Project({ providers, project }: Props) {
  const callbackUrl = '/dashboard/project'
  const isTwitterVerified = providers.some(provider => provider === 'twitter')
  const isDiscordVerified = providers.some(provider => provider === 'discord')
  const [isAddressVerified, setIsAddressVerified] = useState(false)
  const isEthereumVerified = providers.some(provider => provider === 'Ethereum') || isAddressVerified
  const { openConnectModal } = useConnectModal()
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const { isConnected, address } = useAccount()
  const { signMessageAsync, isLoading: isSigningMessage } = useSignMessage()
  const { mutate, isLoading: isMakingRequestToSignMessage } = api.auth.verifyEthereumAddress.useMutation({
    onError: error => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    },
    onSuccess: data => {
      setIsAddressVerified(true)
      notifications.show({
        title: 'Success',
        message: data.message,
        color: 'green',
      })
    },
  })

  const handleLogin = async () => {
    if (address) {
      try {
        const signature = await signMessageAsync({ message: EthereumVerificationMessage })
        mutate({
          address: address,
          signature: signature,
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleConnectEthereum = () => {
    if (isConnected) {
      void handleLogin()
    } else if (openConnectModal) {
      openConnectModal()
      setIsConnectingWallet(true)
    }
  }
  useDidUpdate(() => {
    if (isConnectingWallet && isConnected) {
      void handleLogin()
    }
  }, [isConnected, isConnectingWallet])

  return (
    <DashboardLayout>
      <Head>
        <title>Airdawg - Project</title>
      </Head>
      <h1>Project</h1>
      <Stack w={'350px'}>
        {isTwitterVerified ? (
          <Group>
            <IconBrandTwitter />
            <Text>Twitter Verified</Text>
            <IconCheck />
          </Group>
        ) : (
          <Button
            leftIcon={<IconBrandTwitter />}
            onClick={() => void signIn('twitter', { callbackUrl })}
          >
            Verify Twitter
          </Button>
        )}
        {isDiscordVerified ? (
          <Group>
            <IconBrandDiscord />
            <Text>Discord Verified</Text>
            <IconCheck />
          </Group>
        ) : (
          <Button
            color={'grape'}
            leftIcon={<IconBrandDiscord />}
            onClick={() => void signIn('discord', { callbackUrl })}
          >
            Verify Discord
          </Button>
        )}
        {isEthereumVerified ? (
          <Group>
            <IconCurrencyEthereum />
            <Text>Wallet Address Verified</Text>
            <IconCheck />
          </Group>
        ) : (
          <Button
            leftIcon={<IconCurrencyEthereum />}
            onClick={handleConnectEthereum}
            color={'indigo'}
            loading={isSigningMessage || isMakingRequestToSignMessage}
          >
            Verify Ethereum Address
          </Button>
        )}
      </Stack>
      <Space h={'md'} />
      <ProjectInfo {...project} />
    </DashboardLayout>
  )
}
