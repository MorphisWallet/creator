import React from 'react'
import { Box } from '@mantine/core'

type FormLayoutProps = {
  children: React.ReactNode
}

export const FormLayout = ({ children }: FormLayoutProps) => {
  return (
    <Box
      sx={{
        border: '1px solid #2F2F2F',
        borderRadius: 24,
      }}
      p={{
        xs: 24,
        md: 48,
      }}
    >
      {children}
    </Box>
  )
}
