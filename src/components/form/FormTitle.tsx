import { Group, Text } from '@mantine/core'

type FormTitleProps = {
  label: string
  required?: boolean
}

export const FormTitle = ({ label, required }: FormTitleProps) => {
  return (
    <Group
      align={'center'}
      spacing={5}
    >
      <Text
        size={16}
        color={'white.1'}
        fw={700}
      >
        {label}
      </Text>
      {required && (
        <Text
          size={16}
          color={'#FC5A5A'}
          fw={700}
        >
          {'*'}
        </Text>
      )}
    </Group>
  )
}
