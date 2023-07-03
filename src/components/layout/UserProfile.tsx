import { Avatar, Group, Text } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { isAddress } from 'viem'
import { maskAddress } from '@/utils/address'

const displayUserName = (username?: string | null) => {
  if (username && isAddress(username)) {
    return maskAddress(username)
  }
  return username
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
      <Text>{displayUserName(data?.user?.name)}</Text>
    </Group>
  )
}
