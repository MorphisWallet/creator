import { type GetServerSidePropsContext, type NextPage } from 'next'
import { getSession, signIn } from 'next-auth/react'
import Head from 'next/head'
import { Button, Center, Container, Stack } from '@mantine/core'
import { IconBrandTwitter, IconCurrencyEthereum, IconBrandDiscord } from '@tabler/icons-react'
import Image from 'next/image'
import LogoImage from '@/assets/images/airdawg-logo.png'

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
  const callbackUrl = '/dashboard/project'

  return (
    <>
      <Head>
        <title>Airdawg Creator</title>
        <meta
          name="description"
          content=">Airdawg Creator"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
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
          />
        </Center>
        <Stack mt={16}>
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
            variant="outline"
            disabled
          >
            Sign in with Ethereum(WIP)
          </Button>
        </Stack>
      </Container>
    </>
  )
}

export default Home
