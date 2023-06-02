import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { api } from '@/utils/api'
import '@/styles/globals.css'
import { MantineProvider } from '@mantine/core'
import { rtlCache } from '@/utils/rtl-cache'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { bsc, mainnet, polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { type GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import '@rainbow-me/rainbowkit/styles.css'

const { chains, publicClient } = configureChains(
  [mainnet, polygon, bsc],
  [alchemyProvider({ apiKey: 'xWKRsnhQ3Jeql1pwk5YRacvcguBZPGtz' }), publicProvider()]
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
          emotionCache={rtlCache}
        >
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
