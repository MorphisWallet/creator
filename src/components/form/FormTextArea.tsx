import { Textarea } from '@mantine/core'
import React from 'react'

export const FormTextArea = (props: React.ComponentProps<typeof Textarea>) => {
  return (
    <Textarea
      radius={12}
      styles={{
        input: { border: 'none', padding: '16px!important', color: '#E6E6E6', fontSize: '16px' },
      }}
      minRows={6}
      {...props}
    />
  )
}
