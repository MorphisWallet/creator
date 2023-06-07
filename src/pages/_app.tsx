import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { api } from '@/utils/api'
import '@/styles/globals.css'
import { MantineProvider } from '@mantine/core'
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

const { chains, publicClient } = configureChains(
  [mainnet, polygon, bsc],
  [alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'AirDawg Creator',
  projectId: 'airdawg-creator',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to AirDawg Creator',
})

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={emotionCache}
        >
          <Notifications position="top-right" />
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider
              chains={chains}
              modalSize={'compact'}
            >
              <Component {...pageProps} />
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </MantineProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}

export default api.withTRPC(MyApp)
