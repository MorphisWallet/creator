import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { api } from '@/utils/api'
import { notifications } from '@mantine/notifications'
import { ActionIcon, LoadingOverlay, Menu, Text } from '@mantine/core'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react'
import { type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '@/server/api/root'
import { modals } from '@mantine/modals'

type RouterOutput = inferRouterOutputs<AppRouter>

type ProjectListOutput = RouterOutput['project']['list']

type Props = {
  id: string
  onDeleted?: () => void
}

export const ProjectDropdownMenu = ({ id, onDeleted }: Props) => {
  const router = useRouter()
  const goToEdit = () => {
    void router.push(`/dashboard/project/edit/${id}`)
  }

  const queryClient = useQueryClient()
  const queryKey = getQueryKey(api.project.list, undefined, 'query')

  const confirmDelete = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to delete this project?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => mutate(id),
    })

  const { mutate, isLoading } = api.project.deleteById.useMutation({
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
      //remove item from cache
      queryClient.setQueryData<ProjectListOutput>(queryKey, old => {
        if (!old)
          return {
            projects: [],
          }
        return {
          projects: old.projects.filter(item => item.id !== id),
        }
      })
      onDeleted?.()
    },
  })

  return (
    <Menu shadow="md">
      <LoadingOverlay
        visible={isLoading}
        overlayBlur={2}
      />
      <Menu.Target>
        <ActionIcon
          variant="outline"
          radius={'xl'}
          onClick={e => e.stopPropagation()}
        >
          <IconDots size="1rem" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown onClick={e => e.stopPropagation()}>
        <Menu.Item
          icon={<IconEdit size={14} />}
          onClick={goToEdit}
        >
          Edit details
        </Menu.Item>
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} />}
          onClick={confirmDelete}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
