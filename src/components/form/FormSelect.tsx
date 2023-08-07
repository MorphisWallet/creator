import { Select } from '@mantine/core'
import React from 'react'
import { DropdownIcon } from '@/components/form/DropdownIcon'

export const FormSelect = (props: React.ComponentProps<typeof Select>) => {
  return (
    <Select
      radius={12}
      transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
      rightSection={<DropdownIcon />}
      styles={{
        input: { height: '52px', border: 'none', paddingLeft: '16px', color: '#E6E6E6', fontSize: '16px' },
        rightSection: {
          right: '12px',
        },
      }}
      {...props}
    />
  )
}
