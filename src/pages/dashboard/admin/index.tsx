import Head from 'next/head'
import { api } from '@/utils/api'
import {
  Button,
  Group,
  Image,
  Modal,
  Pagination,
  Select,
  Table,
  TextInput,
  Text,
  Checkbox,
  LoadingOverlay,
  Center,
  Radio,
} from '@mantine/core'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { ProjectStatusBadge } from '@/components/project/ProjectStatusBadge'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { useDidUpdate, useDisclosure } from '@mantine/hooks'
import { type GetServerSideProps } from 'next'
import { ProjectStatus } from '@prisma/client'
import { pascalToNormal } from '@/utils/string'
import { modals } from '@mantine/modals'
import { Layout } from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerAuthSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  if (session.user.role !== 'Admin') {
    return {
      notFound: true,
    }
  }

  return {
    props: {},
  }
}

type ActionButtonsProps = {
  id: string
  refetch: () => void
  isFeatured: boolean
}

const ActionButtons = ({ id, refetch, isFeatured }: ActionButtonsProps) => {
  const router = useRouter()
  const goToProjectDetail = (id: string) => {
    void router.push(`/dashboard/project/${id}`)
  }
  const [rejectReason, setRejectReason] = useState('')

  const { mutate: mutateApproveProject, isLoading: isMutatingApproveProject } = api.admin.approveProjectById.useMutation({
    onSuccess: data => {
      notifications.show({
        title: 'Success',
        message: data.message,
        color: 'green',
      })
      refetch()
    },
    onError: error => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    },
    onSettled: () => {
      setRejectReason('')
    },
  })
  const { mutate: mutateRejectProject, isLoading: isMutatingRejectProject } = api.admin.rejectProjectById.useMutation({
    onSuccess: data => {
      notifications.show({
        title: 'Success',
        message: data.message,
        color: 'green',
      })
      refetch()
    },
    onError: error => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    },
  })
  const { mutate: mutateDeleteProject, isLoading: isMutatingDeleteProject } = api.admin.deleteProjectById.useMutation({
    onSuccess: data => {
      notifications.show({
        title: 'Success',
        message: data.message,
        color: 'green',
      })
      refetch()
    },
    onError: error => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    },
  })

  const { mutate: mutateSetFeaturedStatus, isLoading: isMutatingSetFeaturedStatus } = api.admin.setProjectFeatureStatusById.useMutation({
    onSuccess: data => {
      notifications.show({
        title: 'Success',
        message: data.message,
        color: 'green',
      })
      refetch()
    },
    onError: error => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    },
  })

  const [opened, handlers] = useDisclosure(false)

  const confirmDelete = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to delete this project?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => mutateDeleteProject(id),
    })

  return (
    <Group>
      <Button
        color="indigo"
        onClick={() =>
          mutateSetFeaturedStatus({
            id,
            isFeatured: !isFeatured,
          })
        }
        loading={isMutatingSetFeaturedStatus}
      >
        Set as {isFeatured ? 'Not Featured' : 'Featured'}
      </Button>
      <Button
        color="green"
        onClick={() => mutateApproveProject(id)}
        loading={isMutatingApproveProject}
      >
        Approve
      </Button>
      <Button
        color="yellow"
        onClick={handlers.open}
        loading={isMutatingRejectProject}
      >
        Reject
      </Button>
      <Button
        color="red"
        onClick={confirmDelete}
        loading={isMutatingDeleteProject}
      >
        Delete
      </Button>
      <Button onClick={() => goToProjectDetail(id)}>View Detail</Button>
      <Modal
        opened={opened}
        onClose={handlers.close}
        title={'Reject Project'}
      >
        <TextInput
          label="Reason"
          placeholder="Your Reason to reject this project"
          data-autofocus
          value={rejectReason}
          onChange={event => setRejectReason(event.currentTarget.value)}
        />
        <Button
          fullWidth
          onClick={() => {
            mutateRejectProject({
              id,
              reason: rejectReason,
            })
            handlers.close()
          }}
          mt="md"
        >
          Submit
        </Button>
      </Modal>
    </Group>
  )
}

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const projectStatusesOptions = Object.values(ProjectStatus).map(status => ({
    value: status,
    label: pascalToNormal(status),
  }))
  const [featuredValue, setFeaturedValue] = useState('All')
  const [projectStatus, setProjectStatus] = useState<ProjectStatus[]>([ProjectStatus.InReview])
  const skip = (currentPage - 1) * pageSize
  const { data, refetch, isRefetching } = api.admin.listProjects.useQuery(
    {
      take: pageSize,
      skip: skip,
      status: projectStatus,
      featured: featuredValue as 'Featured' | 'NotFeatured' | 'All',
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )
  const totalPage = Math.ceil((data?.count ?? 0) / pageSize)

  useDidUpdate(() => {
    setCurrentPage(1)
    setPageSize(10)
  }, [projectStatus, featuredValue])

  const rows = data?.projects?.map(project => (
    <tr key={project.id}>
      <td>{project.id}</td>
      <td>{project.name}</td>
      <td>
        <Image
          src={project.logoUrl}
          width={50}
          height={50}
          alt="Logo"
        />
      </td>
      <td width={150}>
        <ProjectStatusBadge status={project.status} />
      </td>
      <td>{project.isFeatured ? '✅' : '❌'}</td>
      <td>{project.viewCount}</td>
      <td>{dayjs(project.createdAt).format('DD/MM/YYYY HH:mm')}</td>
      <td width={400}>
        <ActionButtons
          id={project.id}
          refetch={() => void refetch()}
          isFeatured={project.isFeatured}
        />
      </td>
    </tr>
  ))

  const displayRow = data?.projects?.length ? (
    rows
  ) : (
    <tr>
      <td
        colSpan={8}
        height={200}
      >
        <Center>No data</Center>
      </td>
    </tr>
  )

  return (
    <Layout>
      <Head>
        <title>Kiosk - Admin</title>
      </Head>
      <h1>Admin Dashboard</h1>
      <Checkbox.Group
        value={projectStatus}
        label={'Status'}
        onChange={value => setProjectStatus(value as ProjectStatus[])}
      >
        <Group>
          {projectStatusesOptions.map(option => (
            <Checkbox
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </Group>
      </Checkbox.Group>
      <Radio.Group
        label="Featured Status"
        my={'md'}
        value={featuredValue}
        onChange={setFeaturedValue}
      >
        <Group>
          <Radio
            value="All"
            label="All"
          />
          <Radio
            value="Featured"
            label="Featured"
          />
          <Radio
            value="NotFeatured"
            label="Not Featured"
          />
        </Group>
      </Radio.Group>
      <Table
        striped
        sx={{ position: 'relative' }}
      >
        <LoadingOverlay
          visible={isRefetching}
          overlayBlur={2}
        />
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Logo</th>
            <th>Status</th>
            <th>Featured?</th>
            <th>View</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{displayRow}</tbody>
      </Table>
      {data?.projects?.length && data.projects.length > 0 ? (
        <Group mt={'md'}>
          <Pagination
            value={currentPage}
            total={totalPage}
            onChange={setCurrentPage}
          />
          <Group ml={'xl'}>
            <Text>Results per page:</Text>
            <Select
              value={pageSize.toString()}
              onChange={val => setPageSize(parseInt(val ?? '0'))}
              data={[
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '50', label: '50' },
              ]}
            />
          </Group>
        </Group>
      ) : null}
    </Layout>
  )
}
