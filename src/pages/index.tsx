import { type NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import { api } from '@/utils/api'
import { Button } from '@mantine/core'

const Home: NextPage = () => {
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
      <main>
        <p>
          <Button>Click me!</Button>
        </p>
        <AuthShowcase />
      </main>
    </>
  )
}

export default Home

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession()

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  )

  return (
    <div>
      <p>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button onClick={sessionData ? () => void signOut() : () => void signIn()}>{sessionData ? 'Sign out' : 'Sign in'}</button>
    </div>
  )
}
