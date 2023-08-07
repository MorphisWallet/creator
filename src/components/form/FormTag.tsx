import { Box, Group, Text } from '@mantine/core'

type Props = {
  data: {
    value: string
    label: string
  }[]
  value: string
  onSelected: (value: string) => void
}

export const FormTag = ({ data, value, onSelected }: Props) => {
  return (
    <Group>
      {data.map(item => {
        const isActive = item.value === value
        return (
          <Box
            key={item.value}
            onClick={() => onSelected(item.value)}
            px={24}
            py={14}
            sx={{
              backgroundColor: isActive ? '#E2E2EA' : 'transparent',
              borderRadius: 40,
              cursor: 'pointer',
              borderColor: isActive ? '#E2E2EA' : '#FFFFFF33',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <Text
              size={18}
              color={isActive ? '#000000' : '#FFFFFF33'}
            >
              {item.label}
            </Text>
          </Box>
        )
      })}
    </Group>
  )
}
