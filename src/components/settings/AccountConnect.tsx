import { Button, Card, Group, Skeleton, Stack, Text } from '@mantine/core'
import { signIn, useSession } from 'next-auth/react'
import { maskAddress } from '@/utils/address'
import { useState } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useSignMessage } from 'wagmi'
import { api } from '@/utils/api'
import { notifications } from '@mantine/notifications'
import { EthereumVerificationMessage } from '@/constants'
import { useDidUpdate } from '@mantine/hooks'
import { WalletLoginProviders } from '@/providers/WalletLoginProviders'

export const AccountOptions = () => {
  const { data, update, status } = useSession()
  const isLoading = status === 'loading'
  const callbackUrl = '/'
  const twitterUserName = data?.user?.twitter?.username
  const discordUserName = data?.user?.discord?.username
  const ethereumAddress = data?.user?.address

  const [isAddressVerified, setIsAddressVerified] = useState(false)
  const isEthereumVerified = ethereumAddress || isAddressVerified
  const { openConnectModal } = useConnectModal()
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const { isConnected, address } = useAccount()
  const { signMessageAsync, isLoading: isSigningMessage } = useSignMessage()
  const { mutate, isLoading: isMakingRequestToSignMessage } = api.auth.verifyEthereumAddress.useMutation({
    onError: error => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    },
    onSuccess: data => {
      setIsAddressVerified(true)
      notifications.show({
        title: 'Success',
        message: data.message,
        color: 'green',
      })
      void update({
        address: address,
      })
    },
  })

  const handleLogin = async () => {
    if (address) {
      try {
        const signature = await signMessageAsync({ message: EthereumVerificationMessage })
        mutate({
          address: address,
          signature: signature,
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleConnectEthereum = () => {
    if (isConnected) {
      void handleLogin()
    } else if (openConnectModal) {
      openConnectModal()
      setIsConnectingWallet(true)
    }
  }
  useDidUpdate(() => {
    if (isConnectingWallet && isConnected) {
      void handleLogin()
    }
  }, [isConnected, isConnectingWallet])

  return (
    <Stack>
      <Card
        padding="xs"
        radius="md"
        withBorder
      >
        <Skeleton visible={isLoading}>
          <Group position="apart">
            <Group>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2421_7478)">
                  <path
                    d="M22 5.79917C21.2642 6.12583 20.4733 6.34583 19.6433 6.445C20.4908 5.9375 21.1417 5.13333 21.4475 4.175C20.655 4.645 19.7767 4.98667 18.8417 5.17083C18.0942 4.37333 17.0267 3.875 15.8467 3.875C13.1975 3.875 11.2508 6.34667 11.8492 8.9125C8.44 8.74167 5.41667 7.10833 3.3925 4.62583C2.3175 6.47 2.835 8.8825 4.66167 10.1042C3.99 10.0825 3.35667 9.89833 2.80417 9.59083C2.75917 11.4917 4.12167 13.27 6.095 13.6658C5.5175 13.8225 4.885 13.8592 4.24167 13.7358C4.76333 15.3658 6.27833 16.5517 8.075 16.585C6.35 17.9375 4.17667 18.5417 2 18.285C3.81583 19.4492 5.97333 20.1283 8.29 20.1283C15.9083 20.1283 20.2125 13.6942 19.9525 7.92333C20.7542 7.34417 21.45 6.62167 22 5.79917Z"
                    fill="#1DA1F2"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2421_7478">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(2 2)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <Text>{twitterUserName || 'Connect Twitter'}</Text>
            </Group>
            {!twitterUserName && (
              <Button
                variant="subtle"
                onClick={() => void signIn('twitter', { callbackUrl })}
              >
                Connect
              </Button>
            )}
          </Group>
        </Skeleton>
      </Card>
      <Card
        padding="xs"
        radius="md"
        withBorder
      >
        <Skeleton visible={isLoading}>
          <Group position="apart">
            <Group>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 8.7C1.5 6.17976 1.5 4.91965 1.99047 3.95704C2.4219 3.11031 3.11031 2.4219 3.95704 1.99047C4.91965 1.5 6.17976 1.5 8.7 1.5H15.3C17.8202 1.5 19.0804 1.5 20.043 1.99047C20.8897 2.4219 21.5781 3.11031 22.0095 3.95704C22.5 4.91965 22.5 6.17976 22.5 8.7V15.3C22.5 17.8202 22.5 19.0804 22.0095 20.043C21.5781 20.8897 20.8897 21.5781 20.043 22.0095C19.0804 22.5 17.8202 22.5 15.3 22.5H8.7C6.17976 22.5 4.91965 22.5 3.95704 22.0095C3.11031 21.5781 2.4219 20.8897 1.99047 20.043C1.5 19.0804 1.5 17.8202 1.5 15.3V8.7Z"
                  fill="url(#paint0_linear_2421_7472)"
                />
                <path
                  d="M18.2064 7.52C17.0711 6.56 15.7087 6.08 14.2706 6L14.0436 6.24C15.3303 6.56 16.4656 7.2 17.5252 8.08C16.2385 7.36 14.8005 6.88 13.2867 6.72C12.8326 6.64 12.4541 6.64 12 6.64C11.5459 6.64 11.1674 6.64 10.7133 6.72C9.19954 6.88 7.76147 7.36 6.47477 8.08C7.5344 7.2 8.66972 6.56 9.95642 6.24L9.72936 6C8.29128 6.08 6.9289 6.56 5.79358 7.52C4.50688 10.08 3.82569 12.96 3.75 15.92C4.88532 17.2 6.47477 18 8.13991 18C8.13991 18 8.66972 17.36 9.04817 16.8C8.06422 16.56 7.15596 16 6.55046 15.12C7.08028 15.44 7.61009 15.76 8.13991 16C8.8211 16.32 9.50229 16.48 10.1835 16.64C10.789 16.72 11.3945 16.8 12 16.8C12.6055 16.8 13.211 16.72 13.8165 16.64C14.4977 16.48 15.1789 16.32 15.8601 16C16.3899 15.76 16.9197 15.44 17.4495 15.12C16.844 16 15.9358 16.56 14.9518 16.8C15.3303 17.36 15.8601 18 15.8601 18C17.5252 18 19.1147 17.2 20.25 15.92C20.1743 12.96 19.4931 10.08 18.2064 7.52ZM9.50229 14.48C8.74541 14.48 8.06422 13.76 8.06422 12.88C8.06422 12 8.74541 11.28 9.50229 11.28C10.2592 11.28 10.9404 12 10.9404 12.88C10.9404 13.76 10.2592 14.48 9.50229 14.48ZM14.4977 14.48C13.7408 14.48 13.0596 13.76 13.0596 12.88C13.0596 12 13.7408 11.28 14.4977 11.28C15.2546 11.28 15.9358 12 15.9358 12.88C15.9358 13.76 15.2546 14.48 14.4977 14.48Z"
                  fill="white"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_2421_7472"
                    x1="12"
                    y1="1.5"
                    x2="12"
                    y2="22.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#687EC9" />
                    <stop
                      offset="1"
                      stopColor="#5971C3"
                    />
                  </linearGradient>
                </defs>
              </svg>

              <Text>{discordUserName || 'Connect Discord'}</Text>
            </Group>
            {!discordUserName && (
              <Button
                variant="subtle"
                onClick={() => void signIn('discord', { callbackUrl })}
              >
                Connect
              </Button>
            )}
          </Group>
        </Skeleton>
      </Card>
      <Card
        padding="xs"
        radius="md"
        withBorder
      >
        <Skeleton visible={isLoading}>
          <Group position="apart">
            <Group>
              <svg
                width="24px"
                height="24px"
                viewBox="-80.5 0 417 417"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <g>
                  <polygon
                    fill="#343434"
                    points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32"
                  />
                  <polygon
                    fill="#8C8C8C"
                    points="127.962 0 0 212.32 127.962 287.959 127.962 154.158"
                  />
                  <polygon
                    fill="#3C3C3B"
                    points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866"
                  />
                  <polygon
                    fill="#8C8C8C"
                    points="127.962 416.9052 127.962 312.1852 0 236.5852"
                  />
                  <polygon
                    fill="#141414"
                    points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587"
                  />
                  <polygon
                    fill="#393939"
                    points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588"
                  />
                </g>
              </svg>

              <Text>{ethereumAddress ? maskAddress(ethereumAddress) : 'Connect Ethereum'}</Text>
            </Group>
            {!isEthereumVerified && (
              <Button
                variant="subtle"
                onClick={handleConnectEthereum}
                loading={isSigningMessage || isMakingRequestToSignMessage}
              >
                Connect
              </Button>
            )}
          </Group>
        </Skeleton>
      </Card>
    </Stack>
  )
}

export const AccountConnect = () => {
  return (
    <WalletLoginProviders>
      <AccountOptions />
    </WalletLoginProviders>
  )
}

export default AccountConnect
