import { useRouter } from 'next/router'
import { api } from '@/utils/api'
import { notifications } from '@mantine/notifications'
import { ActionIcon, Menu, Text } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { modals } from '@mantine/modals'

type Props = {
  id: string
  onDeleted: () => void
}

export const ProjectDropdownMenu = ({ id, onDeleted }: Props) => {
  const router = useRouter()
  const goToEdit = () => {
    void router.push(`/dashboard/project/edit/${id}`)
  }

  const confirmDelete = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to delete this project?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => mutate(id),
    })

  const { mutate } = api.project.deleteById.useMutation({
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
      onDeleted()
    },
  })

  return (
    <Menu shadow="md">
      <Menu.Target>
        <ActionIcon
          variant="transparent"
          onClick={e => e.stopPropagation()}
        >
          <svg
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.25391 7.3125C3.51245 7.3125 3.76845 7.36342 4.00731 7.46236C4.24617 7.5613 4.46321 7.70632 4.64602 7.88913C4.82884 8.07195 4.97386 8.28898 5.07279 8.52784C5.17173 8.7667 5.22266 9.02271 5.22266 9.28125C5.22266 9.53979 5.17173 9.7958 5.07279 10.0347C4.97386 10.2735 4.82884 10.4906 4.64602 10.6734C4.46321 10.8562 4.24617 11.0012 4.00731 11.1001C3.76845 11.1991 3.51245 11.25 3.25391 11.25C2.73176 11.25 2.231 11.0426 1.86179 10.6734C1.49258 10.3042 1.28516 9.8034 1.28516 9.28125C1.28516 8.75911 1.49258 8.25835 1.86179 7.88913C2.231 7.51992 2.73176 7.3125 3.25391 7.3125ZM9.16016 7.3125C9.4187 7.3125 9.6747 7.36342 9.91356 7.46236C10.1524 7.5613 10.3695 7.70632 10.5523 7.88913C10.7351 8.07195 10.8801 8.28898 10.979 8.52784C11.078 8.7667 11.1289 9.02271 11.1289 9.28125C11.1289 9.53979 11.078 9.7958 10.979 10.0347C10.8801 10.2735 10.7351 10.4906 10.5523 10.6734C10.3695 10.8562 10.1524 11.0012 9.91356 11.1001C9.6747 11.1991 9.4187 11.25 9.16016 11.25C8.63801 11.25 8.13725 11.0426 7.76804 10.6734C7.39883 10.3042 7.19141 9.8034 7.19141 9.28125C7.19141 8.75911 7.39883 8.25835 7.76804 7.88913C8.13725 7.51992 8.63801 7.3125 9.16016 7.3125ZM15.0664 7.3125C15.3249 7.3125 15.581 7.36342 15.8198 7.46236C16.0587 7.5613 16.2757 7.70632 16.4585 7.88913C16.6413 8.07195 16.7864 8.28898 16.8853 8.52784C16.9842 8.7667 17.0352 9.02271 17.0352 9.28125C17.0352 9.53979 16.9842 9.7958 16.8853 10.0347C16.7864 10.2735 16.6413 10.4906 16.4585 10.6734C16.2757 10.8562 16.0587 11.0012 15.8198 11.1001C15.581 11.1991 15.3249 11.25 15.0664 11.25C14.5443 11.25 14.0435 11.0426 13.6743 10.6734C13.3051 10.3042 13.0977 9.8034 13.0977 9.28125C13.0977 8.75911 13.3051 8.25835 13.6743 7.88913C14.0435 7.51992 14.5443 7.3125 15.0664 7.3125Z"
              fill="#E6E6E6"
            />
          </svg>
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
