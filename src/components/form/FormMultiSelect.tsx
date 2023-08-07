import { MultiSelect } from '@mantine/core'
import React from 'react'
import { DropdownIcon } from '@/components/form/DropdownIcon'

export const FormMultiSelect = (props: React.ComponentProps<typeof MultiSelect>) => {
  return (
    <MultiSelect
      transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
      rightSection={<DropdownIcon />}
      radius={12}
      styles={{
        input: {
          padding: '9px 16px',
          border: 'none',
          paddingLeft: '16px',
          color: '#E6E6E6',
          fontSize: '16px',
        },
        searchInput: {
          fontSize: '16px',
        },
        rightSection: {
          right: '12px',
        },
      }}
      {...props}
    ></MultiSelect>
  )
}
