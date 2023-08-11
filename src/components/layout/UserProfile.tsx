import { Avatar, Box, Group, Menu, Text } from '@mantine/core'
import { signOut, useSession } from 'next-auth/react'
import { maskAddress } from '@/utils/address'
import { isAddress } from 'viem'
import React from 'react'
import Link from 'next/link'

const EthIcon = (
  <svg
    width="12"
    height="20"
    viewBox="0 0 12 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.4248 10.1875L5.71429 13.8125L0 10.1875L5.71429 0L11.4248 10.1875ZM5.71429 14.9766L0 11.3516L5.71429 20L11.4286 11.3516L5.71429 14.9766Z"
      fill="#E6E6E6"
    />
  </svg>
)

export const UserProfile = () => {
  const { data } = useSession()

  if (!data) {
    return null
  }

  let name = data.user?.name ?? 'loading...'
  const avatarUrl = data?.user?.image

  if (isAddress(name ?? '')) {
    name = maskAddress(name ?? '')
  }

  return (
    <Menu
      shadow="md"
      width={150}
      position={'bottom'}
    >
      <Menu.Target>
        <Box
          px={16}
          sx={{
            borderRadius: '12px',
            border: '1px solid #454545',
            backgroundColor: '#2F2F2F',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <Group>
            {avatarUrl ? (
              <Avatar
                src={avatarUrl}
                alt="avatar"
                radius="xl"
                size={20}
              />
            ) : (
              EthIcon
            )}
            <Text
              color={'white.1'}
              fw={500}
              size={15}
            >
              {name}
            </Text>
          </Group>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Link href={'/settings'}>
          <Menu.Item>Setting</Menu.Item>
        </Link>
        {data.user?.role === 'Admin' && (
          <Link href={'/admin'}>
            <Menu.Item>Admin</Menu.Item>
          </Link>
        )}
        <Menu.Item
          onClick={() => {
            void signOut({
              callbackUrl: `${window.location.origin}`,
            })
          }}
        >
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
