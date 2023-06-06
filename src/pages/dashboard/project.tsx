import { getSession, signIn } from 'next-auth/react'
import { type GetServerSideProps } from 'next'
import { Button, Group, Stack, Text } from '@mantine/core'
import { IconBrandDiscord, IconBrandTwitter, IconCheck, IconCurrencyEthereum } from '@tabler/icons-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { prisma } from '@/server/db'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useSignMessage } from 'wagmi'
import { api } from '@/utils/api'
import { EtherumVerificationMessage } from '@/constants'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { useDidUpdate } from '@mantine/hooks'
import Head from 'next/head'

type Props = {
  providers: string[]
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

  return {
    props: {
      providers: providers.map(provider => provider.provider),
    },
  }
}

export default function Project({ providers }: Props) {
  const callbackUrl = '/dashboard/project'
  const isTwitterVerified = providers.some(provider => provider === 'twitter')
  const isDiscordVerified = providers.some(provider => provider === 'discord')
  const [isAddressVerified, setIsAddressVerified] = useState(false)
  const isEtherumVerified = providers.some(provider => provider === 'Ethereum') || isAddressVerified
  const { openConnectModal } = useConnectModal()
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const { isConnected, address } = useAccount()
  const { signMessageAsync, isLoading: isSigningMessage } = useSignMessage()
  const { mutate, isLoading: isMakingRequestToSignMessage } = api.auth.verifyEtherumAddress.useMutation({
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
        const signature = await signMessageAsync({ message: EtherumVerificationMessage })
        mutate({
          address: address,
          signature: signature,
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleConnectEtherum = () => {
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
        {isEtherumVerified ? (
          <Group>
            <IconCurrencyEthereum />
            <Text>Wallet Address Verified</Text>
            <IconCheck />
          </Group>
        ) : (
          <Button
            leftIcon={<IconCurrencyEthereum />}
            onClick={handleConnectEtherum}
            color={'indigo'}
            loading={isSigningMessage || isMakingRequestToSignMessage}
          >
            Verify Ethereum Address
          </Button>
        )}
      </Stack>
    </DashboardLayout>
  )
}
