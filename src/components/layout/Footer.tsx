import { Box, Container, Grid, Group, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Link from 'next/link'

const Logo = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 1.73205C20.8564 0.660254 23.1436 0.660254 25 1.73205L38.0526 9.26795C39.909 10.3397 41.0526 12.3205 41.0526 14.4641V29.5359C41.0526 31.6795 39.909 33.6603 38.0526 34.7321L25 42.2679C23.1436 43.3397 20.8564 43.3397 19 42.2679L5.94744 34.7321C4.09104 33.6603 2.94744 31.6795 2.94744 29.5359V14.4641C2.94744 12.3205 4.09103 10.3397 5.94744 9.26795L19 1.73205Z"
      fill="white"
    />
    <rect
      x="13.1997"
      y="29.04"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="13.1997"
      y="25.52"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="16.7197"
      y="22.001"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="20.2402"
      y="22.001"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="27.2793"
      y="29.04"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="23.7603"
      y="25.52"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="13.1997"
      y="18.481"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="13.1997"
      y="14.9604"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="13.1997"
      y="11.4404"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="20.2402"
      y="18.481"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="23.7603"
      y="14.9604"
      width="3.52"
      height="3.52"
      fill="black"
    />
    <rect
      x="27.2793"
      y="11.4404"
      width="3.52"
      height="3.52"
      fill="black"
    />
  </svg>
)

export const Footer = () => {
  const largeScreen = useMediaQuery('(min-width: 64em)')

  return (
    <Box
      sx={{
        borderTop: '1px solid #D9D9D9',
      }}
      py={30}
      mt={20}
    >
      <Container
        size={'lg'}
        w={'100%'}
        px={'md'}
      >
        <Grid>
          <Grid.Col
            xs={12}
            md={2}
          >
            <Link href={'/'}>
              <Logo />
            </Link>
          </Grid.Col>
          <Grid.Col
            xs={12}
            md={8}
            sx={{
              alignSelf: 'center',
            }}
          >
            <Group
              sx={{
                fontSize: 14,
                color: '#FFFFFF',
              }}
              fw={500}
              position={largeScreen ? 'center' : 'left'}
              spacing={largeScreen ? 56 : 23}
            >
              <a href="https://twitter.com/tbkiosk">TWITTER</a>
              <a href="https://tbkiosk.xyz">SUPPORT</a>
              <a href="https://tbkiosk.xyz">MAIN WEBSITE</a>
            </Group>
          </Grid.Col>
          <Grid.Col
            xs={12}
            md={2}
            sx={{
              alignSelf: 'center',
            }}
          >
            <Text
              fw={500}
              size={'sm'}
              color={'#A6A9AE'}
            >
              @2023 Morphis labs
            </Text>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  )
}
