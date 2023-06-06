import { type GetServerSidePropsContext, type NextPage } from 'next'
import { getSession, signIn, useSession } from 'next-auth/react'
import { Button, Center, Container, Stack } from '@mantine/core'
import { IconBrandTwitter, IconCurrencyEthereum, IconBrandDiscord } from '@tabler/icons-react'
import Image from 'next/image'
import LogoImage from '@/assets/images/airdawg-logo.png'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useDidUpdate } from '@mantine/hooks'
import { useRouter } from 'next/router'
import Head from 'next/head'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  // redirect user to dashboard if user has signed in
  if (session) {
    return {
      redirect: {
        destination: '/dashboard/project',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}

const Home: NextPage = () => {
  const callbackUrl = '/dashboard/perks'
  const { openConnectModal } = useConnectModal()

  /** handle sign in with ethereum with rainbowkit* */
  const { status } = useSession()
  const { push } = useRouter()
  useDidUpdate(() => {
    if (status === 'authenticated') {
      void push(callbackUrl)
    }
  }, [status])

  return (
    <>
      <Head>
        <title>Airdawg - Sign in</title>
      </Head>
      <Container
        size="xs"
        mt={140}
      >
        <Center>
          <Image
            src={LogoImage}
            width={270}
            height={152}
            alt="Logo of Airdawg Creator"
            priority
          />
        </Center>
        <Stack mt={32}>
          <Button
            leftIcon={<IconBrandTwitter />}
            onClick={() => void signIn('twitter', { callbackUrl })}
          >
            Sign in with Twitter
          </Button>
          <Button
            color={'grape'}
            leftIcon={<IconBrandDiscord />}
            onClick={() => void signIn('discord', { callbackUrl })}
          >
            Sign in with Discord
          </Button>
          <Button
            leftIcon={<IconCurrencyEthereum />}
            onClick={openConnectModal}
            color={'indigo'}
          >
            Sign in with Ethereum
          </Button>
        </Stack>
      </Container>
    </>
  )
}

export default Home
