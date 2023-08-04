import { Box, Text } from '@mantine/core'
import React from 'react'

type Props = {
  label: string
}

export const Tag = ({ label }: Props) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        borderRadius: 4,
        height: 20,
        background: '#303134',
        alignItems: 'center',
      }}
      px={6}
    >
      <Text
        color={'white.1'}
        fw={500}
        size={12}
      >
        {label}
      </Text>
    </Box>
  )
}
