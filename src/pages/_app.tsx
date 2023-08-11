import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { api } from '@/utils/api'
import '@/styles/globals.css'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { emotionCache } from '@/utils/emotion-cache'
import '@rainbow-me/rainbowkit/styles.css'
import { Notifications } from '@mantine/notifications'
import localFont from 'next/font/local'

const cera = localFont({
  src: [
    {
      path: '../assets/fonts/Cera-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Cera-Variable-Italic.woff2',
      style: 'italic',
    },
  ],
})

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus
      refetchInterval={20}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={emotionCache}
        theme={{
          colorScheme: 'dark',
          colors: {
            dark: ['#d5d7e0', '#acaebf', '#8c8fa3', '#666980', '#4d4f66', '#34354a', '#2F2F2F', '#141414', '#1A1A1A', '#01010a'],
            white: ['#FFFFFF', '#E6E6E6'],
          },
          fontFamily: `${cera.style.fontFamily}, sans-serif`,
          components: {
            Container: {
              defaultProps: {
                sizes: {
                  xs: 540,
                  sm: 720,
                  md: 960,
                  lg: 1074,
                  xl: 1440,
                },
              },
            },
          },
        }}
      >
        <ModalsProvider>
          <Notifications position="top-right" />
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
