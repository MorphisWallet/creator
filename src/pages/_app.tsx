import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { api } from '@/utils/api'
import '@/styles/globals.css'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { emotionCache } from '@/utils/emotion-cache'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { bsc, mainnet, polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { Notifications } from '@mantine/notifications'
import { type GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@/providers/RainbowKitSiweNextAuthProvider'
import { env } from '@/env.mjs'
import localFont from 'next/font/local'

const { chains, publicClient } = configureChains(
  [mainnet, polygon, bsc],
  [alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Kiosk Creator',
  projectId: '321bbd837e6b150263cbd24c5a92b541',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to Kiosk Creator',
})

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
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={emotionCache}
          theme={{
            colorScheme: 'dark',
            colors: {
              dark: ['#d5d7e0', '#acaebf', '#8c8fa3', '#666980', '#4d4f66', '#34354a', '#2b2c3d', '#141414', '#1A1A1A', '#01010a'],
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
            <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
              <RainbowKitProvider
                chains={chains}
                modalSize={'compact'}
              >
                <Component {...pageProps} />
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </ModalsProvider>
        </MantineProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}

export default api.withTRPC(MyApp)
