import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { api } from '@/utils/api'
import '@/styles/globals.css'
import { MantineProvider } from '@mantine/core'
import { rtlCache } from '@/utils/rtl-cache'

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={rtlCache}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
