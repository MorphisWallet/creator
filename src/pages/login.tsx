import { signIn } from 'next-auth/react'
import { Box, Button, Text } from '@mantine/core'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { Layout } from '@/components/layout/Layout'
import React from 'react'
import { type GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'

const DiscordIcon = () => (
  <svg
    width="19"
    height="15"
    viewBox="0 0 19 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.1917 0C12.0033 0.343549 11.8355 0.698345 11.689 1.06246C10.2501 0.830699 8.78444 0.830699 7.34556 1.06246C7.19912 0.698345 7.03128 0.343549 6.84293 0C5.48753 0.235867 4.16989 0.658278 2.92621 1.25563C0.702261 4.52442 -0.30632 8.49287 0.081143 12.4501C1.53046 13.5597 3.1571 14.4061 4.88931 14.9517C5.28375 14.4211 5.63577 13.859 5.94199 13.2711C5.37684 13.0589 4.83364 12.7903 4.3203 12.4694C4.46109 12.374 4.59428 12.2674 4.71861 12.1507C6.21555 12.885 7.85574 13.2664 9.5173 13.2664C11.1788 13.2664 12.819 12.885 14.316 12.1507C14.4488 12.2666 14.5815 12.3728 14.7143 12.4694C14.1982 12.7878 13.6555 13.0593 13.0926 13.2807C13.3861 13.882 13.7287 14.4571 14.1168 15C15.8469 14.4562 17.4707 13.6097 18.9155 12.4984C19.3123 8.54044 18.3029 4.56875 16.0704 1.30393C14.8407 0.694209 13.5361 0.255638 12.1917 0ZM6.36875 10.19C5.89418 10.1553 5.45126 9.93466 5.13297 9.57447C4.81468 9.21429 4.64577 8.74252 4.66171 8.25821C4.64337 7.77326 4.81144 7.30014 5.13021 6.93942C5.44897 6.57869 5.8933 6.35879 6.36875 6.32646C6.8442 6.35879 7.28853 6.57869 7.60729 6.93942C7.92606 7.30014 8.09413 7.77326 8.07579 8.25821C8.09413 8.74316 7.92606 9.21627 7.60729 9.577C7.28853 9.93773 6.8442 10.1576 6.36875 10.19ZM12.6658 10.19C12.1913 10.1553 11.7483 9.93466 11.4301 9.57447C11.1118 9.21429 10.9429 8.74252 10.9588 8.25821C10.9405 7.77326 11.1085 7.30014 11.4273 6.93942C11.7461 6.57869 12.1904 6.35879 12.6658 6.32646C13.1422 6.35638 13.5879 6.57556 13.9072 6.93684C14.2264 7.29812 14.3937 7.77262 14.3729 8.25821C14.3937 8.7438 14.2264 9.21829 13.9072 9.57957C13.5879 9.94085 13.1422 10.16 12.6658 10.19Z"
      fill="#E6E6E6"
    />
  </svg>
)

const TwitterIcon = () => (
  <svg
    width="18"
    height="15"
    viewBox="0 0 18 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 1.7971C17.3235 2.09753 16.6081 2.29614 15.876 2.38674C16.6484 1.9144 17.2271 1.17133 17.505 0.295371C16.7792 0.737656 15.9847 1.04927 15.156 1.21668C14.6021 0.601772 13.8645 0.192458 13.0588 0.0529306C12.2532 -0.0865966 11.4251 0.0515551 10.7044 0.445719C9.98373 0.839882 9.41124 1.46776 9.07672 2.23089C8.74219 2.99401 8.66456 3.84921 8.856 4.66236C7.38848 4.58638 5.953 4.19522 4.64279 3.51429C3.33258 2.83336 2.17696 1.87789 1.251 0.709959C0.926224 1.29054 0.755567 1.94803 0.756 2.61706C0.754848 3.23838 0.903795 3.85034 1.18958 4.39847C1.47536 4.9466 1.88912 5.41388 2.394 5.75872C1.80718 5.74237 1.2329 5.58118 0.72 5.28885V5.33492C0.724398 6.20545 1.02239 7.04771 1.56358 7.71923C2.10477 8.39074 2.85593 8.85029 3.69 9.02014C3.36893 9.12017 3.03559 9.1729 2.7 9.17677C2.4677 9.17399 2.23598 9.15242 2.007 9.11228C2.24452 9.86112 2.70416 10.5156 3.32197 10.9845C3.93977 11.4535 4.68502 11.7136 5.454 11.7288C4.15548 12.7747 2.5523 13.3455 0.9 13.3503C0.599162 13.3513 0.298562 13.3328 0 13.295C1.68699 14.41 3.65293 15.0019 5.661 14.9994C7.04672 15.0142 8.42142 14.7461 9.7048 14.2109C10.9882 13.6756 12.1545 12.884 13.1357 11.8822C14.1168 10.8804 14.8932 9.68845 15.4193 8.37606C15.9454 7.06368 16.2108 5.65712 16.2 4.23856C16.2 4.08194 16.2 3.91611 16.2 3.75027C16.9062 3.21113 17.5153 2.5502 18 1.7971Z"
      fill="#E6E6E6"
    />
  </svg>
)

const EthereumIcon = () => (
  <svg
    width="14"
    height="25"
    viewBox="0 0 14 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.7098 12.725L6.85714 17.075L0 12.725L6.85714 0.5L13.7098 12.725ZM6.85714 18.4719L0 14.1219L6.85714 24.5L13.7143 14.1219L6.85714 18.4719Z"
      fill="#E6E6E6"
    />
  </svg>
)

type LoginButtonProps = React.ComponentProps<typeof Button<'button'>>

const LoginButton = (props: LoginButtonProps) => {
  return (
    <Button
      color={'dark'}
      fullWidth
      sx={{
        boxShadow: '0px 18px 30px 0px #8377C61C',
      }}
      radius={20}
      h={53}
      styles={{
        leftIcon: {
          position: 'absolute',
          left: 21,
        },
      }}
      {...props}
    >
      <Text
        size={'md'}
        color={'#E6E6E6'}
        fw={700}
        sx={{
          lineHeight: '22px',
        }}
      >
        {props.children}
      </Text>
    </Button>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const token = await getToken({ req: context.req })
  if (token) {
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

const Login = () => {
  const callbackUrl = '/'
  const { openConnectModal } = useConnectModal()

  return (
    <>
      <Head>
        <title>Kiosk - Sign in</title>
      </Head>
      <Layout>
        <Box
          mt={168}
          sx={{
            borderRadius: '72px',
            border: '1px solid #E2E2EA',
            backgroundColor: '#E2E2EA',
            width: 620,
          }}
          mx={'auto'}
          px={94}
          pt={58}
          pb={100}
        >
          <svg
            width="159"
            height="44"
            viewBox="0 0 159 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 1.73205C20.8564 0.660254 23.1436 0.660254 25 1.73205L38.0526 9.26795C39.909 10.3397 41.0526 12.3205 41.0526 14.4641V29.5359C41.0526 31.6795 39.909 33.6603 38.0526 34.7321L25 42.2679C23.1436 43.3397 20.8564 43.3397 19 42.2679L5.94744 34.7321C4.09104 33.6603 2.94744 31.6795 2.94744 29.5359V14.4641C2.94744 12.3205 4.09103 10.3397 5.94744 9.26795L19 1.73205Z"
              fill="#ED3733"
            />
            <rect
              x="13.1992"
              y="29.0388"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="13.1992"
              y="25.5198"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="16.7183"
              y="22.0007"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="20.2417"
              y="22.0007"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="27.2842"
              y="29.0388"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="23.7607"
              y="25.5198"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="13.1992"
              y="18.481"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="13.1992"
              y="14.9592"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="13.1992"
              y="11.4395"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="20.2417"
              y="18.481"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="23.7607"
              y="14.9592"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <rect
              x="27.2842"
              y="11.4395"
              width="3.52"
              height="3.52"
              fill="#D9D9D9"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M58 12H61.2294V19.9889C61.2294 20.2582 61.4325 20.4613 61.7018 20.4613H66.1581C66.4274 20.4613 66.6306 20.2582 66.6306 19.9889V18.4659C66.6306 18.0019 66.9915 17.6409 67.4555 17.6409H69.035C69.3043 17.6409 69.5074 17.4378 69.5074 17.1685V15.6454C69.5074 15.1814 69.8684 14.8204 70.3324 14.8204H71.9118C72.1811 14.8204 72.3843 14.6173 72.3843 14.348V12.825C72.3843 12.361 72.7452 12 73.2092 12H74.7887C75.2527 12 75.6137 12.361 75.6137 12.825V14.348C75.6137 14.812 75.2527 15.173 74.7887 15.173H73.2375C72.9582 15.173 72.7368 15.3858 72.7368 15.6454V17.1685C72.7368 17.6325 72.3759 17.9934 71.9118 17.9934H70.3606C70.0814 17.9934 69.86 18.2062 69.86 18.4659V19.9889C69.86 20.4529 69.499 20.8139 69.035 20.8139H67.4555C67.1862 20.8139 66.9831 21.017 66.9831 21.2863V22.8094C66.9831 23.0787 67.1862 23.2818 67.4555 23.2818H69.035C69.499 23.2818 69.86 23.6427 69.86 24.1068V25.6298C69.86 25.8895 70.0814 26.1022 70.3606 26.1022H71.9118C72.3759 26.1022 72.7368 26.4632 72.7368 26.9272V28.4502C72.7368 28.7099 72.9582 28.9227 73.2375 28.9227H74.7887C75.2527 28.9227 75.6137 29.2836 75.6137 29.7476V31.2707C75.6137 31.7347 75.2527 32.0957 74.7887 32.0957H73.2092C72.7452 32.0957 72.3843 31.7347 72.3843 31.2707V29.7476C72.3843 29.4783 72.1811 29.2752 71.9118 29.2752H70.3324C69.8684 29.2752 69.5074 28.9143 69.5074 28.4502V26.9272C69.5074 26.6579 69.3043 26.4548 69.035 26.4548H67.4555C66.9915 26.4548 66.6306 26.0938 66.6306 25.6298V24.1068C66.6306 23.8375 66.4274 23.6343 66.1581 23.6343H61.7018C61.4325 23.6343 61.2294 23.8375 61.2294 24.1068V32.0957H58V24.1068C58 23.6427 58.361 23.2818 58.825 23.2818H60.4044C60.6737 23.2818 60.8769 23.0787 60.8769 22.8094V21.2863C60.8769 21.017 60.6737 20.8139 60.4044 20.8139H58.825C58.361 20.8139 58 20.4529 58 19.9889V12ZM79.8088 32.0957V28.9227H84.3251C84.5944 28.9227 84.7975 28.7195 84.7975 28.4502V15.6454C84.7975 15.3761 84.5944 15.173 84.3251 15.173H79.8088V12H84.3251C84.7891 12 85.1501 12.361 85.1501 12.825V14.348C85.1501 14.6173 85.3532 14.8204 85.6225 14.8204H87.2019C87.4712 14.8204 87.6744 14.6173 87.6744 14.348V12.825C87.6744 12.361 88.0353 12 88.4993 12H93.0156V15.173H88.4993C88.23 15.173 88.0269 15.3761 88.0269 15.6454V28.4502C88.0269 28.7195 88.23 28.9227 88.4993 28.9227H93.0156V32.0957H88.4993C88.0353 32.0957 87.6744 31.7347 87.6744 31.2707V29.7476C87.6744 29.4783 87.4712 29.2752 87.2019 29.2752H85.6225C85.3532 29.2752 85.1501 29.4783 85.1501 29.7476V31.2707C85.1501 31.7347 84.7891 32.0957 84.3251 32.0957H79.8088ZM136.633 17.9934H133.404V15.6454C133.404 15.3761 133.201 15.173 132.931 15.173H122.721C122.452 15.173 122.249 15.3761 122.249 15.6454V19.9889C122.249 20.2582 122.452 20.4613 122.721 20.4613H132.931C133.395 20.4613 133.756 20.8223 133.756 21.2863V22.8094C133.756 23.0787 133.96 23.2818 134.229 23.2818H135.808C136.272 23.2818 136.633 23.6427 136.633 24.1068V28.4502C136.633 28.9143 136.272 29.2752 135.808 29.2752H134.229C133.96 29.2752 133.756 29.4783 133.756 29.7476V31.2707C133.756 31.7347 133.395 32.0957 132.931 32.0957H122.721C122.257 32.0957 121.896 31.7347 121.896 31.2707V29.7476C121.896 29.4783 121.693 29.2752 121.424 29.2752H119.845C119.381 29.2752 119.02 28.9143 119.02 28.4502V26.1022H122.249V28.4502C122.249 28.7195 122.452 28.9227 122.721 28.9227H132.931C133.201 28.9227 133.404 28.7195 133.404 28.4502V24.1068C133.404 23.8375 133.201 23.6343 132.931 23.6343H122.721C122.257 23.6343 121.896 23.2734 121.896 22.8094V21.2863C121.896 21.017 121.693 20.8139 121.424 20.8139H119.845C119.381 20.8139 119.02 20.4529 119.02 19.9889V15.6454C119.02 15.1814 119.381 14.8204 119.845 14.8204H121.424C121.693 14.8204 121.896 14.6173 121.896 14.348V12.825C121.896 12.361 122.257 12 122.721 12H132.931C133.395 12 133.756 12.361 133.756 12.825V14.348C133.756 14.6173 133.96 14.8204 134.229 14.8204H135.808C136.272 14.8204 136.633 15.1814 136.633 15.6454V17.9934ZM140.828 12H144.058V19.9889C144.058 20.2582 144.261 20.4613 144.53 20.4613H148.987C149.256 20.4613 149.459 20.2582 149.459 19.9889V18.4659C149.459 18.0019 149.82 17.6409 150.284 17.6409H151.863C152.133 17.6409 152.336 17.4378 152.336 17.1685V15.6454C152.336 15.1814 152.697 14.8204 153.161 14.8204H154.74C155.01 14.8204 155.213 14.6173 155.213 14.348V12.825C155.213 12.361 155.574 12 156.038 12H157.617C158.081 12 158.442 12.361 158.442 12.825V14.348C158.442 14.812 158.081 15.173 157.617 15.173H156.066C155.787 15.173 155.565 15.3858 155.565 15.6454V17.1685C155.565 17.6325 155.204 17.9934 154.74 17.9934H153.189C152.91 17.9934 152.688 18.2062 152.688 18.4659V19.9889C152.688 20.4529 152.327 20.8139 151.863 20.8139H150.284C150.015 20.8139 149.812 21.017 149.812 21.2863V22.8094C149.812 23.0787 150.015 23.2818 150.284 23.2818H151.863C152.327 23.2818 152.688 23.6427 152.688 24.1068V25.6298C152.688 25.8895 152.91 26.1022 153.189 26.1022H154.74C155.204 26.1022 155.565 26.4632 155.565 26.9272V28.4502C155.565 28.7099 155.787 28.9227 156.066 28.9227H157.617C158.081 28.9227 158.442 29.2836 158.442 29.7476V31.2707C158.442 31.7347 158.081 32.0957 157.617 32.0957H156.038C155.574 32.0957 155.213 31.7347 155.213 31.2707V29.7476C155.213 29.4783 155.01 29.2752 154.74 29.2752H153.161C152.697 29.2752 152.336 28.9143 152.336 28.4502V26.9272C152.336 26.6579 152.133 26.4548 151.863 26.4548H150.284C149.82 26.4548 149.459 26.0938 149.459 25.6298V24.1068C149.459 23.8375 149.256 23.6343 148.987 23.6343H144.53C144.261 23.6343 144.058 23.8375 144.058 24.1068V32.0957H140.828V24.1068C140.828 23.6427 141.189 23.2818 141.653 23.2818H143.233C143.502 23.2818 143.705 23.0787 143.705 22.8094V21.2863C143.705 21.017 143.502 20.8139 143.233 20.8139H141.653C141.189 20.8139 140.828 20.4529 140.828 19.9889V12ZM100.913 32.0957C100.449 32.0957 100.088 31.7347 100.088 31.2707V29.7476C100.088 29.4783 99.8845 29.2752 99.6152 29.2752H98.0357C97.5717 29.2752 97.2107 28.9143 97.2107 28.4502V15.6454C97.2107 15.1814 97.5717 14.8204 98.0357 14.8204H99.6152C99.8845 14.8204 100.088 14.6173 100.088 14.348V12.825C100.088 12.361 100.449 12 100.913 12H111.123C111.587 12 111.948 12.361 111.948 12.825V14.348C111.948 14.6173 112.151 14.8204 112.42 14.8204H113.999C114.463 14.8204 114.824 15.1814 114.824 15.6454V28.4502C114.824 28.9143 114.463 29.2752 113.999 29.2752H112.42C112.151 29.2752 111.948 29.4783 111.948 29.7476V31.2707C111.948 31.7347 111.587 32.0957 111.123 32.0957H100.913ZM100.44 28.4502C100.44 28.7195 100.643 28.9227 100.913 28.9227H111.123C111.392 28.9227 111.595 28.7195 111.595 28.4502V15.6454C111.595 15.3761 111.392 15.173 111.123 15.173H100.913C100.643 15.173 100.44 15.3761 100.44 15.6454V28.4502Z"
              fill="#1A1A1A"
            />
          </svg>

          <Text
            mt={'md'}
            size={24}
            color={'#737375'}
            mb={47}
            fw={500}
          >
            Login to create a new project or manage your projects
          </Text>
          <LoginButton
            leftIcon={<EthereumIcon />}
            onClick={openConnectModal}
          >
            Login with Wallet
          </LoginButton>
          <Box
            sx={{
              height: '1px',
              background: '#1A1A1A',
            }}
            my={28}
          ></Box>
          <LoginButton
            leftIcon={<TwitterIcon />}
            onClick={() => void signIn('twitter', { callbackUrl })}
            mb={10}
          >
            Login with Twitter
          </LoginButton>
          <LoginButton
            leftIcon={<DiscordIcon />}
            onClick={() => void signIn('discord', { callbackUrl })}
          >
            Login with Discord
          </LoginButton>
        </Box>
      </Layout>
    </>
  )
}

export default Login
