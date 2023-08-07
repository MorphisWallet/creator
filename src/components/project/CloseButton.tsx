import { Box } from '@mantine/core'
import React from 'react'

export const CloseButton = (props: React.ComponentProps<typeof Box<'div'>>) => {
  return (
    <Box
      sx={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer' }}
      {...props}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="40"
          height="40"
          rx="20"
          transform="matrix(-1 0 0 1 40 0)"
          fill="white"
          fillOpacity="0.6"
        />
        <path
          d="M26 14L14 26"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 14L26 26"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  )
}
