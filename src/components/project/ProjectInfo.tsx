import { TextInput, Button, Box, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { api } from '@/utils/api'
import { notifications } from '@mantine/notifications'

export type ProjectInfoProps = {
  name: string
  description: string
  link: string
}

export const ProjectInfo = ({ name, description, link }: ProjectInfoProps) => {
  const form = useForm({
    initialValues: {
      name,
      description,
      link,
    },
    validate: {
      name: value => (value.length > 50 ? 'Name must not exceed 50 characters' : null),
      description: value => (value.length > 500 ? 'Description must not exceed 500 characters' : null),
      link: value => (value.length > 255 ? 'Link must not exceed 100 characters' : null),
    },
  })

  const { mutate, isLoading } = api.project.updateProject.useMutation({
    onError: error => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    },
    onSuccess: data => {
      notifications.show({
        title: 'Success',
        message: data.message,
        color: 'green',
      })
    },
  })

  return (
    <Box maw={500}>
      <form
        onSubmit={form.onSubmit(values => {
          mutate(values)
        })}
      >
        <TextInput
          label="Project Name"
          placeholder="The name your project"
          required
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Project Description"
          placeholder="The description of your project"
          required
          {...form.getInputProps('description')}
          minRows={6}
        />
        <TextInput
          label="Project Link"
          placeholder="The link to your project"
          required
          {...form.getInputProps('link')}
        />
        <Button
          type="submit"
          mt="md"
          loading={isLoading}
        >
          Save
        </Button>
      </form>
    </Box>
  )
}
