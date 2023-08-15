import React from 'react'
import { emotionCache } from '@/utils/emotion-cache'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { MantineProvider } from '@mantine/core'
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

type Props = {
  children: React.ReactNode
}

export const MantineProviders = ({ children }: Props) => {
  return (
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
        breakpoints: {
          xs: '0em',
          sm: '48em',
          md: '64em',
          lg: '74em',
          xl: '90em',
        },
      }}
    >
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  )
}
