import { Input } from '@mantine/core'
import React from 'react'

export const FormInput = (props: React.ComponentProps<typeof Input<'input'>>) => {
  return (
    <Input
      radius={12}
      styles={{
        input: {
          height: '52px',
          border: 'none',
          paddingLeft: '16px',
          color: '#E6E6E6',
          fontSize: '16px',
          '&[data-with-icon]': {
            paddingLeft: '48px',
          },
        },
        icon: {
          left: '12px',
        },
      }}
      {...props}
    />
  )
}
