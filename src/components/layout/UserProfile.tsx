import { Avatar, Group, Text } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { isAddress } from 'viem'

const maskWalletAddress = (address?: string | null) => {
  if (address && isAddress(address)) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  return address
}

export const UserProfile = () => {
  const { data } = useSession()

  return (
    <Group position="right">
      <Avatar
        src={data?.user?.image}
        alt="avatar"
        radius={'xl'}
      />
      <Text>{maskWalletAddress(data?.user?.name)}</Text>
    </Group>
  )
}
