import { getSession, signOut } from 'next-auth/react'
import { type GetServerSidePropsContext } from 'next'
import { Button } from '@mantine/core'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}

export default function Project() {
  return (
    <div>
      <h1>Project</h1>
      <div>
        <Button
          onClick={() =>
            void signOut({
              callbackUrl: `${window.location.origin}`,
            })
          }
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
