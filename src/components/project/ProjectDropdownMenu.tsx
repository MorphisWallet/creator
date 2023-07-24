import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { api } from '@/utils/api'
import { notifications } from '@mantine/notifications'
import { ActionIcon, LoadingOverlay, Menu } from '@mantine/core'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react'
import { type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '@/server/api/root'

type RouterOutput = inferRouterOutputs<AppRouter>

type ProjectListOutput = RouterOutput['project']['list']

export const ProjectDropdownMenu = ({ id }: { id: string }) => {
  const router = useRouter()
  const goToEdit = () => {
    void router.push(`/dashboard/project/edit/${id}`)
  }

  const queryClient = useQueryClient()
  const queryKey = getQueryKey(api.project.list, undefined, 'query')

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
          onClick={() => mutate(id)}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
